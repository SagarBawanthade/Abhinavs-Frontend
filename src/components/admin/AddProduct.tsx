import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Hoodies",
    gender: "Unisex",
    price: 0,
    stock: 0,
    size: [],
    color: [],
    images: [], // Store image URLs
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      if (type === "checkbox") {
        const updatedArray = checked
          ? [...prevState[name], value]
          : prevState[name].filter((item) => item !== value);
        return { ...prevState, [name]: updatedArray };
      } else {
        return { ...prevState, [name]: value };
      }
    });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files; // Get multiple files
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();

      // Append each file to FormData
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      // Send multiple files to backend for uploading to S3
      const response = await axios.post(
        "http://localhost:5000/api/product/image-upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        // Assuming response.data contains an array of image URLs
        setFormData((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...response.data.imageUrls], // Add multiple image URLs
        }));
        toast.success("Images uploaded successfully!");
      }
    } catch (err) {
      toast.error("Failed to upload images.");
     
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image removal
  const handleImageDelete = (imageToDelete) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((image) => image !== imageToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send the form data to backend
      const response = await axios.post(
        "http://localhost:5000/api/product/addproduct",
        formData
      );

      if (response.status === 201) {
       toast.success("Product added successfully!");
        // Reset form
        setFormData({
          name: "",
          description: "",
          category: "Hoodies",
          gender: "Unisex",
          price: 0,
          stock: 0,
          size: [],
          color: [],
          images: [],
        });
      }
    } catch (err) {
      toast.error("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
              required
            >
              <option value="Hoodies">Hoodies</option>
              <option value="Tshirt">Tshirt</option>
              <option value="Oversize-Tshirt">Oversize-Tshirt</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold">Gender</label>
            <div className="space-x-4">
              {["Unisex", "Male", "Female"].map((genderOption) => (
                <label key={genderOption} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption}
                    checked={formData.gender === genderOption}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">{genderOption}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
              required
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-semibold">Sizes</label>
            <div className="space-x-4">
              {["S", "M", "L", "XL"].map((size) => (
                <label key={size} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="size"
                    value={size}
                    checked={formData.size.includes(size)}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-semibold">Colors</label>
            <div className="space-x-4">
              {["Red", "Blue", "Green", "Black"].map((color) => (
                <label key={color} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="color"
                    value={color}
                    checked={formData.color.includes(color)}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label htmlFor="images" className="block text-sm font-semibold">
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
            />
            {uploadingImage && "Uploading..."}
            <div className="mt-2 flex space-x-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Uploaded Preview ${index + 1}`}
                    className="w-20 h-20 object-cover border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-600"
              disabled={loading}
            >
              {loading ?  "Loading..." :  "Add Product"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
