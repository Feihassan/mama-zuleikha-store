import express from 'express';
import pool from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create new order (authenticated users only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    const { customerName, customerEmail, customerPhone, items, totalAmount } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !totalAmount || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Validate total amount
    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'Total amount must be greater than 0' });
    }

    // Verify user owns this order (email should match authenticated user)
    if (customerEmail !== req.user.email) {
      return res.status(403).json({ error: 'Order email must match authenticated user' });
    }

    // Create order
    console.log('Inserting order into database...');
    const orderResult = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount) VALUES ($1, $2, $3, $4) RETURNING id',
      [customerName, customerEmail, customerPhone, totalAmount]
    );

    const orderId = orderResult.rows[0].id;
    console.log('Order created with ID:', orderId);

    // Add order items with validation
    console.log('Adding order items...');
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ error: 'Invalid item data' });
      }

      if (item.quantity <= 0 || item.price <= 0) {
        return res.status(400).json({ error: 'Item quantity and price must be positive' });
      }

      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    // Log user activity
    await pool.query(
      'INSERT INTO user_activity (user_id, action, ip, user_agent, metadata) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'order_created', req.ip, req.get('User-Agent'), JSON.stringify({ orderId, totalAmount })]
    );

    console.log('Order created successfully');
    res.json({ orderId, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Get all orders (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.*,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (seller view) - orders that include products belonging to the seller
router.get('/seller', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Seller access required' });

    const result = await pool.query(`
      SELECT
        o.*,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID (public endpoint for tracking)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT
        o.*,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.patch('/:orderId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, mpesaCheckoutId } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    }

    await pool.query(
      'UPDATE orders SET status = $1, mpesa_checkout_id = $2 WHERE id = $3',
      [status, mpesaCheckoutId || null, orderId]
    );

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
});

// Delete order (admin only) - only for cancelled orders
router.delete('/:orderId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if order exists and is cancelled
    const orderCheck = await pool.query('SELECT status FROM orders WHERE id = $1', [orderId]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (orderCheck.rows[0].status !== 'cancelled') {
      return res.status(400).json({ error: 'Can only delete cancelled orders' });
    }

    // Delete order items first (due to foreign key constraint)
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [orderId]);

    // Delete the order
    await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
});

export { router as orderRoutes };