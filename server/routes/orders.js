import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    const { customerName, customerEmail, customerPhone, items, totalAmount } = req.body;
    
    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !totalAmount || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create order
    console.log('Inserting order into database...');
    const orderResult = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount) VALUES ($1, $2, $3, $4) RETURNING id',
      [customerName, customerEmail, customerPhone, totalAmount]
    );
    
    const orderId = orderResult.rows[0].id;
    console.log('Order created with ID:', orderId);
    
    // Add order items
    console.log('Adding order items...');
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }
    
    console.log('Order created successfully');
    res.json({ orderId, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (for payment callbacks)
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, mpesaCheckoutId } = req.body;
    
    await pool.query(
      'UPDATE orders SET status = $1, mpesa_checkout_id = $2 WHERE id = $3',
      [status, mpesaCheckoutId, orderId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export { router as orderRoutes };