import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="max-w-screen-2xl mx-auto pt-20 text-center">
      <div className="animate-bounce">
        <FontAwesomeIcon
          icon={faThumbsUp}
          className="text-green-500 text-9xl transition-transform duration-500 hover:scale-110"
        />
      </div>
      <h1 className="text-5xl font-light mt-6">Order Confirmation</h1>
      <p className="mt-5 text-lg">
        Your order has been confirmed and will be shipped shortly.
      </p>
      <div className="flex flex-col items-center gap-4 mt-5">
        <Link
          to="/shop"
          className="text-white 
bg-secondaryBrown text-xl font-normal tracking-[0.6px] leading-[72px] w-[400px] h-12 flex items-center justify-center transition-transform duration-300 hover:scale-105 max-md:text-base"
        >
          Continue shopping
        </Link>
        <Link
          to="/order-history"
          className="text-white 
bg-secondaryBrown text-xl font-normal tracking-[0.6px] leading-[72px] w-[400px] h-12 flex items-center justify-center transition-transform duration-300 hover:scale-105 max-md:text-base"
        >
          See order history and status
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
