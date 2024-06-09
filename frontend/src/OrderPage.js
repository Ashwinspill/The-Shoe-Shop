import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './api/axiosConfig';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CustomerNavbar from './CustomerNavbar';

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/orders/')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const generatePDF = (order) => {
    const doc = new jsPDF();
  
    // Add a border to the whole PDF
    doc.setLineWidth(0.5);
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);
  
    // Add a title
    doc.setFontSize(22);
    doc.setTextColor(40, 44, 52); // Dark gray color for the title
    doc.text('The Shoe Shop', 105, 20, null, null, 'center');
    // doc.text('Invoice', 105, 20, null, null, 'center'); // Centered title
  
    // Add a horizontal line below the title
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);
  
    // Add some general information
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black color for the text
    doc.text(`Order ID: ${order.id}`, 20, 40);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer:', 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.customer.first_name} ${order.customer.last_name}`, 60, 50);
  
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.address.street},`, 60, 60);
    doc.text(`${order.address.city},`, 60, 70);
    doc.text(`${order.address.state}, ${order.address.pincode}`, 60, 80);
  
    // Add a table with the order details
    doc.autoTable({
      startY: 90,
      head: [['Shoe Model', 'Brand', 'Size', 'Price', 'Total Price']],
      body: [
        [
          order.model_name,
          order.brand,
          order.size,
          `$${order.price}`,
          `$${order.total_price}`
        ]
      ],
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }, // Custom color for the table header
      alternateRowStyles: { fillColor: [238, 238, 238] }, // Light gray color for alternate rows
    });
  
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray color for the footer text
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, doc.internal.pageSize.height - 10);
  
    doc.save(`invoice_${order.id}.pdf`);
  };

  return (
    <div>
      <CustomerNavbar />    
      <div className="container mt-5">
        <h2>Order Details</h2>
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Order ID: {order.id}</h5>
                <p className="card-text">Customer: {order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'N/A'}</p>
                <p className="card-text">Address: {order.address ? `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.pincode}` : 'N/A'}</p>
                <p className="card-text">Shoe Model: {order.model_name}</p>
                <p className="card-text">Brand: {order.brand}</p>
                <p className="card-text">Size: {order.size}</p>
                <p className="card-text">Price: ${order.price}</p>
                <p className="card-text">Total Price: ${order.total_price}</p>
                <button className="btn btn-primary" onClick={() => generatePDF(order)}>Generate PDF</button>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default OrderPage;
