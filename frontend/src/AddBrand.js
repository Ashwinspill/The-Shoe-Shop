import React, { useState } from 'react';
import axios from './api/axiosConfig'; // Import the configured Axios instance

function AddBrand({ closeModal, refreshBrands }) {
  const [brandName, setBrandName] = useState('');

  const handleChange = (e) => {
    setBrandName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/brands/', { name: brandName })
      .then(response => {
        console.log('Brand added successfully:', response.data);
        setBrandName(''); // Clear the form
        if (closeModal) closeModal();
        if (refreshBrands) refreshBrands();
      })
      .catch(error => console.error('Error adding brand:', error));
  };

  return (
    <div>
      <div className="container mt-3">
        <h2>Add New Brand</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Brand Name</label>
            <input type="text" name="brandName" className="form-control" onChange={handleChange} value={brandName} />
          </div>
          <button type="submit" className="btn btn-primary">Add Brand</button>
        </form>
      </div>
    </div>
  );
}

export default AddBrand;
