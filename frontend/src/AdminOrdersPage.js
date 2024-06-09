import React, { useEffect, useState } from 'react';
import axios from './api/axiosConfig';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders/');
        console.log('Fetched Orders:', response.data);  // Log the fetched data
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>All Orders</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Model Name</th>
            <th>Brand</th>
            <th>Size</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Payment ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer?.user?.username || 'N/A'}</td>
                <td>{order.address?.address_line1 || 'N/A'}</td>
                <td>{order.model_name || 'N/A'}</td>
                <td>{order.brand || 'N/A'}</td>
                <td>{order.size || 'N/A'}</td>
                <td>{order.price || 'N/A'}</td>
                <td>{order.total_price}</td>
                <td>{order.payment_id || 'N/A'}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No orders available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
