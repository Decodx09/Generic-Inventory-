const pool = require('../db');

const searchProducts = async (req, res) => {
    const { query, category } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Search query cannot be empty' });
    }

    try {
        const sql = category
            ? 'SELECT * FROM products WHERE LOWER(name) LIKE LOWER(?) AND category = ?'
            : 'SELECT * FROM products WHERE LOWER(name) LIKE LOWER(?)';

        const params = category
            ? [`%${query}%`, category]
            : [`%${query}%`];

        const [rows] = await pool.query(sql, params);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Search Error:', err);
        res.status(500).json({ error: 'Error searching products', details: err.message });
    }
};

module.exports = { searchProducts };
