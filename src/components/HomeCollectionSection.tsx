import ProductGrid from "./ProductGrid";
import ProductGridWrapper from "./ProductGridWrapper";

const HomeCollectionSection = () => {
  const searchQuery = ""; // Example: you can set this dynamically based on the context
  const sortCriteria = "price"; // Default sorting criteria (change as needed)
  const category = "default"; // Set the category or fetch it from context or state
  const page = 1; // Example: first page (you can implement pagination logic later)
  const limit = 6;

  return (
    <div>
      <div className="max-w-screen-2xl flex items-center justify-between mx-auto mt-24 px-5 max-[400px]:px-3">
        <h2 className="text-black text-5xl font-normal tracking-[1.56px] max-sm:text-4xl">
          Our Collection
        </h2>
      </div>
      <ProductGridWrapper
        searchQuery={searchQuery}
        sortCriteria={sortCriteria}
        category={category}
        page={page}
        limit={limit}
      >
        <ProductGrid />
      </ProductGridWrapper>
    </div>
  );
};

export default HomeCollectionSection;
