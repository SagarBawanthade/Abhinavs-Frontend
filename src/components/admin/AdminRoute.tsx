import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user } = useSelector((state: any) => state.auth); // Get user from Redux store

  // Debugging log
  console.log("Current user:", user);


  if (user === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin rounded-full border-4 border-blue-500 w-12 h-12"></div>
      </div>
    ); 
  }


  // Check if user is logged in and has admin privileges
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />; // Redirect to login if not admin
  }

  return <Outlet />; // Render child routes if admin
};

export default AdminRoute;
