import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setShowingProducts, setTotalProducts } from "../features/shop/shopSlice";

const ProductGridWrapper = ({
  searchQuery,
  sortCriteria,
  category,
  page,
  limit,
  children,
}) => {
  const [products, setProducts] = useState([]);
  const { totalProducts } = useAppSelector((state) => state.shop);
  const dispatch = useAppDispatch();

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/getproducts");
      const allProducts = await response.json();
     
      let filteredProducts = allProducts;
      
      // Filtering by search query
      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filtering by category
      if (category) {
        filteredProducts = filteredProducts.filter((product) =>
          product.category === category
        );
      }

      // Sorting the products
      if (sortCriteria === "price-asc") {
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortCriteria === "price-desc") {
        filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortCriteria === "popularity") {
        filteredProducts = filteredProducts.sort((a, b) => b.popularity - a.popularity);
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

  // Clone children and pass the products as props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { products });
    }
    return null;
  });

  return <>{childrenWithProps}</>;
};

export default ProductGridWrapper;
