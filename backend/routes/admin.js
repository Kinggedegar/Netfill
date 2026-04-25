import express from 'express';
import { db, runQuery, runInsert, runUpdate } from '../db/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all users
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await runQuery(
      'SELECT id, username, email, role, payment_plan, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user login history
router.get('/users/:userId/logins', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const logins = await runQuery(
      'SELECT * FROM user_logins WHERE user_id = ? ORDER BY login_time DESC LIMIT 50',
      [req.params.userId]
    );
    res.json({ logins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active users (logged in today)
router.get('/stats/active-users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await runQuery(`
      SELECT COUNT(DISTINCT user_id) as active_count 
      FROM user_logins 
      WHERE DATE(login_time) = DATE('now')
    `);
    res.json({ activeUsers: result[0].active_count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total users
router.get('/stats/total-users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await runQuery('SELECT COUNT(*) as total FROM users');
    res.json({ totalUsers: result[0].total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment plans
router.get('/payment-plans', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const plans = await runQuery('SELECT * FROM payment_plans ORDER BY price ASC');
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment plan
router.post('/payment-plans', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, price, features, max_screens, video_quality } = req.body;

    await runInsert(
      `INSERT INTO payment_plans (name, price, features, max_screens, video_quality)
       VALUES (?, ?, ?, ?, ?)`,
      [name, price, JSON.stringify(features), max_screens, video_quality]
    );

    res.status(201).json({ message: 'Payment plan created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment plan
router.put('/payment-plans/:planId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, price, features, max_screens, video_quality } = req.body;

    await runUpdate(
      `UPDATE payment_plans SET name = ?, price = ?, features = ?, max_screens = ?, video_quality = ?
       WHERE id = ?`,
      [name, price, JSON.stringify(features), max_screens, video_quality, req.params.planId]
    );

    res.json({ message: 'Payment plan updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete payment plan
router.delete('/payment-plans/:planId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await runUpdate('DELETE FROM payment_plans WHERE id = ?', [req.params.planId]);
    res.json({ message: 'Payment plan deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user payment plan
router.put('/users/:userId/plan', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { payment_plan } = req.body;

    await runUpdate(
      'UPDATE users SET payment_plan = ? WHERE id = ?',
      [payment_plan, req.params.userId]
    );

    res.json({ message: 'User payment plan updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await runQuery('SELECT COUNT(*) as count FROM users');
    const totalMovies = await runQuery('SELECT COUNT(*) as count FROM movies');
    const activeToday = await runQuery(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM user_logins 
      WHERE DATE(login_time) = DATE('now')
    `);
    const totalViews = await runQuery('SELECT SUM(views) as count FROM movies');

    res.json({
      totalUsers: totalUsers[0].count,
      totalMovies: totalMovies[0].count,
      activeToday: activeToday[0].count,
      totalViews: totalViews[0].count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending payments
router.get('/pending-payments', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payments = await runQuery(`
      SELECT 
        pp.id, 
        pp.user_id, 
        pp.plan_name, 
        pp.amount, 
        pp.status,
        pp.created_at,
        u.username,
        u.email
      FROM pending_payments pp
      JOIN users u ON pp.user_id = u.id
      WHERE pp.status = 'pending'
      ORDER BY pp.created_at DESC
    `);
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve payment
router.post('/payment/:paymentId/approve', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Get payment details
    const payments = await runQuery('SELECT * FROM pending_payments WHERE id = ?', [req.params.paymentId]);
    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = payments[0];

    // Update payment status
    await runUpdate(
      'UPDATE pending_payments SET status = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['approved', req.params.paymentId]
    );

    // Update user's payment plan
    await runUpdate(
      'UPDATE users SET payment_plan = ? WHERE id = ?',
      [payment.plan_name, payment.user_id]
    );

    res.json({ 
      message: 'Payment approved',
      user: payment.user_id,
      plan: payment.plan_name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject payment
router.post('/payment/:paymentId/reject', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Update payment status
    await runUpdate(
      'UPDATE pending_payments SET status = ? WHERE id = ?',
      ['rejected', req.params.paymentId]
    );

    res.json({ message: 'Payment rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track user login
router.post('/track-login', verifyToken, async (req, res) => {
  try {
    const { device } = req.body;
    
    await runInsert(
      'INSERT INTO user_logins (user_id, device) VALUES (?, ?)',
      [req.userId, device || 'Unknown']
    );

    res.json({ message: 'Login tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
