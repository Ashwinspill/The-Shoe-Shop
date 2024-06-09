import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CustomerNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/customer">Customer Panel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/customer">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/wishlist">Wishlist</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">Your Orders</Link> {/* Add link for "Your Orders" */}
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default CustomerNavbar;
