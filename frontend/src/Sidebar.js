// src/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar({ brands, sizes, selectedFilters, handleFilterChange }) {
  return (
    <div className="sidebar">
      <h5>Filter By</h5>
      <div className="filter-section">
        <h6>Brand</h6>
        {brands.map(brand => (
          <div key={brand.id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={brand.id}
              checked={selectedFilters.brands.includes(brand.id)}
              onChange={() => handleFilterChange('brands', brand.id)}
            />
            <label className="form-check-label">{brand.name}</label>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h6>Gender</h6>
        {['M', 'F', 'U'].map(gender => (
          <div key={gender} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={gender}
              checked={selectedFilters.genders.includes(gender)}
              onChange={() => handleFilterChange('genders', gender)}
            />
            <label className="form-check-label">{gender}</label>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h6>Size</h6>
        {sizes.map(size => (
          <div key={size.id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={size.id}
              checked={selectedFilters.sizes.includes(size.id)}
              onChange={() => handleFilterChange('sizes', size.id)}
            />
            <label className="form-check-label">{size.size}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
