import SocialMediaFooter from "./SocialMediaFooter";
import { HiChevronDown } from "react-icons/hi2";


const Footer = () => {
  return (
    <>
      <SocialMediaFooter />
      <footer className="max-w-screen-2xl mx-auto border-b-8 border-secondaryBrown px-5 max-[400px]:px-3">
        <div className="flex justify-center gap-24 text-center mt-12 max-[800px]:flex-col max-[800px]:gap-10">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold max-sm:text-xl">Client Service</h3>
            <p className="text-lg max-sm:text-base">After-sale Service</p>
            <p className="text-lg max-sm:text-base">Efficient Replace & Return </p>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold max-sm:text-xl">Our Brand</h3>
            <p className="text-lg max-sm:text-base">Abhinav's</p>
            <p className="text-lg max-sm:text-base">Best of World's</p>
            
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold max-sm:text-xl">Custom Clothing</h3>
            <p className="text-lg max-sm:text-base">Christmas Edition</p>
            <p className="text-lg max-sm:text-base">Winter Edition</p>
            <p className="text-lg max-sm:text-base">Unique Collection</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 my-20">
          <p className="flex justify-center items-center text-2xl gap-2 max-sm:text-xl">English <HiChevronDown /></p>
          <h2 className="text-6xl font-light text-center max-sm:text-5xl">Abhinav's</h2>
          <p className="text-base text-center max-sm:text-sm">All rights reserved ©2024</p>
          <ul className="flex justify-center items-center gap-7 text-base max-sm:text-sm max-[350px]:flex-col max-[350px]:gap-5">
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Legal Notes</li>
          </ul>
        </div>
      </footer>
    </>
  );
};
export default Footer;
