import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setLoginStatus, initializeLoginStatus } from "../features/auth/authSlice";

const SidebarMenu = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useAppDispatch();
  const { loginStatus } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [autoCloseTimeout, setAutoCloseTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(initializeLoginStatus());
  }, [dispatch]);

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    dispatch(setLoginStatus({ loginStatus: false, user: null })); // This is valid now
    setIsSidebarOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    if (isSidebarOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 2000);
      setAutoCloseTimeout(timer);
    } else {
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
      }
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen, setIsSidebarOpen]);

  const handleInteraction = () => {
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout);
    }
    const timer = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 2000);
    setAutoCloseTimeout(timer);
  };

  return (
    <>
      {(isSidebarOpen || isAnimating) && (
        <div
          className={
            isSidebarOpen
              ? "fixed top-0 left-0 w-64 z-50 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg transform border-r border-black translate-x-0"
              : "fixed top-0 left-0 w-64 z-50 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg transform border-r border-black -translate-x-full"
          }
          onMouseMove={handleInteraction}
          onClick={handleInteraction}
        >
          <div className="flex justify-end mr-1 mt-1">
            <HiXMark
              className="text-3xl cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <div className="flex justify-center mt-2">
            <Link
              to="/"
              className="text-4xl font-light tracking-[1.08px] max-sm:text-3xl max-[400px]:text-2xl"
              onClick={handleInteraction}
            >
              Abhinav's
            </Link>
          </div>
          <div className="flex flex-col items-center gap-1 mt-7">
            <Link
              to="/"
              className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
              onClick={handleInteraction}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
              onClick={handleInteraction}
            >
              Shop
            </Link>
            <Link
              to="/search"
              className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
              onClick={handleInteraction}
            >
              Search
            </Link>
            {loginStatus ? (
              <button
                onClick={() => {
                  handleInteraction();
                  logout();
                }}
                className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
                  onClick={handleInteraction}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
                  onClick={handleInteraction}
                >
                  Sign up
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
              onClick={handleInteraction}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarMenu;
