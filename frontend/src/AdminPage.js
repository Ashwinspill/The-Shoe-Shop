import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import logo from './Images/addShoe.avif';
import logo2 from './Images/viewShoes.jpg';
import logo3 from './Images/customers.jpg';

function AdminPage() {
  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5">
        <h2>SHOES</h2>
        <div className='row'>
          {/* Add card for viewing customer details */}
          <div className='col-12 col-md-3 mb-2'>
            <div className="card shadow">
            <img src={logo3} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title d-flex justify-content-center">View Customer Details</h4>
              </div>
              <div className='card-footer d-flex justify-content-center'>
                <Link to="/customerdetails" className='btn btn-success btn-lg'>
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Existing cards for adding and viewing shoes */}
          <div className='col-12 col-md-3 mb-2'>
            <div className="card shadow">
              <img src={logo} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title d-flex justify-content-center">Add Shoes</h4>
              </div>
              <div className='card-footer d-flex justify-content-center'>
                <Link to="/addshoe" className='btn btn-success btn-lg'>
                  <i className="fa-regular fa-square-plus"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3 mb-2'>
            <div className="card shadow">
              <img src={logo2} className="card-img-top" alt="..." />
              <div className="card-body">
                <h4 className="card-title d-flex justify-content-center">Show Shoes</h4>
              </div>
              <div className='card-footer d-flex justify-content-center'>
                <Link to="/showshoes" className='btn btn-success btn-lg'>
                  <i className="fa-regular fa-square-plus"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
