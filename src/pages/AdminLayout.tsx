import { Outlet} from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className={`flex-1 p-8 bg-gray-50 ${isSidebarVisible ? "ml-64" : ""}`}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
