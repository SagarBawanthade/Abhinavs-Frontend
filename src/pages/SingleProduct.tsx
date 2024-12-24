import { Button, Dropdown, ProductItem, QuantityInput, StandardSelectInput } from "../components";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { useAppDispatch } from "../hooks";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import { formatCategoryName } from "../utils/formatCategoryName";
import toast from "react-hot-toast";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from "react-redux";


const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("S"); // Default size set to "S"
  const [color, setColor] = useState<string>("Red"); // Default color set to "Red"
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  const { user } = useSelector((state: any) => state.auth);
  const { productsInCart } = useSelector((state: any) => state.cart);
 

  // Function to get estimated delivery date
  const getEstimatedDelivery = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5); // Add 5 days
    return currentDate.toLocaleDateString(); // Return the formatted date
  }

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const response = await fetch(
        `https://abhinasv-s-backend.onrender.com/api/product/getproduct/${params.id}`
      );
      const data = await response.json();
      setSingleProduct(data);
      console.log(data); // Assuming the product data is in the first index
    };

    const fetchProducts = async () => {
      const response = await fetch("https://abhinasv-s-backend.onrender.com/api/product/getproducts");
      const data = await response.json();
      setProducts(data);
    };
    fetchSingleProduct();
    fetchProducts();
  }, [params.id]);

  const handleAddToCart = async () => {

    if (!user) {
      // If the user is not logged in, show a toast message
      toast.error("Please log in first to add products to your cart");
      return;
    }
    if (singleProduct) {

      // Ensure productsInCart is always an array
      const isProductInCart = Array.isArray(productsInCart) && productsInCart.some(
        (item) => item.id === singleProduct._id && item.size === size && item.color === color
      );
  
      if (isProductInCart) {
        toast.error("Product with selected size and color is already in the cart");
        return;
      }
  
      // Check if the quantity exceeds stock
      if (quantity > singleProduct.stock) {
        toast.error("Not enough stock available");
        return;
      }
  
      // Create the cart product object with selected size, color, and quantity
      const cartProduct = {
        id: singleProduct._id,
        size, // Selected size
        color, // Selected color
        quantity,
        image: singleProduct.images[0], // First image as the main image
        title: singleProduct.name,
        price: singleProduct.price,
        stock: singleProduct.stock,
      };
  
     
  
      try {
        // Send to backend (save to database)
        const response = await fetch("https://abhinasv-s-backend.onrender.com/api/cart/add-to-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id, // Use logged-in user's ID
            productId: singleProduct._id, // Product ID
            items: [
              {
                id: singleProduct._id,
                size,
                color,
                quantity,
                image: singleProduct.images[0], // First image
                title: singleProduct.name,
                price: singleProduct.price,
                stock: singleProduct.stock,
              }
            ],
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          toast.success("Product added to the cart");
           // Add the product locally to the cart (Redux state update)
      dispatch(addProductToTheCart(cartProduct));
      console.log("Added Product:", cartProduct);
        } else {
          toast.error(data.message || "Failed to add product to the cart");
        }
      } catch (error) {
        console.error("Error adding product to the cart:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  

  
  

  // Settings for React Slick (moved this definition here)
  const slickSettings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite loop
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one image at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Autoplay the slider
    autoplaySpeed: 3000, // Set delay for autoplay
  };
  

  return (
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3">
      <div className="grid grid-cols-3 gap-x-8 max-lg:grid-cols-1">
        <div className="lg:col-span-2">
          {/* React Slick for displaying multiple images */}
          <Slider {...slickSettings}>
            {singleProduct?.images?.map((image, index) => (
              <div key={index}>
                <img
                  src={image} // Dynamically display each image
                  alt={`${singleProduct?.name} image ${index + 1}`}
                  className="w-full h-auto object-cover" // Adjust size as needed
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="w-full flex flex-col gap-5 mt-9">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl">{singleProduct?.name}</h1>
            <div className="flex justify-between items-center">
              <p className="text-base text-secondaryBrown">
                {formatCategoryName(singleProduct?.category || "")}
              </p>
              <p className="text-base font-bold"> ₹{singleProduct?.price}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {/* Dynamically handle sizes */}
            <SelectInputUpgrade
              selectList={singleProduct?.size.map((size) => ({
                id: size,
                value: size,
              })) || []}
              value={size}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSize(e.target.value)
              }
            />
            {/* Dynamically handle colors */}
            <SelectInputUpgrade
              selectList={singleProduct?.color.map((color) => ({
                id: color,
                value: color,
              })) || []}
              value={color}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setColor(e.target.value)
              }
            />
            <QuantityInputUpgrade
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(parseInt(e.target.value))
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            {/* Stock Status */}
            {singleProduct?.stock !== undefined && (
              <p
                className={`text-sm font-semibold ${
                  singleProduct.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {singleProduct.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            )}
            <Button
              mode="brown"
              text="Add to cart"
              onClick={handleAddToCart}
              disabled={singleProduct?.stock === 0}
            />
            <p className="text-secondaryBrown text-sm text-right">
              {`Delivery estimated on ${getEstimatedDelivery()}`}
            </p>
          </div>
          <div>
            {/* Product Description */}
            <Dropdown dropdownTitle="Description">
              {singleProduct?.description}
            </Dropdown>

            {/* Product Details */}
            <Dropdown dropdownTitle="Product Details">
              <p><strong>Material:</strong> {singleProduct?.details.material}</p>
              <p><strong>Care Instructions:</strong> {singleProduct?.details.careInstructions}</p>
              <p><strong>Origin:</strong> {singleProduct?.details.origin}</p>
              <p><strong>Fabric:</strong> {singleProduct?.details.fabric}</p>
              <p><strong>Neck:</strong> {singleProduct?.details.neck}</p>
              <p><strong>Sleeve:</strong> {singleProduct?.details.sleeve}</p>
              <p><strong>Style Code:</strong> {singleProduct?.details.styleCode}</p>
              <p><strong>Occasion:</strong> {singleProduct?.details.occasion}</p>
              <p><strong>Suitable For:</strong> {singleProduct?.details.suitableFor}</p>
            </Dropdown>

            {/* Delivery Details */}
            <Dropdown dropdownTitle="Delivery Details">
              {singleProduct?.details.shippingInfo}<br />
              {`Delivery estimated on ${getEstimatedDelivery()}`}
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div>
        <h2 className="text-black/90 text-5xl mt-24 mb-12 text-center max-lg:text-4xl">
          Similar Products
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-y-8 mt-12 max-xl:justify-start max-xl:gap-5">
          {products.slice(0, 3).map((product: Product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              image={product.images[0]} // Display first image for similar products
              title={product.name}
              category={product.category}
              price={product.price}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
