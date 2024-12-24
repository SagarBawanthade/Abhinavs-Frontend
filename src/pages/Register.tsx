import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { checkRegisterFormData } from "../utils/checkRegisterFormData";
import axios from "axios"; // Replace customFetch with axios
import toast from "react-hot-toast";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Check if form data is valid
    if (!checkRegisterFormData(data)) return;

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true); // Start spinner

    try {
      // Send registration data to the backend
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        firstName: data.name,
        lastName: data.lastname,
        email: data.email,
        password: data.password,
      });

      if (response.status === 201) {
        toast.success("User registered successfully");
        navigate("/login");
      } else {
        toast.error(response.data?.message || "An error occurred. Please try again");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Server error. Please try again.";
      toast.error(errorMessage);
    }finally {
      setIsLoading(false); // Stop spinner
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="max-w-5xl mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center max-sm:px-5"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-xl max-[450px]:font-normal">
          Welcome! Register here:
        </h2>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Your name</label>
            <input
              type="text"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter name"
              id="name"
              name="name"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lastname">Your lastname</label>
            <input
              type="text"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter lastname"
              id="lastname"
              name="lastname"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Your email</label>
            <input
              type="email"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              id="email"
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
              id="password"
              name="password"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
        </div>
        <Button type="submit" text="Register" mode="brown" />
        <Link
          to="/login"
          className="text-xl max-md:text-lg max-[450px]:text-sm"
        >
          Already have an account?{" "}
          <span className="text-secondaryBrown">Login now</span>.
        </Link>
      </form>
    </div>
  );
};

export default Register;
