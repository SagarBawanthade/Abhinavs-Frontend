import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { ShopBanner, ShopPageContent, ProductGridWrapper } from "../components";

export const shopCategoryLoader = async ({ params }: LoaderFunctionArgs) => {
  const { category } = params;

  return category;
};

const Shop = () => {
  const category = useLoaderData() as string;
  const [searchParams] = useSearchParams();

  // Assuming these values are available
  const currentPage = parseInt(searchParams.get("page") || "1");
  const sortCriteria = searchParams.get("sort") || "price"; // Default value or fetch from query
  const limit = 12; // You can set this value dynamically based on your pagination logic

  return (
    <div className="max-w-screen-2xl mx-auto pt-10">
      <ShopBanner category={category} />
      <ShopPageContent
        category={category}
        page={currentPage}
      />

      {/* Pass ProductGrid as children */}
      <ProductGridWrapper 
        searchQuery={searchParams.get("query")!} 
        page={currentPage}
        sortCriteria={sortCriteria} 
        category={category}
        limit={limit}
      >
       H {/* This is the child component */}
      </ProductGridWrapper>
    </div>
  );
};

export default Shop;
