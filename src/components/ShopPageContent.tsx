import {
  ProductGrid,
  ProductGridWrapper,
  ShopFilterAndSort,
  ShowingPagination,
} from "../components";

import { useState } from "react";

const ShopPageContent = ({ category, page }: { category: string; page: number }) => {
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(page);
  const searchQuery = ""; // Assuming no search query for now
  const limit = 12; // Set a default limit (you can change this)

  return (
    <>
      <ShopFilterAndSort sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} />
      <ProductGridWrapper 
        sortCriteria={sortCriteria} 
        category={category} 
        page={currentPage} 
        searchQuery={searchQuery} // Pass searchQuery here
        limit={limit} // Pass limit here
      >
        <ProductGrid />
      </ProductGridWrapper>
      <ShowingPagination page={currentPage} category={category} setCurrentPage={setCurrentPage} />
    </>
  );
};

export default ShopPageContent;
