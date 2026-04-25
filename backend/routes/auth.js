import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../middleware/auth.js';
import { db, runQuery, runInsert, runUpdate } from '../db/database.js';

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await runQuery('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await runInsert(
      'INSERT INTO users (username, email, password, theme) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'dark']
    );

    const token = generateToken(result.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.id, username, email, theme: 'dark', role: 'user' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const users = await runQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Signed in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        theme: user.theme,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const users = await runQuery('SELECT id, username, email, avatar, theme, language, role FROM users WHERE id = ?', [req.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Settings
router.put('/settings', verifyToken, async (req, res) => {
  try {
    const { theme, language, notifications_enabled } = req.body;
    const updates = [];
    const params = [];

    if (theme) {
      updates.push('theme = ?');
      params.push(theme);
    }
    if (language) {
      updates.push('language = ?');
      params.push(language);
    }
    if (notifications_enabled !== undefined) {
      updates.push('notifications_enabled = ?');
      params.push(notifications_enabled ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    params.push(req.userId);
    await runUpdate(`UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set User Role (Admin endpoint for testing)
router.post('/set-role', async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role required' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "admin"' });
    }

    await runUpdate('UPDATE users SET role = ? WHERE email = ?', [role, email]);

    res.json({ message: `User role set to ${role}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Payment for Premium Plan
router.post('/submit-payment', verifyToken, async (req, res) => {
  try {
    const { planName, amount } = req.body;

    if (!planName || !amount) {
      return res.status(400).json({ error: 'Plan name and amount required' });
    }

    // Insert pending payment
    const result = await runInsert(
      'INSERT INTO pending_payments (user_id, plan_name, amount, status) VALUES (?, ?, ?, ?)',
      [req.userId, planName, amount, 'pending']
    );

    res.status(201).json({
      message: 'Payment submitted for approval',
      paymentId: result.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment status for current user
router.get('/payment-status', verifyToken, async (req, res) => {
  try {
    const payments = await runQuery(
      'SELECT id, plan_name, amount, status, created_at FROM pending_payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.userId]
    );
    res.json({ payment: payments[0] || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
