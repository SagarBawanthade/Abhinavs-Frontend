import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageProducts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://abhinasv-s-backend.onrender.com/api/auth/getusers");
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Response data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`https://abhinasv-s-backend.onrender.com/api/auth/deleteuser/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== id)); 
        toast.success("User Deleted Successfully");// Remove deleted user from state
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Format date (DD/MM/YYYY)
  const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate().toString().padStart(2, "0")}/${(newDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${newDate.getFullYear()}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4 text-left">First Name</th>
              <th className="p-4 text-left">Last Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Password</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Creation Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.firstName}</td>
                <td className="p-4">{user.lastName}</td>
                <td className="p-4">{user.email}</td>
                {/* Password shown as "Encrypted" */}
                <td className="p-4">Encrypted</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{formatDate(user.createdAt)}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
