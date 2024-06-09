import React, { useEffect, useState } from 'react';
import axios from './api/axiosConfig';

function CustomerDetails() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('/customers/')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Customer Details</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.username}</td>
              <td>{customer.email}</td>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerDetails;
