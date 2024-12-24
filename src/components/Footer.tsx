import { FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Image from "../assets/brand logo.jpg"; 
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <>
      <div className="mt-10">
        <footer style={{backgroundColor:"rgb(138 132 117)"}} className="bg-black text-white px-6 py-12">
          {/* Main Section */}
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
            {/* Client Service */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl  font-bold">Client Service</h3>
              <p className="text-sm text-black">After-sale Service</p>
              <p className="text-sm text-black">Efficient Replace & Return</p>
            </div>

            {/* Our Brand */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold"> Our Brand</h3>
              <p className="text-sm text-black" >Abhinav's Best of World</p>
              <p className="text-sm text-black" >
                At Abhinav's, we are committed to offering top-quality products and exceptional customer service. Our mission is to provide good quality products and different collection & styling for everyone at affordable value.
              </p>
            </div>

            {/* Custom Clothing */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold ">Custom Clothing</h3>
              <p className="text-sm text-black">Christmas Edition</p>
              <p className="text-sm text-black">Winter Edition</p>
              <p className="text-sm text-black">Unique Collection</p>
            </div>

            {/* Policies Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold ">Policies</h3>
              <Link to="/contact" className=" text-black text-sm hover:underline">Privacy Policy</Link>
              <Link to="/contact"className="text-black text-sm hover:underline">Terms & Conditions</Link>
              <Link to="/contact" className=" text-black text-sm hover:underline">Cancellation/Refund Policies</Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white mt-12"></div>

          {/* Contact Section */}
          <div className="flex flex-col items-center sm:items-start lg:flex-row justify-between gap-8 mt-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">We’re Here to Help!</h3>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-black" />
                <p className="text-sm text-black">abhinavsofficial033@gmail.com</p>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-black" />
                <p className="text-sm text-black">+91 8828458883</p>
                <p className="text-sm text-black">+91 7620397865</p>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-black" />
                <p className="text-sm text-black">Mumbai ,India </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-6">
              <a
                href="https://www.instagram.com/abhinavsofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[rgb(206,29,130)] rounded-full p-2 hover:bg-gray-200"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="mailto:abhinavsofficial033@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[rgb(0,0,0)] rounded-full p-2 hover:bg-gray-200"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white mt-12"></div>

          {/* Footer Bottom Section */}
          <div className="flex flex-col items-center gap-6 mt-8">
            {/* Abhinav Logo */}
            <img 
            src={Image}
          style={{borderRadius:"150px" ,width: "200px", height: "200px"}}
            alt="Abhinav Logo"
           
    
            />

            {/* Copyright Text */}
            <p className="text-l">All rights reserved ©2024 Abhinav's</p>


             
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
