
import ProductItem from "./ProductItem";

type Product = {
  _id: string;
  images: string | string[];
  title: string;
  category: string;
  price: number;
  stock: number;
};

const ProductGrid = ({ products }: { products?: Product[] }) => {
  console.log(products);
  return (
    <div
      id="gridTop"
      className="max-w-screen-2xl flex flex-wrap justify-between items-center gap-y-8 mx-auto mt-12 max-xl:justify-start max-xl:gap-5 px-5 max-[400px]:px-3"
    >
      {products &&
        products.map((product) => (
          <ProductItem
            key={product._id} // Use product's id as the key
            id={product._id}
            image={product.images}
            title={product.title}
            category={product.category}
            price={product.price}
            // stock={product.stock}
          />
        ))}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default ProductGrid;


