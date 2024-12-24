import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const OrderFailed = () => {
  return (
    <div className="max-w-screen-2xl mx-auto pt-20 text-center">
      <div className="animate-pulse">
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="text-red-500 text-9xl transition-transform duration-500 hover:scale-110"
        />
      </div>
      <h1 className="text-5xl font-light mt-6">Payment Failed</h1>
      <p className="mt-5 text-lg text-gray-600">
        Unfortunately, your payment could not be processed, and your order has
        not been placed.
      </p>
      <div className="flex flex-col items-center gap-4 mt-5">
        <Link
          to="/cart"
          className="text-white bg-blue-500 text-xl font-normal tracking-[0.6px] leading-[72px] w-[400px] h-12 flex items-center justify-center transition-transform duration-300 hover:scale-105 max-md:text-base max-md:w-[300px] max-md:h-10"
        >
          Return to Cart
        </Link>
        <Link
          to="/shop"
          className="text-white bg-secondaryBrown text-xl font-normal tracking-[0.6px] leading-[72px] w-[400px] h-12 flex items-center justify-center transition-transform duration-300 hover:scale-105 max-md:text-base max-md:w-[300px] max-md:h-10"
        >
          Continue Shopping
        </Link>
        <Link
          to="/order-history"
          className="text-white bg-gray-700 text-xl font-normal tracking-[0.6px] leading-[72px] w-[400px] h-12 flex items-center justify-center transition-transform duration-300 hover:scale-105 max-md:text-base max-md:w-[300px] max-md:h-10"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
};

export default OrderFailed;
