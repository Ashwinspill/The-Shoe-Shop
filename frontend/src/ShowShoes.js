import React, { useEffect, useState } from 'react';
import axios from './api/axiosConfig'; // Import the configured Axios instance
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

function ShowShoes() {
  const [shoes, setShoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/shoes/')
      .then(response => setShoes(response.data))
      .catch(error => console.error('Error fetching shoes:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/shoes/${id}/`)
      .then(() => {
        setShoes(shoes.filter(shoe => shoe.id !== id));
      })
      .catch(error => console.error('Error deleting shoe:', error));
  };

  const handleUpdate = (id) => {
    navigate(`/update-shoe/${id}`);
  };

  const formatSizesDisplay = (sizes) => {
    if (Array.isArray(sizes)) {
      return sizes.map(sizeObj => sizeObj.size).join(', ');
    }
    return '';
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5">
        <h2>All Shoes</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Model Name</th>
              <th>Brand</th>
              <th>Gender</th>
              <th>Details</th>
              <th>Price</th>
              <th>Color</th>
              <th>Sizes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shoes.map(shoe => (
              <tr key={shoe.id}>
                <td><img src={shoe.image} alt={shoe.model_name} style={{ width: '100px', height: 'auto' }} /></td>
                <td>{shoe.model_name}</td>
                <td>{shoe.brand_name}</td>
                <td>{shoe.gender === 'M' ? 'Male' : shoe.gender === 'F' ? 'Female' : 'Unisex'}</td>
                <td>{shoe.details}</td>
                <td>₹{shoe.price}</td>
                <td>{shoe.color}</td>
                <td>{formatSizesDisplay(shoe.sizes_display)}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => handleUpdate(shoe.id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(shoe.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShowShoes;
