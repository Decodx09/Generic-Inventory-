async function search() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
  
    if (!query) {
      alert("Please enter something to search.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}`);
      const results = await response.json();
  
      if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No products found.</p>';
        return;
      }
  
      results.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('search-result-item');
        div.style.border = '2px solid #000';
        div.style.padding = '12px';
        div.style.borderRadius = '6px';
        div.style.marginBottom = '12px';
        div.style.backgroundColor = '#f3f3f3';
  
        div.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><strong>Price:</strong> ₹${product.price}</p>
          <p><strong>Stock:</strong> ${product.stock}</p>
          <p><strong>Category:</strong> ${product.category}</p>
        `;
        resultsContainer.appendChild(div);
      });
    } catch (err) {
      console.error('Search failed:', err);
      alert('Something went wrong while searching.');
    }
  }
  
  let currentEditingProductId = null;
  
  async function editProduct(id) {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`);
      const product = await response.json();
  
      const form = document.getElementById('editForm');
      form.name.value = product.name;
      form.description.value = product.description;
      form.price.value = product.price;
      form.stock.value = product.stock;
  
      currentEditingProductId = id;
      document.getElementById('editModal').style.display = 'flex';
    } catch (err) {
      console.error('Failed to fetch product:', err);
      alert('Could not load product details.');
    }
  }
  
  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingProductId = null;
  }
  
  document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const updated = {
      name: this.name.value,
      description: this.description.value,
      price: parseFloat(this.price.value),
      stock: parseInt(this.stock.value),
      category: this.category.value
    };
  
    try {
      const res = await fetch(`http://localhost:3000/products/${currentEditingProductId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
  
      const data = await res.json();
      alert(data.message || 'Product updated successfully!');
      closeEditModal();
      location.reload();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update product.');
    }
  });
  
  async function fetchProducts() {
    const res = await fetch('http://localhost:3000/products');
    const products = await res.json();
    const container = document.getElementById('productList');
  
    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'one';
      div.innerHTML = `
        <div class="two">${product.name}</div>
        <div class="three">${product.stock}</div>
        <div class="four">${product.category}</div>
        <button class="edit" onclick="editProduct(${product.id})">Edit</button>
        <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
      `;
      container.appendChild(div);
    });
  }
  
  let deleteProductId = null;
  
  function deleteProduct(id) {
    deleteProductId = id;
    document.getElementById('deleteModal').style.display = 'flex';
  }
  
  function closeModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deleteProductId = null;
  }
  
  async function confirmDelete() {
    try {
      const res = await fetch(`http://localhost:3000/products/${deleteProductId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      alert(data.message || data.error);
      closeModal();
      location.reload();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Something went wrong.');
    }
  }
  
  async function loadCategories() {
    try {
      const res = await fetch('http://localhost:3000/products/categories');
      const categories = await res.json();
  
      const categoryContainer = document.querySelector('.category-material');
      categoryContainer.innerHTML = '';
  
      categories.forEach(cat => {
        const btn = document.createElement('p');
        btn.textContent = cat.name;
        btn.classList.add('category-btn');
  
        btn.addEventListener('click', () => {
          console.log(`Clicked on category: ${cat.name}`);
        });
  
        categoryContainer.appendChild(btn);
      });
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    fetchProducts();
  });
  