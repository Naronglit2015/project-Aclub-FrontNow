import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showAlert, setShowAlert] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/product', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = selectedProducts.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [selectedProducts]);

  const handleProductSelect = (productId) => {
    const selectedProduct = products.find(product => product.id === productId);
    setSelectedProducts(prevState => [...prevState, { ...selectedProduct, quantity: 1 }]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prevState => prevState.filter(product => product.id !== productId));
  };

  const handleBuyClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!tableNumber) {
        alert('Please enter table number');
        return;
      }

      if (selectedProducts.length === 0) {
        alert('Please select at least one product');
        return;
      }

      const totalAmount = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
      const confirmationMessage = `You are about to purchase ${selectedProducts.length} product(s) for $${totalAmount}. Payment method: ${paymentMethod}. Table number: ${tableNumber}.`;

      const confirmPurchase = window.confirm(confirmationMessage);
      if (!confirmPurchase) {
        return;
      }

      await Promise.all(selectedProducts.map(async (product) => {
        await axios.post('http://localhost:8889/auth/purchase', {
          userId,
          productId: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          paymentMethod,
          table: tableNumber,
          img: product.img,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }));

      console.log('Products have been purchased');
      setShowAlert(true);
    } catch (error) {
      console.error('Error purchasing product:', error);
      alert('An error occurred while purchasing the product. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-500 min-h-screen p-8" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-center text-white">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <img className="w-48 h-48 rounded-lg mx-auto mb-4" src={product.img} alt={product.name} />
              <div>
                <h2 className="font-bold text-gray-900 text-xl mb-2 text-center">{product.name}</h2>
                <p className="font-bold text-gray-700 mb-3 text-center">{product.description}</p>
                <p className="font-bold text-gray-800 mb-2 text-center">Price: ${product.price}</p>
              </div>
              <button 
                onClick={() => handleProductSelect(product.id)} 
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300 self-center"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="container mx-auto mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">Selected Products</h2>
          <ul className="grid grid-cols-1 gap-4">
            {selectedProducts.map(product => (
              <li key={product.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <div>
                <img className="w-48 h-48 rounded-lg mx-auto mb-4" src={product.img} alt={product.name} />
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="text-gray-800">Price: ${product.price}</p>
                  <div className="flex items-center mt-2">
                    <label htmlFor={`quantity_${product.id}`} className="block text-gray-700 font-bold mr-2">Quantity:</label>
                    <input 
                      type="number" 
                      id={`quantity_${product.id}`}
                      value={product.quantity} 
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        setSelectedProducts(prevState => prevState.map(p => {
                          if (p.id === product.id) {
                            return { ...p, quantity: newQuantity };
                          }
                          return p;
                        }));
                      }} 
                      min="1" 
                      step="1"
                      className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveProduct(product.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-4">
            <input 
              type="text" 
              value={tableNumber} 
              onChange={(e) => setTableNumber(e.target.value)} 
              placeholder="Enter table number" 
              className="border border-white rounded font-bold px-5 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              className="border border-white rounded font-bold px-3 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
            <button 
              onClick={handleBuyClick} 
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300"
            >
              Buy
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <h3 className="text-lg font-semibold text-white">Total Price: ${totalPrice.toFixed(2)}</h3>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Purchase Successful</h2>
            <p className="text-center">Your purchase was successful. Thank you!</p>
            <button 
              onClick={() => setShowAlert(false)} 
              className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300 block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
