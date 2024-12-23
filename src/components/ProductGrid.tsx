import React from "react";
import ProductItem from "./ProductItem";



const ProductGrid = ({ products }: { products?: Product[] }) => {
  console.log(products);
  return (
    <div
      id="gridTop"
      className="max-w-screen-2xl flex flex-wrap justify-between items-center gap-y-8 mx-auto mt-12 max-xl:justify-start max-xl:gap-5 px-5 max-[400px]:px-3"
    >
      {products &&
        products.map((product: Product) => (
         // Log the id here
          <ProductItem
            key={product._id} // Use product's id as the key
            id={product._id}
            image={product.images}
            title={product.title}
            category={product.category}
            price={product.price}
            stock={product.stock}
          />
        ))}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders because of React.cloneElement
export default React.memo(ProductGrid);
