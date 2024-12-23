import React, { useEffect, useState } from 'react';

const OrderConfirmation2= () => {
  const [order, setOrder] = useState(null);

  // Fetch order data from the backend (assuming an API call)
  useEffect(() => {
    // Example API call to fetch order details (replace with actual API endpoint)
    fetch('http://localhost:5000/api/order/orders/')
      .then(response => response.json())
      .then(data => setOrder(data))
      .catch(error => console.error('Error fetching order details:', error));
  }, []);

  if (!order) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v-2h-2v2zm0-4h2V7h-2v2z" clipRule="evenodd" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mt-2">Your order has been successfully placed.</p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
          <ul className="space-y-4">
            {order.items.map(item => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <span className="text-lg text-gray-800">{item.quantity} x ${item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between text-gray-900">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-semibold">${order.totalPrice}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
          <p className="text-gray-600 mt-2">{order.shipping.address}</p>
          <p className="text-gray-600">{order.shipping.city}, {order.shipping.state} - {order.shipping.zip}</p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
          <p className="text-gray-600 mt-2">Payment Method: {order.payment.method}</p>
          <p className="text-gray-600">Card ending in {order.payment.cardLastFour}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          View Order Details
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation2;
