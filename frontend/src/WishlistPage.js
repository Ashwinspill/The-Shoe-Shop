// wishlist.js
import React, { useEffect, useState } from 'react';
import CustomerNavbar from './CustomerNavbar';
import axios from './api/axiosConfig';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    axios.get('/wishlist/my/')
      .then(response => {
        setWishlistItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching wishlist items:', error);
      });
  }, []);

  const handleImageClick = (shoeId) => {
    navigate(`/shoes/${shoeId}`); // Navigate to shoe details page
  };

  const removeItemFromWishlist = (itemId) => {
    axios.delete(`/wishlist/${itemId}/`)
      .then(response => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
        // Remove the item from the wishlistItems state
      })
      .catch(error => {
        console.error('Error removing item from wishlist:', error);
      });
  };

  return (
    <div>
      <CustomerNavbar />
      <div className="container mt-5">
        <h2>My Wishlist</h2>
        <div className="row">
          {wishlistItems.map(item => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card">
                <img 
                  src={item.shoe_details.image} 
                  className="card-img-top" 
                  alt={item.shoe_details.model_name} 
                  onClick={() => handleImageClick(item.shoe_details.id)} // Attach handleImageClick function to onClick event
                />
                <small className="text-muted">{item.shoe_details.brand_name}</small>
                <div className="card-body">
                  <h5 className="card-title">{item.shoe_details.model_name}</h5>
                  <p className="card-text">₹{item.shoe_details.price}</p>
                </div>
                <div className="card-footer">
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => removeItemFromWishlist(item.id)} // Attach removeItemFromWishlist function to onClick event
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
