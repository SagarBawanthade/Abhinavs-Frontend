import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateProductQuantity, removeProductFromTheCart, setCartData, setUserId } from "../features/cart/cartSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiCheck as CheckIcon, HiXMark as XMarkIcon } from "react-icons/hi2";

const Cart = () => {
  const dispatch = useDispatch();
  const { productsInCart = [], subtotal, userId } = useSelector((state: any) => state.cart);
  console.log("Cart Data in Cart Page:", productsInCart, subtotal, userId);

  
  const { user } = useSelector((state: any) => state.auth); // Assuming `user` contains user info

  // Fetch userId from auth state, if available
  const currentUserId = user?.id || userId; // Fallback to Redux state if user is not logged in yet

  // Fetch cart data from backend API
  useEffect(() => {
    if (currentUserId) {
      const fetchCartData = async () => {
        try {
          const response = await fetch(`https://abhinasv-s-backend.onrender.com/api/cart/cart/${currentUserId}`);
          if (response.ok) {
            const data = await response.json();
            // Dispatch only the necessary parts of the data
            dispatch(setCartData({
              productsInCart: data.cart.items.map((item: any) => ({
                ...item.product,
                quantity: item.quantity,
                size: item.size, // Assuming size is returned from the backend
              })),
              subtotal: data.cart.items.reduce(
                (acc: number, item: any) => acc + item.product.price * item.quantity,
                0
              ),
              userId: currentUserId,
            }));
          } else {
            toast.error("Failed to load cart data.");
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
          toast.error("Something went wrong. Please try again.");
        }
      };
      fetchCartData();
    }
  }, [dispatch, currentUserId]);

  // Handle remove product
  const handleRemoveProduct = async (productId: string) => {
    const updatedCart = productsInCart.filter((item) => item._id !== productId);
    dispatch(removeProductFromTheCart({ id: productId }));
    localStorage.setItem(`cart_${currentUserId}`, JSON.stringify({ productsInCart: updatedCart, subtotal }));

    try {
      const response = await fetch("https://abhinasv-s-backend.onrender.com/api/cart/cart/remove-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, productId: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove the product from the cart.");
      }

      toast.success("Product removed from the cart.");
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      toast.error("Quantity must be greater than 0.");
      return;
    }

    try {
      const response = await fetch("https://abhinasv-s-backend.onrender.com/api/cart/cart/update-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, productId: productId, quantity: newQuantity }),
      });

      if (response.ok) {
        dispatch(updateProductQuantity({ id: productId, quantity: newQuantity }));

        const updatedCart = productsInCart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        const newSubtotal = updatedCart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        dispatch(setCartData({
          productsInCart: updatedCart,
          subtotal: newSubtotal,
          userId: currentUserId,
        }));

        localStorage.setItem(`cart_${currentUserId}`, JSON.stringify({ productsInCart: updatedCart, subtotal: newSubtotal }));
        toast.success("Quantity updated.");
      } else {
        toast.error("Failed to update the quantity.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white mx-auto max-w-screen-2xl px-5 max-[400px]:px-3">
      <div className="pb-24 pt-16">
        <h1 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

            {productsInCart.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-lg text-gray-700">Your cart is empty</p>
              </div>
            ) : (
              productsInCart.map((item) => (
                <li key={item._id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : "default-image-url"}
                      alt={item.name}
                      className="h-24 w-24 object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <h3 className="text-sm">
                          <Link to={`/product/${item._id}`} className="font-medium text-gray-700 hover:text-gray-800">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price}</p>
                        {/* Display Size */}
                        <p className="mt-2 text-sm text-gray-600">Size: {item.size || "N/A"}</p> {/* Display size */}
                      </div>
                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${item._id}`}>Quantity:</label>
                        <input
                          type="number"
                          id={`quantity-${item._id}`}
                          className="w-16 h-7 indent-1 bg-white border"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                        />
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => handleRemoveProduct(item._id)}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      {item.stock && item.stock > 0 ? (
                        <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />
                      )}
                      <span>{item.stock && item.stock > 0 ? "In stock" : "Out of stock"}</span>
                    </p>
                  </div>
                </li>
              ))
            )}
          </section>

          <section aria-labelledby="summary-heading" className="mt-16 bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">₹{subtotal}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">Shipping estimate</dt>
                <dd className="text-sm font-medium text-gray-900">₹0</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">Tax estimate</dt>
                <dd className="text-sm font-medium text-gray-900">₹{1}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">
                  ₹{subtotal + 0 + subtotal / 5}
                </dd>
              </div>
            </dl>

            {productsInCart.length > 0 && (
              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="text-white bg-secondaryBrown text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center max-md:text-base"
                >
                  Checkout
                </Link>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};

export default Cart;
