import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import asyncHandler from '../utils/asyncHandler';

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/SuperAdmin
export const getDashboardAnalytics = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    // Total counts
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    // Total sales (sum of paid orders)
    const salesResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const totalSales = salesResult[0]?.totalSales || 0;

    // Monthly revenue (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent orders (last 10)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top selling products (top 5)
    const topProducts = await Product.find()
      .sort({ soldCount: -1 })
      .limit(5)
      .select('title slug price images soldCount');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales: Math.round(totalSales * 100) / 100,
        monthlyRevenue,
        orderStatusDistribution,
        recentOrders,
        topProducts,
      },
    });
  }
);
