import { HiBars3 } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Link } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setUserData } from "../features/auth/authSlice";
import axios from "axios";

// Define the type for cart item
interface CartItem {
  product: string; // Assuming 'product' is a string, adjust according to your API response
}

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { loginStatus, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loginStatus && user?.id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`https://abhinasv-s-backend.onrender.com/api/auth/getuser/${user.id}`);
          dispatch(setUserData({ firstName: response.data.firstName }));

          const fetchCartData = async () => {
            try {
              const cartResponse = await axios.get(`https://abhinasv-s-backend.onrender.com/api/cart/cart/${user.id}`);
              const cartItems: CartItem[] = cartResponse.data.cart.items || []; // Type the cartItems array

              // Ensure the item has a 'product' property of type 'string'
              const uniqueProducts = new Set(cartItems.map((item: CartItem) => item.product));
              const uniqueItemCount = uniqueProducts.size;
              setCartItemCount(uniqueItemCount);
              console.log("Cart Item Count in Header:", uniqueItemCount);
            } catch (error) {
              console.error("Failed to fetch cart data:", error);
            }
          };

          // Initial fetch for cart data
          fetchCartData();

          // Set up polling (every 5 seconds, for example)
          const interval = setInterval(fetchCartData, 5000); // Poll every 5 seconds

          return () => clearInterval(interval); // Cleanup interval on component unmount
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [loginStatus, user?.id, dispatch]);

  // Debugging cartItemCount in the component return
  console.log("Cart Item Count in Header:", cartItemCount);

  return (
    <>
      <header className="max-w-screen-2xl flex text-center justify-between items-center py-4 px-5 text-black mx-auto max-sm:px-5 max-[400px]:px-3">
        <HiBars3
          className="text-2xl max-sm:text-xl mr-20 max-lg:mr-0 cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
        />
        <Link
          to="/"
          className="text-4xl font-light tracking-[1.08px] max-sm:text-3xl max-[400px]:text-2xl"
        >
          Abhinav's
        </Link>
        <div className="flex gap-4 items-center max-sm:gap-2">
          <Link to="/search">
            <HiOutlineMagnifyingGlass className="text-2xl max-sm:text-xl" />
          </Link>
          {loginStatus ? (
            <Link to="/user-profile" className="text-2xl max-sm:text-xl font-semibold">
              {user?.firstName || "User"}
            </Link>
          ) : (
            <Link to="/login">
              <HiOutlineUser className="text-2xl max-sm:text-xl" />
            </Link>
          )}
          <Link to="/cart" className="relative">
            <HiOutlineShoppingBag className="text-2xl max-sm:text-xl" />
            {cartItemCount > -1 && (
              <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>
      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
};

export default Header;
