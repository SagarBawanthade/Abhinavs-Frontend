import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
// import Sidebar from "../components/admin/Sidebar"


import {
  FaUsers,
  FaTshirt,
  FaTruckLoading,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa";

// Define types for the dashboard data
interface DashboardData {
  users: number;
  products: {
    total: number;
    hoodies: number;
    tshirts: number;
    oversizeTshirts: number;
  };
  orders: {
    pending: number;
    inTransit: number;
    delivered: number;
  };
}

interface Product {
  category: string;
}

interface Order {
  status: string;
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
          fetch("https://abhinasv-s-backend.onrender.com/api/auth/getusers/"),
          fetch("https://abhinasv-s-backend.onrender.com/api/product/getproducts"),
          fetch("https://abhinasv-s-backend.onrender.com/api/order/orders"),
        ]);

        const usersData = await usersResponse.json();
        const productsData: Product[] = await productsResponse.json();
        const ordersData: Order[] = await ordersResponse.json();

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
  }, []); // Removed dependency to avoid unnecessary re-fetching

  return (
    <div className="admin-dashboard flex h-screen bg-gray-100">
      {/* Sidebar
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} /> */}

      {/* Main Content */}
      <div className="flex-1 px-8 py-6 bg-white">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
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
interface MetricCardProps {
  icon: JSX.Element;
  label: string;
  value: number;
  color: string;
}

const MetricCard = ({ icon, label, value, color }: MetricCardProps) => (
  <div className="bg-white shadow rounded-lg p-6 flex items-center">
    <div className={`text-4xl text-${color}-500`}>{icon}</div>
    <div className="ml-4">
      <h2 className="text-lg font-medium text-gray-700">{label}</h2>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
