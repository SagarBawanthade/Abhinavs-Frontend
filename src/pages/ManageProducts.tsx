import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ManageProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://abhinasv-s-backend.onrender.com/api/product/getproducts");
        setProducts(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error fetching products:", error.message);
        } else {
          console.log("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openDialog = (id: string) => {
    setProductToDelete(id);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setProductToDelete(null);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`https://abhinasv-s-backend.onrender.com/api/product/deleteproduct/${productToDelete}`);
      setProducts(products.filter((product) => product._id !== productToDelete));
      toast.success("Product deleted successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error deleting product: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while deleting the product");
      }
    } finally {
      closeDialog();
    }
  };

  if (loading) return <div>Loading...</div>;

  const categories = ["Hoodies", "Tshirt", "Oversize-Tshirt"];
  const categorizedProducts = categories.reduce((acc, category) => {
    acc[category] = products.filter((product) => product.category === category);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Products</h2>
        <div className="space-x-4">
          <Link
            to="/admin/add-product"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Add Product
          </Link>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{category}</h3>
          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto snap-x scroll-smooth space-x-4 px-4">
            {categorizedProducts[category].map((product: any) => (
              <div
                key={product._id}
                className="snap-center flex-none w-64 bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center p-4"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded-md"
                />
                <h4 className="text-sm mb-2">{product.name}</h4>
                <p className="text-xl font-bold text-gray-800">₹{product.price}</p>
                <p
                  className={`text-sm font-semibold mt-2 px-3 py-1 rounded-full ${
                    product.stock ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {product.stock ? "In Stock" : "Out of Stock"}
                </p>
                <div className="flex justify-between mt-4 w-full">
                  <Link
                    to={`/admin/update-product/${product._id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => openDialog(product._id)}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDeleteProduct}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDialog}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
