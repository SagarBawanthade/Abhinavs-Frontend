import {
  ProductGrid,
  ProductGridWrapper,
  ShowingSearchPagination,
} from "../components";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const Search = () => {
  const sortCriteria = "";
  const category = "";
  

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-5 sm:px-10">
      {/* Header Section */}
      <div className="text-center mt-16">
        <h1 className="text-4xl font-bold text-[rgb(111,76,46)] mb-2">
          Explore Our Products
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl">
          Browse through our collection and find what you love!
        </p>
      </div>

      {/* Product Grid */}
      <div className="mt-12">
        <ProductGridWrapper  searchQuery={searchParams.get("query")!} 
        page={currentPage}
        sortCriteria={sortCriteria} 
        category={category}
        limit={9} >
          <ProductGrid />
        </ProductGridWrapper>
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <ShowingSearchPagination
          page={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Search;
