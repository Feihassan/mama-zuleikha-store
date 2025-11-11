import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a product
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      'SELECT * FROM product_reviews WHERE product_id = $1 ORDER BY created_at DESC',
      [productId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create a review for a product (authenticated users only)
router.post('/products/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters long' });
    }

    // Check if product exists
    const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await pool.query(
      'SELECT id FROM product_reviews WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const result = await pool.query(
      'INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, userId, rating, comment.trim()]
    );

    // Log user activity
    await pool.query(
      'INSERT INTO user_activity (user_id, action, ip, user_agent, metadata) VALUES ($1, $2, $3, $4, $5)',
      [userId, 'review_created', req.ip, req.get('User-Agent'), JSON.stringify({ productId, reviewId: result.rows[0].id })]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review', details: error.message });
  }
});

export { router as reviewRoutes };