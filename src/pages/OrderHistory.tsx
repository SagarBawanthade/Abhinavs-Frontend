import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { FaCircle, FaCheckCircle, FaTruck } from "react-icons/fa"; // Import the truck icon for In Transit

export const loader = async () => {
  try {
    const response = await fetch("https://abhinasv-s-backend.onrender.com/api/order/orders");
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    const allOrders = await response.json();
    return allOrders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

const OrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const orders = useLoaderData() as Order[];
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else {
      const filteredOrders = orders.filter((order) => order.user === user.id);
      setUserOrders(filteredOrders);
      console.log(filteredOrders);
    }
  }, [user, orders, navigate]);

  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b">Order ID</th>
              <th className="py-3 px-4 border-b">Order Date</th>
              <th className="py-3 px-4 border-b">Total</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <tr key={order._id}>
                  <td className="py-3 px-4 border-b text-center">{order._id}</td>
                  <td className="py-3 px-4 border-b text-center">{formatDate(order.orderDate)}</td>
                  <td className="py-3 px-4 border-b text-center">₹ {order.orderSummary.subtotal}</td>
                  <td className="bottom-5 py-3 px-4 border-b text-center">
                    {order.status === "Pending" ? (
                      <span className="text-red-500 ">
                        <FaCircle />
                        Pending
                      </span>
                    ) : order.status === "Delivered" ? (
                      <span className="text-green-500">
                        <FaCheckCircle />
                        Delivered
                      </span>
                    ) : order.status === "In Transit" ? (
                      <span className="text-yellow-500">
                        <FaTruck />
                        In Transit
                      </span>
                    ) : (
                      order.status
                    )}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-3 px-4 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog Box */}
{selectedOrder && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-5">
    <div
      className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out"
    >
      {/* Header */}
      <div className="border-b p-5 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Order Details</h2>
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-5 overflow-y-auto max-h-[70vh]">
        <h3 className="font-semibold mb-2">Shipping Information</h3>
        <p>
          {selectedOrder.shippingInformation.firstName}{" "}
          {selectedOrder.shippingInformation.lastName}
        </p>
        <p>
          {selectedOrder.shippingInformation.address},{" "}
          {selectedOrder.shippingInformation.apartment}
        </p>
        <p>
          {selectedOrder.shippingInformation.city},{" "}
          {selectedOrder.shippingInformation.state} -{" "}
          {selectedOrder.shippingInformation.postalCode}
        </p>
        <p>{selectedOrder.shippingInformation.country}</p>

        <h3 className="font-semibold mt-4">Contact Information</h3>
        <p>Email: {selectedOrder.contactInformation.email}</p>
        <p>Phone: {selectedOrder.contactInformation.phone}</p>

        <h3 className="font-semibold mt-4">Order Summary</h3>
        {selectedOrder.orderSummary.items.map((item, index) => (
          <div key={index} className="flex items-center mt-2">
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="ml-4">
              <p>{item.productName}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Size: {item.size}</p>
              <p>Price: ₹{item.price}</p>
            </div>
          </div>
        ))}

        <h3 className="font-semibold mt-4">Payment Information</h3>
        {selectedOrder.paymentInformation ? (
          <>
            <p>
              Card Number: **** **** ****{" "}
              {selectedOrder.paymentInformation.cardNumber
                ? selectedOrder.paymentInformation.cardNumber.slice(-4)
                : "Not Available"}
            </p>
            <p>
              Method: {selectedOrder.paymentInformation.method || "Not Available"}
            </p>
            <p>
              Name on Card:{" "}
              {selectedOrder.paymentInformation.nameOnCard || "Not Available"}
            </p>
          </>
        ) : (
          <p>Payment information is not available for this order.</p>
        )}

        <h3 className="font-semibold mt-4">
          Total: ₹ {selectedOrder.orderSummary?.total || "Not Available"}
        </h3>
      </div>

      {/* Footer */}
      <div className="border-t p-5 text-right">
        <button
          onClick={closeModal}
          style={{ backgroundColor: "rgb(138 132 117)" }}
          className="text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default OrderHistory;
