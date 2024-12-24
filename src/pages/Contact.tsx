import { Link } from "react-router-dom";
import { Button } from "../components";
import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Simulate a form submission process
    setIsLoading(true);

    setTimeout(() => {
      console.log("Contact form submitted:", data);
      setIsLoading(false);
      alert("Thank you for reaching out! We will get back to you soon.");
    }, 2000);
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 px-5 flex flex-col items-center">
      {/* Contact Form */}
      <div className="w-full max-w-5xl mb-16">
        <h2 className="text-5xl text-center font-thin mb-2">Get in Touch</h2>
        <p className="text-sm font-bold text-center  mb-8">We will contact you within 3-5 business days</p>
        <form
          onSubmit={handleContactSubmit}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter your name"
              id="name"
              name="name"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter your email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="message">Your Message</label>
            <textarea
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter your message"
              id="message"
              name="message"
              rows={5}
              required
            ></textarea>
          </div>
          <Button type="submit" text={isLoading ? "Sending..." : "Send Message"} mode="brown" disabled={isLoading} />
        </form>
      </div>

      {/* Legal Information */}
      <div className="w-full max-w-5xl">
        <h3 className="text-3xl font-semibold mb-6">Legal Information</h3>
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-2xl mb-3 font-semibold">Privacy Policy</h4>
            
            <p>
              Abhinav's value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information.
            </p>
            <ul className="mt-5 list-disc list-inside">
             
                <strong className="mt-2">⁂ Data Collection:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Personal details (name, email, etc.) for order processing.</li>
                  <li>Browsing data for improving user experience.</li>
                </ul>
              
             
                <strong className="mt-2">⁂ Data Usage: </strong>
                <ul className="list-disc list-inside ml-4">
                  <li>To process orders and manage accounts.</li>
                  <li>To send promotional offers (you can opt out anytime).</li>
                </ul>
             
            
              <strong className="mt-2">⁂ Data Sharing: </strong>
                 We never sell your data. Third-party services like payment gateways and shipping providers may access the minimum data necessary to serve you.
              
            </ul>
            <p>
              For detailed inquiries, contact us at  <strong>abhinavsofficial033@gmail.com.</strong>
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-2xl font-semibold">Terms & Conditions</h4>
            <p>
              <strong>Introduction: </strong>
               These terms govern your use of Abhinav's. By Using our site, you agree to these terms.
            </p>
            <ul className="list-disc list-inside">
            
              <strong className="mt-2">⁂ Use of Website:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>You must be at least 18 years old or have parental consent to use this website.</li>
                  <li>You agree to provide accurate information during purchases.</li>
                </ul>
            
             
                <strong className="mt-2">⁂ Liability: </strong>
                Abhinav's is not responsible for delays due to external factors like shipping disruptions.
             
            </ul>
          </div>
          <div>
            <h4 className=" mb-3 text-2xl font-semibold">Cancellation/Refund Policies</h4>
            <ul className="list-disc list-inside">
              <li>
                <strong>Cancellations: </strong>
                Orders will not be cancelled once placed, can be returned within 15 days.
              </li>
              <li>
                <strong>Refunds: </strong>
                Refunds are processed within 7 business days after we receive the returned product. The product must be unused and in its original packaging.
              </li>
              <li>
                <strong>Exchange: </strong>
                We offer exchanges for defective or incorrect products.
              </li>
            </ul>
            <p>
              If you have any concerns, please email us at <strong>abhinavsofficial033@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
