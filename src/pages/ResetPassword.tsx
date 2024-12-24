import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';  // Assuming Button is a reusable component

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  // Handle password reset functionality
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate if email and newPassword are provided
    if (!email || !newPassword) {
      toast.error('Please provide both email and new password');
      return;
    }

    try {
      const response = await axios.post('https://abhinasv-s-backend.onrender.com/api/auth/reset-password/', {
        email,
        newPassword,
      });

      if (response.status === 200) {
        toast.success('Password updated successfully');
        navigate('/login'); // Redirect to login page after successful password reset
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleResetPassword}
        className="max-w-5xl mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center max-sm:px-5"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-xl max-[450px]:font-normal">
          Reset Your Password
        </h2>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Your email</label>
            <input
              type="email"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword">New password</label>
            <input
              type="password"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter new password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" text="Reset Password" mode="brown" />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Remembered your password?{' '}
            <span
              className="text-rgb(138 132 117) cursor-pointer hover:underline"
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
