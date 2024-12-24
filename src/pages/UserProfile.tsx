import { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { checkUserProfileFormData } from "../utils/checkUserProfileFormData";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";
import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus({ loginStatus: false, user: null }));
    navigate("/login");
  };

  const fetchUser = async (userId: string) => {
    try {
      const response = await axios.get(
        `https://abhinasv-s-backend.onrender.com/api/auth/getuser/${userId}`
      );
      setUser(response.data); // Update state with fetched user data
    } catch (error) {
      toast.error("Error fetching user data");
      navigate("/login");
    }
  };

  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (!checkUserProfileFormData(data)) return;

    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    if (userId) {
      try {
        await axios.put(
          `https://abhinasv-s-backend.onrender.com/api/auth/updateuser/${userId}`,
          data
        );
        toast.success("User updated successfully");
        setUser((prevUser) => ({ ...prevUser, ...data } as User)); // Update local state
      } catch (e) {
        toast.error("User update failed");
      }
    } else {
      toast.error("Please login to view this page");
      navigate("/login");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id;

    if (!userId) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else {
      fetchUser(userId);
    }
  }, [navigate]);

  if (!user) return <div>Loading user details...</div>; // Show loading spinner

  return (
    <div className="max-w-screen-lg mx-auto mt-24 px-5">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <form className="flex flex-col gap-6" onSubmit={updateUser}>
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter first name"
            id="firstName"
            name="firstName"
            value={user?.firstName || ""}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter last name"
            id="lastName"
            name="lastName"
            value={user?.lastName || ""}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter email address"
            id="email"
            name="email"
            value={user?.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Enter password"
            id="password"
            name="password"
            value={user?.password || ""}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>
        <Button type="submit" text="Update Profile" mode="brown" />
        <Link
          to="/order-history"
          className="bg-white text-black text-center text-xl border border-gray-400 font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center max-md:text-base"
        >
          Order History
        </Link>
        {/* Conditional Admin Button */}
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="bg-secondaryBrown text-white text-center text-xl py-3 px-5 rounded-md font-medium tracking-wider hover:bg-brown"
          >
            Admin Dashboard
          </Link>
        )}
        <Button onClick={logout} text="Logout" mode="white" />
      </form>
    </div>
  );
};

export default UserProfile;
