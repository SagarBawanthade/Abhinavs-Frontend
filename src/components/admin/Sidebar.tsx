import { Link } from "react-router-dom";

const Sidebar = ({ isVisible, toggleSidebar }) => {
  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } fixed z-10 w-64 h-screen bg-gray-800 text-white p-6 transition-all duration-300 ease-in-out flex flex-col justify-between`}
    >
      {/* Close Button (for mobile view) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-white mb-6"
      >
        &#x2715; {/* Close icon */}
      </button>

      {/* Sidebar Heading */}
      <h1 className="text-4xl font-light tracking-[1.08px] max-sm:text-3xl max-[400px]:text-2xl">
        Abhinav's
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col space-y-6 mt-6 mb-8 flex-grow">
        <Link
          to="/admin"
          className="text-gray-300 hover:text-white p-2 rounded-lg"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="text-gray-300 hover:text-white p-2 rounded-lg"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/users"
          className="text-gray-300 hover:text-white p-2 rounded-lg"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/orders"
          className="text-gray-300 hover:text-white p-2 rounded-lg"
        >
          Manage Orders
        </Link>

        <Link
          to="/"
          className="text-red-300 hover:text-red p-2 rounded-lg"
        >
          Sign Out
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
