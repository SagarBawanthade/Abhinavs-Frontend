import { Link } from "react-router-dom";

const CategoryItem = ({ categoryTitle, image, link }: { categoryTitle: string; image: string; link: string; }) => {
  return (
    <div className="w-full max-w-[600px] relative max-[1250px]:w-[400px] max-[1250px]:h-[400px] max-sm:w-[300px] max-sm:h-[300px] rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
      <Link to={`/shop/${link}`}>
        {/* Image with hover effect */}
        <img 
          src={`/src/assets/${image}`} 
          alt={categoryTitle}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
        />
        
        {/* Title Overlay */}
        <div className="bg-secondaryBrown text-white absolute bottom-0 w-full h-16 flex justify-center items-center max-sm:h-12 opacity-90 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <h3 className="text-2xl max-sm:text-xl font-semibold">{categoryTitle}</h3>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
