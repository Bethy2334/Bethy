import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './App.css'; 


function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        id: '',
        name: '',
        description: '',
        category: '',
        price: '',
        stock: ''
    });
    const [sellQuantities, setSellQuantities] = useState({}); // Store sell quantities for each product

    // Fetch products from the server
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error.response?.data || error.message);
            }
        };
        fetchProducts();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Handle sell quantity changes
    const handleSellQuantityChange = (id, value) => {
        setSellQuantities({ ...sellQuantities, [id]: value });
    };

    // Add or update product
    const addOrUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                name: form.name,
                description: form.description,
                category: form.category,
                price: parseFloat(form.price), // Ensure Price is a float
                stock: parseInt(form.stock) // Ensure Stock is an integer
            };

            if (form.id) {
                // Update existing product
                await axios.put(`http://localhost:5000/api/products/${form.id}`, productData);
            } else {
                // Add new product
                await axios.post('http://localhost:5000/api/products', productData);
            }

            // Reset form fields
            setForm({
                id: '',
                name: '',
                description: '',
                category: '',
                price: '',
                stock: ''
            });

            // Re-fetch products after adding/updating
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error adding or updating product:', error.response?.data || error.message);
        }
    };

    // Prefill form to edit product
    const editProduct = (id) => {
        const product = products.find(prod => prod.id === id);
        setForm(product);
    };

    // Delete product
    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            setProducts(products.filter(prod => prod.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error.response?.data || error.message);
        }
    };

    // Sell products
    const sellProduct = async (productId) => {
        const sellQuantity = sellQuantities[productId] || 0;
        if (sellQuantity > 0) {
            try {
                await axios.put(`http://localhost:5000/api/products/sell/${productId}`, { sellQuantity });
                alert('Product sold successfully.');
                setSellQuantities({ ...sellQuantities, [productId]: '' }); // Reset the sold quantity
                const response = await axios.get('http://localhost:5000/api/products'); // Refresh products
                setProducts(response.data);
            } catch (error) {
                alert(error.response?.data.message || 'Error selling product.');
            }
        } else {
            alert('Please enter a valid quantity to sell.');
        }
    };

    return (
        <div>
            <h1>Product Management</h1>
            <form onSubmit={addOrUpdateProduct}>
                <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Product Name" required />
                <input type="text" name="description" value={form.description} onChange={handleInputChange} placeholder="Product Description" required />
                <input type="text" name="category" value={form.category} onChange={handleInputChange} placeholder="Product Category" required />
                <input type="number" name="price" value={form.price} onChange={handleInputChange} placeholder="Product Price" required />
                <input type="number" name="stock" value={form.stock} onChange={handleInputChange} placeholder="Product Stock" required />
                <button type="submit">{form.id ? 'Update Product' : 'Add Product'}</button>
            </form>

            <h2>Product List</h2>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <p>Price: ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</p>
                    <p>Stock: {product.stock}</p>
                    
                    {/* Sell Quantity Input */}
                    <input
                        type="number"
                        value={sellQuantities[product.id] || ''}
                        onChange={(e) => handleSellQuantityChange(product.id, parseInt(e.target.value) || 0)}
                        placeholder="Quantity to sell"
                        style={{ marginRight: '8px' }}
                    />
                    <button onClick={() => sellProduct(product.id)}>Sell</button>
                    <button onClick={() => editProduct(product.id)}>Edit</button>
                    <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </div>
            ))}

            <h2>Product Stock Chart</h2>
            <BarChart width={600} height={300} data={products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#8884d8" />
            </BarChart>
        </div>
    );
}

export default ProductManagement;