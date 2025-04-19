const pool = require('../db');

const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products', details: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product', details: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product', details: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
      [name, description, price, category, image_url, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product', details: err.message });
  }
};

const categories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories', details: err.message });
  }
};

/**   
 * Retrieves products by category.
 * 
 * This function fetches all products from the database that belong to a specific category
 * provided in the request parameters. It responds with a JSON array of products if successful,
 * or an error message if the operation fails.
 * 
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object for sending JSON results or errors.
 */

const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE category = ?', [category]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products by category', details: err.message });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE name LIKE ?', [`%${query}%`]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error searching products', details: err.message });
  }
};  

const getFeaturedProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE is_featured = 1');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching featured products', details: err.message });
  }
}; 

const addProduct = async (req, res) => {
  const { name, description, price, category, stock = 0, image_url } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'name, price, and category are required' });
  }

  try {
    // 1. Check if the category exists in the categories table
    const [categoryRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
    let category_id;

    // 2. If category exists, get its ID
    if (categoryRows.length > 0) {
      category_id = categoryRows[0].id;
    } else {
      // 3. Insert new category if it doesn't exist
      const [insertCategory] = await pool.query('INSERT INTO categories (name) VALUES (?)', [category]);
      category_id = insertCategory.insertId;
    }

    // 4. Insert the product into the products table
    const [result] = await pool.query(
      `INSERT INTO products 
      (name, description, price, stock, category_id, category, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, stock, category_id, category, image_url]
    );

    // 5. Respond with the added product information
    res.status(200).json({
      message: 'Product added successfully',
      product: {
        id: result.insertId,
        name,
        price,
        stock,
        category_id,
        category
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error adding product', details: err.message });
  }
};

module.exports = { getProducts, getProductById, addProduct, deleteProduct, updateProduct, getProductsByCategory, searchProducts, getFeaturedProducts, categories};