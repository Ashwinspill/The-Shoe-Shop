// src/CustomerPage.js
import React, { useEffect, useState } from 'react';
import CustomerNavbar from './CustomerNavbar';
import Sidebar from './Sidebar';
import axios from './api/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './CustomerPage.css'; // Ensure you have this CSS file for styling

function CustomerPage() {
  const [shoes, setShoes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    genders: [],
    sizes: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/customer/')
      .then(response => {
        setCustomerName(response.data.first_name);
      })
      .catch(error => {
        console.error('Error fetching customer data:', error);
      });

    axios.get('/shoes/')
      .then(response => {
        setShoes(response.data);
      })
      .catch(error => {
        console.error('Error fetching shoes:', error);
      });

    axios.get('/brands/')
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
      });

    axios.get('/sizes/')
      .then(response => {
        setSizes(response.data);
      })
      .catch(error => {
        console.error('Error fetching sizes:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToWishlist = (shoeId) => {
    axios.post('/wishlist/', { shoe: shoeId })
      .then(response => {
        toast.success("Added to wishlist!");
      })
      .catch(error => {
        if (error.response && error.response.data.detail) {
          toast.error(error.response.data.detail);
        } else {
          toast.error("Error adding to wishlist.");
        }
      });
  };

  const handleImageClick = (shoeId) => {
    navigate(`/shoes/${shoeId}`);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prevFilters => {
      const currentFilters = prevFilters[filterType];
      const isSelected = currentFilters.includes(value);
      const newFilters = isSelected
        ? currentFilters.filter(item => item !== value)
        : [...currentFilters, value];
      return { ...prevFilters, [filterType]: newFilters };
    });
  };

  const filteredShoes = shoes.filter(shoe => {
    const matchesSearchTerm = shoe.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              shoe.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedFilters.brands.length === 0 || selectedFilters.brands.includes(shoe.brand);
    const matchesGender = selectedFilters.genders.length === 0 || selectedFilters.genders.includes(shoe.gender);
    const matchesSize = selectedFilters.sizes.length === 0 || shoe.sizes.some(size => selectedFilters.sizes.includes(size));
    return matchesSearchTerm && matchesBrand && matchesGender && matchesSize;
  });

  return (
    <div>
      <CustomerNavbar />
      <div className="container mt-5 d-flex">
        <Sidebar 
          brands={brands} 
          sizes={sizes} 
          selectedFilters={selectedFilters} 
          handleFilterChange={handleFilterChange} 
        />
        <div className="content ms-4">
          <h2>Welcome, {customerName}!</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by model name or brand"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="row">
            {filteredShoes.map(shoe => (
              <div key={shoe.id} className="col-md-4 mb-4">
                <div className="card h-100"> {/* Added h-100 class */}
                  <img 
                    src={shoe.image} 
                    className="card-img-top" 
                    alt={shoe.model_name} 
                    onClick={() => handleImageClick(shoe.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <small className="text-muted">{shoe.brand_name}</small>
                  <div className="card-body d-flex flex-column"> {/* Added d-flex and flex-column classes */}
                    <h5 className="card-title">{shoe.model_name}</h5>
                    <p className="card-text">₹{shoe.price}</p>
                    <div className="mt-auto"> {/* This div ensures footer is at the bottom */}
                      <button 
                        title="Wishlist" 
                        className='btn btn-danger btn-sm ms-1' 
                        onClick={() => handleAddToWishlist(shoe.id)}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CustomerPage;
