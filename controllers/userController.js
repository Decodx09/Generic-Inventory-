const pool = require('../db');

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, password, phone]
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      res.status(200).json({ message: 'Login successful', user: rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error logging in', details: err.message });
  }
};

module.exports = { registerUser, loginUser };
