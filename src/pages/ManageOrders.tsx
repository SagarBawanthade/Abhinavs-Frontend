import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt, FaTruck, FaCheckCircle, FaHourglass } from "react-icons/fa"; // Import icons
import toast from "react-hot-toast";

const statusIcons = {
  "Delivered": <FaCheckCircle className="text-green-500" />,
  "In Transit": <FaTruck className="text-yellow-500" />,
  "Pending": <FaHourglass className="text-red-500" />,
  // Add more statuses with corresponding icons if needed
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);  // Track selected order
  const [isDialogOpen, setIsDialogOpen] = useState(false);  // Track if dialog is open
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // Track delete confirmation

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://abhinasv-s-backend.onrender.com/api/order/orders");
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openDialog = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);  // Open dialog when View is clicked
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);  // Reset selected order
  };

  const handleEdit = () => {
    // Logic for editing the order (e.g., update the order status or other details)
    console.log("Editing order:", selectedOrder);
    // You can add API calls to save the updated details if necessary.
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      try {
        await axios.delete(`https://abhinasv-s-backend.onrender.com/api/order/delete-order/${selectedOrder._id}`);
        setOrders(orders.filter(order => order._id !== selectedOrder._id)); // Remove deleted order from the list
        closeDialog();
        toast.success("Successfully Deleted Order"); // Close the dialog after deletion
      } catch (err) {
        setError("Failed to delete order");
        toast.success("Failed to delete order")
      }
    }
    setIsDeleteConfirmOpen(false); // Close the delete confirmation dialog
  };

  const openDeleteConfirmation = (order) => {
    setSelectedOrder(order);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedOrder(null);  // Reset selected order
  };

  if (loading) return <p className="text-center text-gray-500">{"Loading.."}</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Orders</h2>

      {/* Table container */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left font-medium">Order ID</th>
              <th className="py-3 px-6 text-left font-medium">User</th>
              <th className="py-3 px-6 text-left font-medium">Status</th>
              <th className="py-3 px-6 text-left font-medium">Total Price</th>
              <th className="py-3 px-6 text-left font-medium">Created At</th>
              <th className="py-3 px-6 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100 border-b">
                <td className="py-4 px-6">{order._id}</td>
                <td className="py-4 px-6">{order.shippingInformation.firstName}</td>
                <td className="py-4 px-6 flex items-center space-x-2">
                  {/* Display the corresponding icon for each order status */}
                  {statusIcons[order.status] || <FaHourglass className="text-gray-500" />}
                  <span>{order.status}</span>
                </td>
                <td className="py-4 px-6">
                  {order.orderSummary.total ? `₹${order.orderSummary.total.toFixed(2)}` : "N/A"}
                </td>
                <td className="py-4 px-6">{new Date(order.orderDate).toLocaleString()}</td>
                <td className="py-4 px-6 text-center">
                  <Link to={`/admin/orders/order-details/${order._id}`} className="text-blue-500 hover:text-blue-600">
                    <FaEye className="inline-block mr-2" /> View
                  </Link>
                  {/* Remove the edit option after deletion */}
                  {selectedOrder && selectedOrder._id !== order._id && (
                    <button
                      onClick={() => openDialog(order)}
                      className="text-yellow-500 hover:text-yellow-600 ml-4"
                    >
                      <FaEdit className="inline-block" />
                    </button>
                  )}
                  <button
                    onClick={() => openDeleteConfirmation(order)}
                    className="text-red-500 hover:text-red-600 ml-4"
                  >
                    <FaTrashAlt className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog Box */}
      {isDialogOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h3>

            {/* Displaying Order Details */}
            <div className="space-y-4">
              {/* Editable fields */}
              <div>
                <strong>Order ID:</strong>
                <input
                  type="text"
                  value={selectedOrder._id}
                  disabled
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <strong>User:</strong>
                <input
                  type="text"
                  value={`${selectedOrder.shippingInformation.firstName} ${selectedOrder.shippingInformation.lastName}`}
                  onChange={(e) => {
                    const updatedOrder = { ...selectedOrder };
                    const [firstName, lastName] = e.target.value.split(" ");
                    updatedOrder.shippingInformation.firstName = firstName;
                    updatedOrder.shippingInformation.lastName = lastName;
                    setSelectedOrder(updatedOrder);
                  }}
                  className="border rounded p-2 w-full"
                />
              </div>
              {/* More input fields for order details */}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={closeDialog}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleEdit}
              >
                <FaEdit className="inline-block mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this order?</h3>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={closeDeleteConfirmation}
              >
                No
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
