const pool = require('../db');

const orders = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders', details: err.message });
  }
};

const createOrder = async (req, res) => {
  const { userId, addressId, items, totalAmount } = req.body;
  try {
    const [orderResult] = await pool.query(
      'INSERT INTO orders (user_id, address_id, total_amount) VALUES (?, ?, ?)',
      [userId, addressId, totalAmount]
    );
    const orderId = orderResult.insertId;

    for (let item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    res.status(500).json({ error: 'Error creating order', details: err.message });
  }
};

const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders', details: err.message });
  }
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting order', details: err.message });
  }
};

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating order', details: err.message });
  }
};



module.exports = { createOrder, getOrdersByUser, orders, deleteOrder, updateOrder };
