import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from './api/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import CustomerNavbar from './CustomerNavbar';
import 'react-toastify/dist/ReactToastify.css';

function ShoeDetails() {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  useEffect(() => {
    axios.get(`/shoes/${id}/`)
      .then(response => {
        setShoe(response.data);
      })
      .catch(error => {
        console.error('Error fetching shoe details:', error);
        toast.error('Error fetching shoe details.');
      });
  }, [id]);

  const handleSizeChange = (event) => {
    setSelectedSizeId(event.target.value);
  };

  const handleAddToCart = () => {
    if (!selectedSizeId) {
      toast.error('Please select a size.');
      return;
    }
    const userId = localStorage.getItem('userId');
    axios.post('/cart/', {
      shoe: shoe.id,
      size: selectedSizeId,
      customer: userId,
      quantity: 1,
    })
      .then(response => {
        toast.success('Shoe added to cart!');
      })
      .catch(error => {
        console.error('Error adding shoe to cart:', error);
        toast.error('Error adding shoe to cart.');
      });
  };

  if (!shoe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CustomerNavbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img src={shoe.image} className="img-fluid" alt={shoe.model_name} />
          </div>
          <div className="col-md-6">
            <h2>{shoe.model_name}</h2>
            <p><strong>Brand:</strong> {shoe.brand_name}</p>
            <p><strong>Gender:</strong> {shoe.gender}</p>
            <p><strong>Price:</strong> ₹{shoe.price}</p>
            <p><strong>Color:</strong> {shoe.color}</p>
            <p>{shoe.details}</p>
            <div>
              <strong>Select Size:</strong>
              {shoe.sizes_display.map(size => (
                <div key={size.id}>
                  <input 
                    type="radio" 
                    id={`size_${size.id}`} 
                    name="size" 
                    value={size.id} 
                    checked={selectedSizeId === size.id.toString()} 
                    onChange={handleSizeChange} 
                  />
                  <label htmlFor={`size_${size.id}`}>{size.size}</label>
                </div>
              ))}
            </div>
            <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ShoeDetails;
