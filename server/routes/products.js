import express from 'express';
import pool from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(1000).required(),
  price: Joi.number().positive().required(),
  image_url: Joi.string().allow(null, ''),
  category: Joi.string().min(1).max(100).required(),
  stock_quantity: Joi.number().integer().min(0).default(0)
});

const searchSchema = Joi.object({
  search: Joi.string().min(1).max(100).allow(''),
  category: Joi.string().min(1).max(100).allow(''),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  sortBy: Joi.string().valid('name', 'price', 'created_at').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Get all products with filtering, searching, and pagination
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { search, category, minPrice, maxPrice, sortBy, sortOrder, page, limit } = value;
    const offset = (page - 1) * limit;

    // Build query dynamically
    let query = 'SELECT *, COUNT(*) OVER() AS total_count FROM products WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Add search filter
    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add category filter
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Add price filters
    if (minPrice !== undefined) {
      query += ` AND price >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }

    if (maxPrice !== undefined) {
      query += ` AND price <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }

    // Add sorting
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Execute main query
    const result = await pool.query(query, params);

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const products = result.rows.map((row) => {
      const { total_count: _total_count, ...product } = row;
      return product;
    });

    res.json({
      products: products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Validate input with Joi
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, price, image_url, category, stock_quantity } = value;

    // Sanitize inputs (additional layer)
    const sanitizedData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image_url: image_url ? image_url.trim() : null,
      category: category.trim(),
      stock_quantity: parseInt(stock_quantity) || 0
    };

    const result = await pool.query(
      'INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [sanitizedData.name, sanitizedData.description, sanitizedData.price, sanitizedData.image_url, sanitizedData.category, sanitizedData.stock_quantity]
    );

    // Log admin activity
    await pool.query(
      'INSERT INTO user_activity (user_id, action, ip, user_agent, metadata) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'product_created', req.ip, req.get('User-Agent'), JSON.stringify({ productId: result.rows[0].id })]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input with Joi
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, price, image_url, category, stock_quantity } = value;

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image_url: image_url ? image_url.trim() : null,
      category: category.trim(),
      stock_quantity: parseInt(stock_quantity) || 0
    };

    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, stock_quantity = $6 WHERE id = $7 RETURNING *',
      [sanitizedData.name, sanitizedData.description, sanitizedData.price, sanitizedData.image_url, sanitizedData.category, sanitizedData.stock_quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Log admin activity
    await pool.query(
      'INSERT INTO user_activity (user_id, action, ip, user_agent, metadata) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'product_updated', req.ip, req.get('User-Agent'), JSON.stringify({ productId: id })]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Check if product exists
    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is referenced in any orders
    const orderCheck = await pool.query('SELECT COUNT(*) FROM order_items WHERE product_id = $1', [id]);
    if (parseInt(orderCheck.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete product that has been ordered. Consider marking it as out of stock instead.'
      });
    }

    // Delete the product
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    // Log admin activity
    await pool.query(
      'INSERT INTO user_activity (user_id, action, ip, user_agent, metadata) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'product_deleted', req.ip, req.get('User-Agent'), JSON.stringify({ productId: id, productName: result.rows[0].name })]
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export { router as productRoutes };