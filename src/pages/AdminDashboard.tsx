import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/admin/Sidebar";
import {
  FaUsers,
  FaTshirt,
  FaTruckLoading,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    products: {
      total: 0,
      hoodies: 0,
      tshirts: 0,
      oversizeTshirts: 0,
    },
    orders: {
      pending: 0,
      inTransit: 0,
      delivered: 0,
    },
  });

  // const [newOrder, setNewOrder] = useState(false); // Track new order status
  // const [newOrderDetails, setNewOrderDetails] = useState(null); // Store new order details

  // // Function to check for new orders
  // const checkNewOrders = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/order/watch-new-orders");
  //     const data = await response.json();
  //     console.log("New Order Data:", data);

  //     if (data && data.newOrder) {
  //       setNewOrder(true);
  //       setNewOrderDetails(data.newOrder); // Store the new order details
  //     }
  //   } catch (error) {
  //     console.error("Error checking for new orders:", error);
  //   }
  // };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
          fetch("http://localhost:5000/api/auth/getusers/"),
          fetch("http://localhost:5000/api/product/getproducts"),
          fetch("http://localhost:5000/api/order/orders"),
        ]);

        const usersData = await usersResponse.json();
        const productsData = await productsResponse.json();
        const ordersData = await ordersResponse.json();

        const hoodies = productsData.filter((product) => product.category === "Hoodies").length;
        const tshirts = productsData.filter((product) => product.category === "Tshirt").length;
        const oversizeTshirts = productsData.filter(
          (product) => product.category === "Oversize-Tshirt"
        ).length;

        const pendingOrders = ordersData.filter((order) => order.status === "Pending").length;
        const inTransitOrders = ordersData.filter((order) => order.status === "In Transit").length;
        const deliveredOrders = ordersData.filter((order) => order.status === "Delivered").length;

        setDashboardData({
          users: usersData.length,
          products: {
            total: productsData.length,
            hoodies,
            tshirts,
            oversizeTshirts,
          },
          orders: {
            pending: pendingOrders,
            inTransit: inTransitOrders,
            delivered: deliveredOrders,
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
    // Initial check for new orders

   // Check every 10 seconds

    
  }, [dashboardData.orders.pending]); // Re-fetch when pending orders change

 
  return (
    <div className="admin-dashboard flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-8 py-6 bg-white">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800"> Dashboard</h1>
          <p className="text-sm text-gray-500">A quick overview of system metrics</p>
        </header>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Users Metric */}
          <MetricCard
            icon={<FaUsers />}
            label="Total Users"
            value={dashboardData.users}
            color="blue"
          />

          {/* Products Metric */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-4xl text-green-500">
                <FaTshirt />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-700">Total Products</h2>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.products.total}</p>
              </div>
            </div>
            <ul className="text-sm text-gray-500 pl-10">
              <li>Hoodies: {dashboardData.products.hoodies}</li>
              <li>T-Shirts: {dashboardData.products.tshirts}</li>
              <li>Oversize T-Shirts: {dashboardData.products.oversizeTshirts}</li>
            </ul>
          </div>

          {/* Orders Metrics */}
          {[
            {
              label: "Pending Orders",
              value: dashboardData.orders.pending,
              color: "yellow",
              icon: <FaTruckLoading />,
            },
            {
              label: "In Transit Orders",
              value: dashboardData.orders.inTransit,
              color: "purple",
              icon: <FaShippingFast />,
            },
            {
              label: "Delivered Orders",
              value: dashboardData.orders.delivered,
              color: "green",
              icon: <FaCheckCircle />,
            },
          ].map((order, index) => (
            <MetricCard
              key={index}
              icon={order.icon}
              label={order.label}
              value={order.value}
              color={order.color}
            />
          ))}
        </div>

      
      
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ icon, label, value, color }) => (
  <div className="bg-white shadow rounded-lg p-6 flex items-center">
    <div className={`text-4xl text-${color}-500`}>{icon}</div>
    <div className="ml-4">
      <h2 className="text-lg font-medium text-gray-700">{label}</h2>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
