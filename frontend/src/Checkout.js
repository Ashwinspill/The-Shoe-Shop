import React, { useEffect, useState } from 'react';
import axios from './api/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomerNavbar from './CustomerNavbar';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    mobile1: '',
    mobile2: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    axios.get('/cart/')
      .then(response => {
        setCartItems(response.data);
        calculateTotal(response.data);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        toast.error('Error fetching cart items.');
      });

    axios.get('/addresses/')
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => {
        console.error('Error fetching addresses:', error);
        toast.error('Error fetching addresses.');
      });
  }, []);

  const calculateTotal = (items) => {
    let total = 0;
    let itemCount = 0;
    items.forEach(item => {
      total += item.shoe_details.price * item.quantity;
      itemCount += item.quantity;
    });
    setTotalPrice(total);
    setTotalItems(itemCount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    axios.post('/addresses/', address)
      .then(response => {
        toast.success('Address saved successfully!');
        setAddresses([...addresses, response.data]);
        setIsAddModalOpen(false);
        setAddress({
          name: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          mobile1: '',
          mobile2: ''
        });
      })
      .catch(error => {
        console.error('Error saving address:', error);
        toast.error('Error saving address.');
      });
  };

  const handleEditAddressSubmit = (e) => {
    e.preventDefault();
    axios.put(`/addresses/${editingAddressId}/`, address)
      .then(response => {
        toast.success('Address updated successfully!');
        setAddresses(addresses.map(addr => addr.id === editingAddressId ? response.data : addr));
        setIsEditModalOpen(false);
        setEditingAddressId(null);
        setAddress({
          name: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          mobile1: '',
          mobile2: ''
        });
      })
      .catch(error => {
        console.error('Error updating address:', error);
        toast.error('Error updating address.');
      });
  };

  const openEditModal = (address) => {
    setAddress(address);
    setEditingAddressId(address.id);
    setIsEditModalOpen(true);
  };

  const handleRazorpayPayment = async () => {
    const selectedAddress = addresses[0]; // For example, get the first address in the list

    const orderData = {
        amount: totalPrice * 100  // Razorpay amount is in paise (multiply by 100)
    };

    try {
        const response = await axios.post('/order/', orderData);
        const { id, amount, currency } = response.data;

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount,
            currency,
            name: 'The Shoe Shop',
            description: 'Test Transaction',
            order_id: id,
            handler: async (response) => {
                const paymentData = {
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    address_id: selectedAddress.id,
                    total_price: totalPrice,
                    shoe_model: cartItems,
                };

                await axios.post('/verify-payment/', paymentData);
                toast.success('Payment Successful!');
            },
            prefill: {
                name: selectedAddress.name,
                email: selectedAddress.email,
                contact: selectedAddress.mobile1,
            },
            notes: {
                address: selectedAddress.street,
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        toast.error('Error creating Razorpay order.');
    }
};

  return (
    <div>
      <CustomerNavbar />
    <div className="container mt-5">
      <h2>Checkout</h2>
      <div className="row">
        {cartItems.map(item => (
          <div className="col-md-4" key={item.id}>
            <div className="card mb-4">
              <img src={item.shoe_details.image} className="card-img-top" alt={item.shoe_details.model_name} />
              <div className="card-body">
                <h5 className="card-title">{item.shoe_details.model_name}</h5>
                <p className="card-text"><strong>Brand:</strong> {item.shoe_details.brand_name}</p>
                <p className="card-text"><strong>Size:</strong> {item.size_details.size}</p>
                <p className="card-text"><strong>Quantity:</strong> {item.quantity}</p>
                <p className="card-text"><strong>Price:</strong> ₹{item.shoe_details.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3>Total</h3>
      <p><strong>Total Items:</strong> {totalItems}</p>
      <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>

      <h3>Delivery Address</h3>
      <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>Add Address</Button>
      <div className="mt-3">
        {addresses.map(address => (
          <div key={address.id} className="address-item">
            <p><strong>{address.name}</strong></p>
            <p>{address.street}, {address.city}, {address.state}, {address.pincode}</p>
            <p>Mobile 1: {address.mobile1}</p>
            <p>Mobile 2: {address.mobile2}</p>
            <Button variant="secondary" onClick={() => openEditModal(address)}>Edit Address</Button>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal show={isAddModalOpen} onHide={() => setIsAddModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddAddressSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={address.name} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Street</label>
              <input type="text" className="form-control" name="street" value={address.street} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">City</label>
              <input type="text" className="form-control" name="city" value={address.city} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">State</label>
              <input type="text" className="form-control" name="state" value={address.state} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Pincode</label>
              <input type="text" className="form-control" name="pincode" value={address.pincode} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number 1</label>
              <input type="text" className="form-control" name="mobile1" value={address.mobile1} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number 2</label>
              <input type="text" className="form-control" name="mobile2" value={address.mobile2} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-primary">Save Address</button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Edit Address Modal */}
      <Modal show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditAddressSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={address.name} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Street</label>
              <input type="text" className="form-control" name="street" value={address.street} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">City</label>
              <input type="text" className="form-control" name="city" value={address.city} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">State</label>
              <input type="text" className="form-control" name="state" value={address.state} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Pincode</label>
              <input type="text" className="form-control" name="pincode" value={address.pincode} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number 1</label>
              <input type="text" className="form-control" name="mobile1" value={address.mobile1} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number 2</label>
              <input type="text" className="form-control" name="mobile2" value={address.mobile2} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-primary">Update Address</button>
          </form>
        </Modal.Body>
      </Modal>

      <button className="btn btn-success mt-3" onClick={handleRazorpayPayment}>Pay with Razorpay</button>

      <ToastContainer />
    </div>
    </div>
  );
}

export default Checkout;
