"use client";
import React, { useEffect, useState } from "react";
import { adminDashboardService, getAssetUrl } from "@/services/adminService";

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyRevenue: { _id: { year: number; month: number }; revenue: number; orders: number }[];
  orderStatusDistribution: { _id: string; count: number }[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService
      .getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="alert alert-danger m-4">Failed to load dashboard data</div>;
  }

  const getStatusCount = (status: string) =>
    data.orderStatusDistribution.find((s) => s._id === status)?.count || 0;

  const totalDelivered = getStatusCount("delivered");
  const totalPending = getStatusCount("pending");
  const totalCancelled = getStatusCount("cancelled");

  // Revenue chart data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = data.monthlyRevenue || [];
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  // Donut chart values
  const statusData = [
    { label: "Online", count: totalDelivered, color: "#3b82f6" },
    { label: "Offline", count: totalPending, color: "#f59e0b" },
    { label: "Trade", count: totalCancelled, color: "#10b981" },
  ];
  const totalStatusCount = statusData.reduce((acc, s) => acc + s.count, 0) || 1;

  // Sparkline helper
  const getSparklinePath = (values: number[]) => {
    if (values.length < 2) return "";
    const max = Math.max(...values, 1);
    const w = 120;
    const h = 40;
    const step = w / (values.length - 1);
    return values.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (v / max) * h}`).join(" ");
  };

  const revenueValues = chartData.map((d) => d.revenue);
  const orderValues = chartData.map((d) => d.orders);

  const getStockStatus = (product: any) => {
    const stock = product.stock ?? 0;
    if (stock === 0) return { label: "OUT OF STOCK", className: "stock-out" };
    if (stock < 50) return { label: "LOW STOCK", className: "stock-low" };
    return { label: "IN STOCK", className: "stock-in" };
  };

  return (
    <div className="dashboard-page">
      {/* ── Top Stats ── */}
      <div className="dashboard-stats-row">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card__top">
            <div className="dashboard-stat-card__icon dashboard-stat-card__icon--green">
              <i className="fi fi-rr-dollar" />
            </div>
            <span className="dashboard-stat-card__title">Total Sales</span>
          </div>
          <div className="dashboard-stat-card__body">
            <div className="dashboard-stat-card__value">
              ${data.totalSales.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="dashboard-stat-card__sparkline">
              <svg viewBox="0 0 120 40" preserveAspectRatio="none">
                <path d={getSparklinePath(revenueValues)} fill="none" stroke="#10b981" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="dashboard-stat-card__footer">
            <span className="dashboard-stat-card__change dashboard-stat-card__change--up">
              <i className="fi fi-rr-arrow-trend-up" /> +1.01% this week
            </span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card__top">
            <div className="dashboard-stat-card__icon dashboard-stat-card__icon--orange">
              <i className="fi fi-rr-shopping-bag" />
            </div>
            <span className="dashboard-stat-card__title">Total Orders</span>
          </div>
          <div className="dashboard-stat-card__body">
            <div className="dashboard-stat-card__value">${data.totalOrders.toLocaleString()}</div>
            <div className="dashboard-stat-card__sparkline">
              <svg viewBox="0 0 120 40" preserveAspectRatio="none">
                <path d={getSparklinePath(orderValues)} fill="none" stroke="#f59e0b" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="dashboard-stat-card__footer">
            <span className="dashboard-stat-card__change dashboard-stat-card__change--down">
              <i className="fi fi-rr-arrow-trend-down" /> -0.31% this week
            </span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card__top">
            <div className="dashboard-stat-card__icon dashboard-stat-card__icon--red">
              <i className="fi fi-rr-sack-dollar" />
            </div>
            <span className="dashboard-stat-card__title">Total Earnings</span>
          </div>
          <div className="dashboard-stat-card__body">
            <div className="dashboard-stat-card__value">
              ${data.totalSales.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="dashboard-stat-card__sparkline">
              <svg viewBox="0 0 120 40" preserveAspectRatio="none">
                <path d={getSparklinePath(revenueValues)} fill="none" stroke="#ef4444" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="dashboard-stat-card__footer">
            <span className="dashboard-stat-card__change dashboard-stat-card__change--up">
              <i className="fi fi-rr-arrow-trend-up" /> +1.01% this week
            </span>
          </div>
        </div>
      </div>

      {/* ── Middle Row: Chart + Donut ── */}
      <div className="dashboard-middle-row">
        <div className="dashboard-card dashboard-chart-card">
          <div className="dashboard-card__header">
            <h3>Orders Analytics</h3>
            <div className="dashboard-chart-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: "#3b82f6" }} /> Online orders</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: "#ef4444" }} /> Offline orders</span>
              <span className="legend-filter">Monthly</span>
            </div>
          </div>
          <div className="dashboard-chart-area">
            <div className="chart-y-labels">
              {[100, 80, 60, 40, 20, 0].map((v) => (<span key={v}>{v}</span>))}
            </div>
            <div className="chart-graph">
              <svg viewBox={`0 0 ${Math.max(chartData.length * 60, 420)} 200`} preserveAspectRatio="none" className="chart-svg">
                {[0, 40, 80, 120, 160, 200].map((y) => (
                  <line key={y} x1="0" y1={y} x2="100%" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                <polyline
                  fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                  points={chartData.map((d, i) => `${i * 60 + 30},${200 - (d.revenue / (maxRevenue || 1)) * 180}`).join(" ")}
                />
                <polyline
                  fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6,4"
                  points={chartData.map((d, i) => `${i * 60 + 30},${200 - (d.orders / Math.max(...chartData.map((c) => c.orders), 1)) * 180}`).join(" ")}
                />
              </svg>
              <div className="chart-x-labels">
                {chartData.map((d, i) => (<span key={i}>{monthNames[(d._id.month - 1) % 12]}</span>))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card dashboard-donut-card">
          <div className="dashboard-card__header">
            <h3>Most Orders</h3>
            <button className="dashboard-card__menu"><i className="fi fi-rr-menu-dots-vertical" /></button>
          </div>
          <div className="donut-chart-container">
            <svg viewBox="0 0 180 180" className="donut-svg">
              {(() => {
                let cum = 0;
                return statusData.map((item, i) => {
                  const pct = item.count / totalStatusCount;
                  const dash = `${pct * 440} ${440 - pct * 440}`;
                  const offset = -cum * 440;
                  cum += pct;
                  return <circle key={i} cx="90" cy="90" r="70" fill="none" stroke={item.color} strokeWidth="16" strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 90 90)" />;
                });
              })()}
              <text x="90" y="85" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="500">ALL SELLING</text>
              <text x="90" y="105" textAnchor="middle" fontSize="18" fill="#0f172a" fontWeight="700">{data.totalOrders}</text>
            </svg>
          </div>
          <div className="donut-legend">
            {statusData.map((item, i) => (
              <span key={i} className="legend-item"><span className="legend-dot" style={{ background: item.color }} /> {item.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Products List + Most Selling ── */}
      <div className="dashboard-bottom-row">
        <div className="dashboard-card dashboard-products-card">
          <div className="dashboard-card__header">
            <div>
              <h3>Products List</h3>
              <p className="dashboard-card__subtitle">Total {data.totalProducts} products in stock</p>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Qty Left</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-muted">No products</td></tr>
                ) : (
                  data.topProducts.map((p: any) => {
                    const status = getStockStatus(p);
                    return (
                      <tr key={p._id}>
                        <td><span className="fw-semibold">{p.title}</span></td>
                        <td><span className="slug-text">#{p._id.slice(-5).toUpperCase()}</span></td>
                        <td><span className={`stock-badge ${status.className}`}>{status.label}</span></td>
                        <td>${p.price?.toLocaleString(undefined, { minimumFractionDigits: 3 })}</td>
                        <td>{String(p.stock ?? 0).padStart(5, "0")}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card dashboard-selling-card">
          <div className="dashboard-card__header">
            <h3>Most sellings</h3>
            <button className="dashboard-card__menu"><i className="fi fi-rr-menu-dots-vertical" /></button>
          </div>
          <div className="selling-list">
            {data.topProducts.map((p: any) => (
              <div key={p._id} className="selling-item">
                <div className="selling-item__img">
                  {p.images?.[0] ? (
                    <img src={getAssetUrl(p.images[0].url || p.images[0])} alt={p.title} />
                  ) : (
                    <div className="selling-item__placeholder"><i className="fi fi-rr-box" /></div>
                  )}
                </div>
                <div className="selling-item__info">
                  <span className="selling-item__name">{p.title}</span>
                  <span className="selling-item__sold">Sell:{p.soldCount}</span>
                </div>
                <span className="selling-item__price">${p.price?.toLocaleString(undefined, { minimumFractionDigits: 3 })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
