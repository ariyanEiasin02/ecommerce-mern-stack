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

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Smooth cubic-bezier sparkline paths (line + closed area fill) */
function buildSparkline(values: number[]): { line: string; area: string } {
  if (values.length === 0) return { line: "", area: "" };
  if (values.length === 1) values = [values[0] * 0.7, values[0]];

  const W = 300, H = 72, PAD_T = 6, PAD_B = 2;
  const max = Math.max(...values, 1);
  const step = W / (values.length - 1);

  const pts = values.map((v, i) => ({
    x: parseFloat((i * step).toFixed(2)),
    y: parseFloat((PAD_T + (1 - v / max) * (H - PAD_T - PAD_B)).toFixed(2)),
  }));

  let line = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const mid = ((pts[i - 1].x + pts[i].x) / 2).toFixed(2);
    line += ` C${mid},${pts[i - 1].y} ${mid},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  return { line, area: `${line} L${W},${H} L0,${H} Z` };
}

function getStockStatus(p: any): { label: string; cls: string } {
  const s = p.stock ?? 0;
  if (s === 0) return { label: "OUT OF STOCK", cls: "stock-out" };
  if (s < 50) return { label: "LOW STOCK", cls: "stock-low" };
  return { label: "IN STOCK", cls: "stock-in" };
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService.getAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <div className="spinner-border" style={{ color: "#ff6154" }} role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!data) return <div className="alert alert-danger m-4">Failed to load dashboard data</div>;

  // ── Sparklines ────────────────────────────────────────────────────────────
  const chartData = data.monthlyRevenue || [];
  const revSpark = buildSparkline(chartData.map((d) => d.revenue));
  const ordSpark = buildSparkline(chartData.map((d) => d.orders));

  // ── Analytics chart polylines ─────────────────────────────────────────────
  const maxRev = Math.max(...chartData.map((d) => d.revenue), 1);
  const maxOrd = Math.max(...chartData.map((d) => d.orders), 1);
  const CW = Math.max(chartData.length * 60, 420);
  const CH = 200;
  const revPts = chartData.map((d, i) => `${i * 60 + 30},${CH - (d.revenue / maxRev) * (CH - 8)}`).join(" ");
  const ordPts = chartData.map((d, i) => `${i * 60 + 30},${CH - (d.orders / maxOrd) * (CH - 8)}`).join(" ");

  // ── Donut ─────────────────────────────────────────────────────────────────
  const getCount = (s: string) => data.orderStatusDistribution.find((x) => x._id === s)?.count || 0;
  const statusData = [
    { label: "Online",  count: getCount("delivered"), color: "#3b82f6" },
    { label: "Offline", count: getCount("pending"),   color: "#f59e0b" },
    { label: "Trade",   count: getCount("cancelled"), color: "#10b981" },
  ];
  const totalStatus = statusData.reduce((a, s) => a + s.count, 0) || 1;
  const R = 62;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className="dashboard-page">

      {/* ─────────────────── STAT CARDS ─────────────────── */}
      <div className="dashboard-stats-row">

        {/* Total Sales */}
        <div className="ds-card">
          <div className="ds-card__inner">
            <div className="ds-card__top">
              <div className="ds-card__icon ds-card__icon--amber">
                <i className="fi fi-rr-shopping-bag" />
              </div>
              <span className="ds-card__label">Total Sales</span>
              <span className="ds-card__badge ds-card__badge--up">
                <i className="fi fi-rr-arrow-trend-up" /> 10.2
              </span>
            </div>
            <div className="ds-card__value">
              ${data.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="ds-card__sub">+1.01% this week</p>
          </div>
          <div className="ds-card__spark">
            <svg viewBox="0 0 300 72" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sg-sales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.03" />
                </linearGradient>
              </defs>
              <path d={revSpark.area} fill="url(#sg-sales)" />
              <path d={revSpark.line} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Total Orders */}
        <div className="ds-card">
          <div className="ds-card__inner">
            <div className="ds-card__top">
              <div className="ds-card__icon ds-card__icon--red">
                <i className="fi fi-rr-shopping-cart" />
              </div>
              <span className="ds-card__label">Total Orders</span>
              <span className="ds-card__badge ds-card__badge--down">
                <i className="fi fi-rr-arrow-trend-down" /> 1.01
              </span>
            </div>
            <div className="ds-card__value">{data.totalOrders.toLocaleString()}</div>
            <p className="ds-card__sub">-0.31% this week</p>
          </div>
          <div className="ds-card__spark">
            <svg viewBox="0 0 300 72" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sg-orders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.03" />
                </linearGradient>
              </defs>
              <path d={ordSpark.area} fill="url(#sg-orders)" />
              <path d={ordSpark.line} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="ds-card">
          <div className="ds-card__inner">
            <div className="ds-card__top">
              <div className="ds-card__icon ds-card__icon--teal">
                <i className="fi fi-rr-sack-dollar" />
              </div>
              <span className="ds-card__label">Total Earnings</span>
              <span className="ds-card__badge ds-card__badge--up">
                <i className="fi fi-rr-arrow-trend-up" /> 10.2
              </span>
            </div>
            <div className="ds-card__value">
              ${data.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="ds-card__sub">+1.01% this week</p>
          </div>
          <div className="ds-card__spark">
            <svg viewBox="0 0 300 72" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sg-earn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
                </linearGradient>
              </defs>
              <path d={revSpark.area} fill="url(#sg-earn)" />
              <path d={revSpark.line} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* ─────────────────── MIDDLE ROW ─────────────────── */}
      <div className="dashboard-middle-row">

        {/* Orders Analytics */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <div>
              <h3>Orders Analytics</h3>
            </div>
            <div className="dashboard-chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: "#3b82f6" }} />
                Online orders
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: "#f59e0b" }} />
                Offline orders
              </span>
              <span className="legend-filter">Monthly ▾</span>
            </div>
          </div>
          <div className="dashboard-chart-area">
            <div className="chart-y-labels">
              {[100, 80, 60, 40, 20, 0].map((v) => <span key={v}>{v}</span>)}
            </div>
            <div className="chart-graph">
              <svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" className="chart-svg">
                <defs>
                  <linearGradient id="chart-area-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 40, 80, 120, 160, 200].map((y) => (
                  <line key={y} x1="0" y1={y} x2={CW} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                {chartData.length > 1 && (
                  <polygon
                    points={`30,${CH} ${revPts} ${(chartData.length - 1) * 60 + 30},${CH}`}
                    fill="url(#chart-area-bg)"
                  />
                )}
                <polyline
                  fill="none" stroke="#3b82f6" strokeWidth="2.5"
                  strokeLinejoin="round" strokeLinecap="round"
                  points={revPts}
                />
                <polyline
                  fill="none" stroke="#f59e0b" strokeWidth="2"
                  strokeLinejoin="round" strokeLinecap="round"
                  strokeDasharray="8,5"
                  points={ordPts}
                />
              </svg>
              <div className="chart-x-labels">
                {chartData.map((d, i) => (
                  <span key={i}>{MONTHS[(d._id.month - 1) % 12]}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Most Orders Donut */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Most Orders</h3>
            <button className="dashboard-card__menu" aria-label="More options">
              <i className="fi fi-rr-menu-dots-vertical" />
            </button>
          </div>
          <div className="donut-chart-container">
            <svg viewBox="0 0 180 180" className="donut-svg" aria-hidden="true">
              {(() => {
                let cumPct = 0;
                return statusData.map((item, i) => {
                  const pct = item.count / totalStatus;
                  const dash = Math.max(pct * CIRC - 6, 0);
                  const offset = CIRC * 0.25 - cumPct * CIRC;
                  cumPct += pct;
                  return (
                    <circle
                      key={i}
                      cx="90" cy="90" r={R}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="24"
                      strokeDasharray={`${dash} ${CIRC}`}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  );
                });
              })()}
              <text x="90" y="83" textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontWeight="600" letterSpacing="0.8">ALL SELLING</text>
              <text x="90" y="104" textAnchor="middle" fontSize="24" fill="#0f172a" fontWeight="800">{data.totalOrders}</text>
            </svg>
          </div>
          <div className="donut-legend">
            {statusData.map((item, i) => (
              <span key={i} className="legend-item">
                <span className="legend-dot" style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ─────────────────── BOTTOM ROW ─────────────────── */}
      <div className="dashboard-bottom-row">

        {/* Products List */}
        <div className="dashboard-card dashboard-products-card">
          <div className="dashboard-card__header" style={{ paddingBottom: 12 }}>
            <div>
              <h3>Products List</h3>
              <p className="dashboard-card__subtitle">Total {data.totalProducts} products in stock</p>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="ds-product-table">
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
                    const st = getStockStatus(p);
                    return (
                      <tr key={p._id}>
                        <td><span className="ds-product-name">{p.title}</span></td>
                        <td><span className="ds-product-code">#{p._id.slice(-5).toUpperCase()}</span></td>
                        <td><span className={`ds-stock-badge ds-stock-badge--${st.cls}`}>{st.label}</span></td>
                        <td className="ds-product-price">${p.price?.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                        <td className="ds-product-qty">{String(p.stock ?? 0).padStart(5, "0")}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Sellings */}
        <div className="dashboard-card dashboard-selling-card">
          <div className="dashboard-card__header">
            <h3>Most sellings</h3>
            <button className="dashboard-card__menu" aria-label="More options">
              <i className="fi fi-rr-menu-dots-vertical" />
            </button>
          </div>
          <div className="selling-list">
            {data.topProducts.slice(0, 5).map((p: any) => (
              <div key={p._id} className="selling-item">
                <div className="selling-item__img">
                  {p.images?.[0] ? (
                    <img src={getAssetUrl(p.images[0].url || p.images[0])} alt={p.title} />
                  ) : (
                    <div className="selling-item__placeholder">
                      <i className="fi fi-rr-box" />
                    </div>
                  )}
                </div>
                <div className="selling-item__info">
                  <span className="selling-item__name">{p.title}</span>
                  <span className="selling-item__sold">Sell:{p.soldCount ?? 0}</span>
                </div>
                <span className="selling-item__price">
                  ${p.price?.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
