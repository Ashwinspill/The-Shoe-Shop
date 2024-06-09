import React, { useState, useEffect } from 'react';
import axios from './api/axiosConfig';
import AdminNavbar from './AdminNavbar';
import { Link } from 'react-router-dom';
import AddBrand from './AddBrand'; // Import the AddBrand component
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap components

function AddShoe() {
  const [brands, setBrands] = useState([]);
  const sizes = [
    { id: 1, size: 'UK 6' },
    { id: 2, size: 'UK 7' },
    { id: 3, size: 'UK 8' },
    { id: 4, size: 'UK 9' },
    { id: 5, size: 'UK 10' },
    { id: 6, size: 'UK 11' },
    { id: 7, size: 'UK 12' },
    { id: 8, size: 'UK 13' },
    { id: 9, size: 'UK 14' }
  ];
  const [formData, setFormData] = useState({
    brand: '',
    gender: '',
    model_name: '',
    image: null,
    details: '',
    price: '',
    color: '',
    sizes: []
  });

  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const fetchBrands = () => {
    axios.get('/brands/')
      .then(response => setBrands(response.data))
      .catch(error => console.error('Error fetching brands:', error));
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      image: e.target.files[0]
    }));
  };

  const handleSizeChange = (e) => {
    const sizeId = parseInt(e.target.value);
    setFormData(prevFormData => {
      const sizes = [...prevFormData.sizes];
      if (e.target.checked) {
        sizes.push(sizeId);
      } else {
        const index = sizes.indexOf(sizeId);
        if (index !== -1) {
          sizes.splice(index, 1);
        }
      }
      return {
        ...prevFormData,
        sizes: sizes
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append('brand', formData.brand);
    postData.append('gender', formData.gender);
    postData.append('model_name', formData.model_name);
    postData.append('image', formData.image);
    postData.append('details', formData.details);
    postData.append('price', formData.price);
    postData.append('color', formData.color);
    formData.sizes.forEach(size => {
      postData.append('sizes', size);
    });

    try {
      const response = await axios.post('/shoes/', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Shoe added successfully:', response.data);
      // Reset form
      setFormData({
        brand: '',
        gender: '',
        model_name: '',
        image: null,
        details: '',
        price: '',
        color: '',
        sizes: []
      });
    } catch (error) {
      console.error('Error adding shoe:', error);
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h2>Add Shoe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="brand" className="form-label">Brand</label>
            <div className="d-flex">
              <select className="form-select" id="brand" name="brand" value={formData.brand} onChange={handleChange}>
                <option value="">Select a brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              <Button variant="primary" onClick={handleModalShow} className="ms-2">Add Brand</Button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select className="form-select" id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="U">Unisex</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="model_name" className="form-label">Model Name</label>
            <input type="text" className="form-control" id="model_name" name="model_name" value={formData.model_name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image</label>
            <input type="file" className="form-control" id="image" name="image" onChange={handleImageChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="details" className="form-label">Details</label>
            <textarea className="form-control" id="details" name="details" value={formData.details} onChange={handleChange}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="color" className="form-label">Color</label>
            <input type="text" className="form-control" id="color" name="color" value={formData.color} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Sizes</label>
            {sizes.map(size => (
              <div key={size.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`size-${size.id}`}
                  value={size.id}
                  checked={formData.sizes.includes(size.id)}
                  onChange={handleSizeChange}
                />
                <label className="form-check-label" htmlFor={`size-${size.id}`}>{size.size}</label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">Add Shoe</button>
        </form>
        <Link to="/showshoes" className="btn btn-secondary mt-3">Back to Shoes</Link>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddBrand closeModal={handleModalClose} refreshBrands={fetchBrands} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddShoe;
