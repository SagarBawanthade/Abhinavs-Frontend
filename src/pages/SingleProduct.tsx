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

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  size: string[];
  color: string[];
  details: {
    material: string;
    careInstructions: string;
    origin: string;
    fabric: string;
    neck: string;
    sleeve: string;
    styleCode: string;
    occasion: string;
    suitableFor: string;
    shippingInfo: string;
  };
}

const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("S");
  const [color, setColor] = useState<string>("Red");
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  const { user } = useSelector((state: any) => state.auth);
  const { productsInCart } = useSelector((state: any) => state.cart);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const response = await fetch(
        `https://abhinasv-s-backend.onrender.com/api/product/getproduct/${params.id}`
      );
      const data = await response.json();
      setSingleProduct(data);
    };

    const fetchProducts = async () => {
      const response = await fetch("https://abhinasv-s-backend.onrender.com/api/product/getproducts");
      const data = await response.json();
      setProducts(data);
    };
    fetchSingleProduct();
    fetchProducts();
  }, [params.id]);

  // Function to get estimated delivery date
  const getEstimatedDelivery = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5); // Add 5 days
    return currentDate.toLocaleDateString(); // Return the formatted date
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in first to add products to your cart");
      return;
    }

    if (singleProduct) {
      const isProductInCart = Array.isArray(productsInCart) && productsInCart.some(
        (item) => item.id === singleProduct._id && item.size === size && item.color === color
      );

      if (isProductInCart) {
        toast.error("Product with selected size and color is already in the cart");
        return;
      }

      if (quantity > singleProduct.stock) {
        toast.error("Not enough stock available");
        return;
      }

      const cartProduct = {
        id: singleProduct._id,
        _id: singleProduct._id,// Add this line
        size,
        color,
        quantity,
        images: singleProduct.images[0],
        name: singleProduct.name,
        price: singleProduct.price,
        stock: singleProduct.stock,
      };

      try {
        const response = await fetch("https://abhinasv-s-backend.onrender.com/api/cart/add-to-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            productId: singleProduct._id,
            items: [
              cartProduct
            ],
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Product added to the cart");
          dispatch(addProductToTheCart(cartProduct));
        } else {
          toast.error(data.message || "Failed to add product to the cart");
        }
      } catch (error) {
        console.error("Error adding product to the cart:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
              //stock={product.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
