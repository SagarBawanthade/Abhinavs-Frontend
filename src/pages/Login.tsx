import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { checkLoginFormData } from "../utils/checkLoginFormData";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "../features/auth/authSlice";
import { useEffect } from "react";
import { setUserId } from "../features/cart/cartSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle login functionality
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Check if form data is valid
    if (!checkLoginFormData(data)) return;

    try {
      // Send login data to the backend
      const response = await axios.post("https://abhinasv-s-backend.onrender.com/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        const { id, role } = response.data; // Assuming the server returns these fields

        toast.success("You logged in successfully");

        // Store user details in localStorage
        const user = { loginStatus: true, role, id };
        localStorage.setItem("user", JSON.stringify(user));

        // Dispatch the login status and role flag to Redux
        dispatch(setLoginStatus(user));
        dispatch(setUserId(user.id)); 

        // Navigate to the user profile page
        navigate("/user-profile");
      } else {
        toast.error(response.data?.message || "Invalid email or password. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Server error. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Check if the user is already logged in when the page loads
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData?.loginStatus) {
      // Dispatch the login status and admin status to Redux
      dispatch(setLoginStatus(userData));


      // Redirect to the user profile page
      navigate("/user-profile", { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="max-w-5xl mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center max-sm:px-5"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-xl max-[450px]:font-normal">
          Welcome Back! Login here:
        </h2>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Your email</label>
            <input
              type="email"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              name="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Your password</label>
            <input
              type="password"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter password"
              name="password"
              required
            />
          </div>
        </div>
        <Button type="submit" text="Login" mode="brown" />

         {/* Forgot Password link */}
         <Link
         
          to="/reset-password"
          className="text-lg text-primaryBrown mt-3"
        >
          Forgot your password?
        </Link>
        <Link
          to="/register"
          className="text-xl max-md:text-lg max-[450px]:text-sm"
        >
          Don’t have an account?{" "}
          <span className="text-secondaryBrown">Register now</span>.
        </Link>
      </form>
    </div>
  );
};

export default Login;
