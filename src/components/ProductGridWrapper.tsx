import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setShowingProducts, setTotalProducts } from "../features/shop/shopSlice";

interface Product {
  title: string;
  price: number;
  category: string;
  popularity: number;
  // Add other fields as necessary
}

interface ProductGridWrapperProps {
  searchQuery: string;
  sortCriteria: string;
  category: string;
  page: number;
  limit: number;
  children: React.ReactNode; // Allow any React nodes as children
}

const ProductGridWrapper: React.FC<ProductGridWrapperProps> = ({
  searchQuery,
  sortCriteria,
  category,
  page,
  limit,
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { totalProducts } = useAppSelector((state) => state.shop);
  const dispatch = useAppDispatch();

  const getProducts = async () => {
    try {
      const response = await fetch("https://abhinasv-s-backend.onrender.com/api/product/getproducts");
      const allProducts = await response.json();

      let filteredProducts = allProducts;

      // Filtering by search query
      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product: { title: string }) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filtering by category
      if (category) {
        filteredProducts = filteredProducts.filter((product: { category: string }) =>
          product.category === category
        );
      }

      // Sorting the products
      if (sortCriteria === "price-asc") {
        filteredProducts = filteredProducts.sort((a: { price: number }, b: { price: number }) => a.price - b.price);
      } else if (sortCriteria === "price-desc") {
        filteredProducts = filteredProducts.sort((a: { price: number }, b: { price: number }) => b.price - a.price);
      } else if (sortCriteria === "popularity") {
        filteredProducts = filteredProducts.sort((a: { popularity: number }, b: { popularity: number }) => b.popularity - a.popularity);
      }

      // Updating the Redux store for total products
      if (totalProducts !== filteredProducts.length) {
        dispatch(setTotalProducts(filteredProducts.length));
      }

      // Limiting the number of products if limit is provided
      if (limit) {
        setProducts(filteredProducts.slice(0, limit));
        dispatch(setShowingProducts(filteredProducts.slice(0, limit).length));
      } else if (page) {
        setProducts(filteredProducts.slice(0, page * 9));
        dispatch(setShowingProducts(filteredProducts.slice(0, page * 9).length));
      } else {
        setProducts(filteredProducts);
        dispatch(setShowingProducts(filteredProducts.length));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Call the function to get products when the component mounts or dependencies change
  useEffect(() => {
    getProducts();
  }, [searchQuery, sortCriteria, category, page, limit, dispatch, totalProducts]);

  return (
    <>
      {/* Pass products to the child (ProductGrid) */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, { products });
        }
        return child;
      })}
    </>
  );
};

export default ProductGridWrapper;
