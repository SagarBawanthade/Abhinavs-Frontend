import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { initializeLoginStatus } from "./features/auth/authSlice"; // Import action to initialize login status

import {
  Cart,
  Checkout,
  HomeLayout,
  Landing,
  Login,
  OrderConfirmation,
  OrderHistory,
  Register,
  Search,
  Shop,
  
  SingleProduct,
  UserProfile,
  AdminDashboard,
  AdminLayout,
  ManageProducts,
  ManageUsers,
  ManageOrders,
  ResetPassword,
  OrderFailed,
  Contact,
} from "./pages";

import { checkoutAction, searchAction } from "./actions/index";
import { shopCategoryLoader } from "./pages/Shop";
import { loader as orderHistoryLoader } from "./pages/OrderHistory";
//import { loader as singleOrderLoader } from "./pages/SingleOrderHistory";
import AdminRoute from "./components/admin/AdminRoute";
import AddProduct from "./components/admin/AddProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderDetails  from "./components/admin/OrderDetails";

function App() {
  const dispatch = useDispatch();
  const { loginStatus } = useSelector((state: any) => state.auth); // Get login status from Redux store

  useEffect(() => {
    // Dispatch initializeLoginStatus to populate user state
    dispatch(initializeLoginStatus());
  }, [dispatch]);

  // Wait until the loginStatus is initialized before rendering routes
  if (loginStatus === undefined) {
    return <div>Loading...</div>; // Show a loading state while the login status is being initialized
  }

  return <RouterProvider router={router} />;
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "shop/:category",
        element: <Shop />,
        loader: shopCategoryLoader,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
        action: checkoutAction,
      },
      {
        path: "search",
        action: searchAction,
        element: <Search />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },
      {
        path: "order-history",
        element: <OrderHistory />,
        loader: orderHistoryLoader,
      },
      {
        path: "order-failed",
        element: <OrderFailed />,
        loader: orderHistoryLoader,
      },
     
      {
        path: "reset-password",
        element: <ResetPassword />,
        
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />, // Protect admin routes with AdminRoute
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "products",
            element: <ManageProducts />,
          },
          {
            path: "users",
            element: <ManageUsers />,
          },
          {
            path: "orders",
            element: <ManageOrders />,
          },
          {
            path: "add-product",
            element: <AddProduct/>
          },
          {
            path: "update-product/:productId",
            element: <UpdateProduct/>
          },
          {
            path: "orders/order-details/:orderId",
            element: <OrderDetails/>
          }
        ],
      },
    ],
  },
]);



export default App;
