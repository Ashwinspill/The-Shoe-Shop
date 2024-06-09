import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './api/axiosConfig';

function UpdateShoe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shoe, setShoe] = useState({
    brand: '',
    gender: '',
    model_name: '',
    image: null,
    details: '',
    price: '',
    color: '',
    sizes: [],
    currentImage: null
  });
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    axios.get(`/shoes/${id}/`)
      .then(response => {
        setShoe({
          ...response.data,
          currentImage: response.data.image
        });
      })
      .catch(error => console.error('Error fetching shoe:', error));

    axios.get('/brands/')
      .then(response => setBrands(response.data))
      .catch(error => console.error('Error fetching brands:', error));

    axios.get('/sizes/')
      .then(response => setSizes(response.data))
      .catch(error => console.error('Error fetching sizes:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShoe({ ...shoe, [name]: value });
  };

  const handleFileChange = (e) => {
    setShoe({ ...shoe, image: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setShoe({ ...shoe, sizes: [...shoe.sizes, value] });
    } else {
      setShoe({ ...shoe, sizes: shoe.sizes.filter(size => size !== value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in shoe) {
      if (key === 'sizes') {
        shoe.sizes.forEach(size => formData.append('sizes', size));
      } else if (key === 'image') {
        if (shoe.image) {
          formData.append('image', shoe.image);
        }
      } else {
        formData.append(key, shoe[key]);
      }
    }

    if (!shoe.image) {
      formData.append('image', shoe.currentImage);
    }

    // Log the data being sent
    console.log('FormData being sent:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    axios.put(`/shoes/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => navigate('/showshoes'))
      .catch(error => {
        console.error('Error updating shoe:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      });
  };

  return (
    <div className="container mt-5">
      <h2>Update Shoe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <select
            className="form-control"
            name="brand"
            value={shoe.brand}
            onChange={handleInputChange}
          >
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-control"
            name="gender"
            value={shoe.gender}
            onChange={handleInputChange}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="U">Unisex</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Model Name</label>
          <input
            type="text"
            className="form-control"
            name="model_name"
            value={shoe.model_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          {shoe.currentImage && (
            <div>
              <img src={shoe.currentImage} alt="Shoe" style={{ width: '100px', height: '100px' }} />
              <h6>Please Update with a new shoe image or upload the same one.</h6>
            </div>
          )}
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Details</label>
          <textarea
            className="form-control"
            name="details"
            value={shoe.details}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={shoe.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Color</label>
          <input
            type="text"
            className="form-control"
            name="color"
            value={shoe.color}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Sizes</label>
          <div className="form-check">
            {sizes.map(size => (
              <div key={size.id}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`size-${size.id}`}
                  value={size.id}
                  checked={shoe.sizes.includes(size.id)}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor={`size-${size.id}`}>{size.size}</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Update Shoe</button>
      </form>
    </div>
  );
}

export default UpdateShoe;
