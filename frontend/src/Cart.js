// src/Cart.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './api/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerNavbar from './CustomerNavbar';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/cart/')
      .then(response => {
        setCartItems(response.data);
        calculateTotalPrice(response.data);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        toast.error('Error fetching cart items.');
      });
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.shoe_details.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (id) => {
    axios.delete(`/cart/${id}/`)
      .then(response => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        calculateTotalPrice(updatedItems);
        toast.success('Item removed from cart!');
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
        toast.error('Error removing item from cart.');
      });
  };

  const handleQuantityChange = (id, quantity) => {
    axios.put(`/cart/update/${id}/`, { quantity })
      .then(response => {
        const updatedItems = cartItems.map(item =>
          item.id === id ? { ...item, quantity: parseInt(quantity) } : item
        );
        setCartItems(updatedItems);
        calculateTotalPrice(updatedItems);
        toast.success('Quantity updated!');
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
        toast.error('Error updating quantity.');
      });
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems, totalPrice } });
  };

  return (
    <div>
      <CustomerNavbar />
      <div className="container mt-5">
        <h2>Cart</h2>
        <div className="row">
          {cartItems.map(item => (
            <div className="col-md-4" key={item.id}>
              <div className="card mb-4">
                <img src={item.shoe_details.image} className="card-img-top" alt={item.shoe_details.model_name} />
                <div className="card-body">
                  <h5 className="card-title">{item.shoe_details.model_name}</h5>
                  <p className="card-text"><strong>Brand:</strong> {item.shoe_details.brand_name}</p>
                  <p className="card-text"><strong>Size:</strong> {item.size_details.size}</p>
                  <p className="card-text"><strong>Quantity:</strong>
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="form-select"
                    >
                      {[...Array(10).keys()].map(num => (
                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                      ))}
                    </select>
                  </p>
                  <p className="card-text"><strong>Price:</strong> ${item.shoe_details.price}</p>
                  <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h3>Total Price ({cartItems.length} items): ₹{totalPrice.toFixed(2)}</h3>
        <button className="btn btn-primary" onClick={handleCheckout}>Proceed to Checkout</button>
        <ToastContainer />
      </div>
      </div>
  );
}

export default Cart;
