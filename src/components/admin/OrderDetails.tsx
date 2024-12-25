import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCircle, FaCheckCircle, FaTruck, FaArrowLeft } from "react-icons/fa";

interface Order {
  status: string;
  shippingInformation: {
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactInformation: {
    email: string;
    phone: string;
  };
  orderSummary: {
    items: {
      productName: string;
      productImage: string;
      quantity: number;
      size: string;
      price: number;
    }[];
    total: number;
  };
  paymentInformation?: {
    method: string;
    nameOnCard: string;
  };
}

const OrderDetails = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    if (!orderId) {
      toast.error("Order not found");
      navigate("/orders");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://abhinasv-s-backend.onrender.com/api/order/order/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        toast.error("Error fetching order details");
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const updateOrderStatus = async (newStatus: string) => {
    try {
      await axios.patch(
        `https://abhinasv-s-backend.onrender.com/api/order/update-status/${orderId}`,
        { status: newStatus }
      );
      setOrder((prevState) => prevState ? { ...prevState, status: newStatus } : null);
      toast.success("Order status updated successfully!");
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  if (!order) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-screen-lg mx-auto pt-10 px-5">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-gray-600 hover:text-gray-800 text-lg flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back to Orders</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-800">Order Details</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Order Status</h3>
          <div className="flex items-center space-x-4">
            {order?.status === "Pending" ? (
              <span className="text-red-500 flex items-center space-x-2">
                <FaCircle size={24} />
                <span>Pending</span>
              </span>
            ) : order?.status === "Delivered" ? (
              <span className="text-green-500 flex items-center space-x-2">
                <FaCheckCircle size={24} />
                <span>Delivered</span>
              </span>
            ) : order?.status === "In Transit" ? (
              <span className="text-yellow-500 flex items-center space-x-2">
                <FaTruck size={24} />
                <span>In Transit</span>
              </span>
            ) : (
              <span className="text-gray-500">{order?.status}</span>
            )}
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Shipping Information</h3>
          <p>{order.shippingInformation.firstName} {order.shippingInformation.lastName}</p>
          <p>{order.shippingInformation.address}, {order.shippingInformation.apartment}</p>
          <p>{order.shippingInformation.city}, {order.shippingInformation.state} - {order.shippingInformation.postalCode}</p>
          <p>{order.shippingInformation.country}</p>
        </div>

        <div className="border-b pb-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h3>
          <p>Email: {order.contactInformation.email}</p>
          <p>Phone: {order.contactInformation.phone}</p>
        </div>

        <div className="border-b pb-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Summary</h3>
          {order.orderSummary.items.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="ml-4">
                <p className="font-semibold">{item.productName}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Size: {item.size}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
          ))}
          <h3 className="font-semibold mt-4 text-gray-800">Total: ₹ {order.orderSummary?.total || "Not Available"}</h3>
        </div>

        <div className="border-b pb-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Information</h3>
          {order?.paymentInformation ? (
            <>
              <p>Method: {order.paymentInformation.method}</p>
              <p>Name on Card: {order.paymentInformation.nameOnCard}</p>
            </>
          ) : (
            <p className="text-gray-500">Payment information not available</p>
          )}
        </div>

        <div className="flex justify-around mb-8">
          <button
            onClick={() => updateOrderStatus("Pending")}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Set as Pending
          </button>
          <button
            onClick={() => updateOrderStatus("In Transit")}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
          >
            Set as In Transit
          </button>
          <button
            onClick={() => updateOrderStatus("Delivered")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Set as Delivered
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
