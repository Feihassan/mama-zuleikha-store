import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
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

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image_url, category, stock_quantity } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields: name, description, price, category' });
    }

    // Ensure name and description are not too long
    const trimmedName = name.substring(0, 255);
    const trimmedDescription = description.substring(0, 1000); // Reasonable limit for description
    const trimmedImageUrl = image_url ? image_url.substring(0, 500) : null;
    const trimmedCategory = category.substring(0, 100);

    const result = await pool.query(
      'INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [trimmedName, trimmedDescription, price, trimmedImageUrl, trimmedCategory, stock_quantity || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, stock_quantity } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields: name, description, price, category' });
    }

    // Ensure name and description are not too long
    const trimmedName = name.substring(0, 255);
    const trimmedDescription = description.substring(0, 1000);
    const trimmedImageUrl = image_url ? image_url.substring(0, 500) : null;
    const trimmedCategory = category.substring(0, 100);



    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, stock_quantity = $6 WHERE id = $7 RETURNING *',
      [trimmedName, trimmedDescription, price, trimmedImageUrl, trimmedCategory, stock_quantity || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

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

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

export { router as productRoutes };