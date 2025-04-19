const pool = require('../db');

const addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const [cartRows] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    let cartId;
    
    if (cartRows.length === 0) {
      const [cartResult] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      cartId = cartResult.insertId;
    } else {
      cartId = cartRows[0].id;
    }
    await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
    res.status(200).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding item to cart', details: err.message });
  }
};

const getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const [cartRows] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    if (cartRows.length > 0) {
      const cartId = cartRows[0].id;
      const [items] = await pool.query('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);
      res.status(200).json(items);
    } else {
      res.status(404).json({ message: 'Cart is empty' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart items', details: err.message });
  }
};

module.exports = { addItemToCart, getCartItems };
