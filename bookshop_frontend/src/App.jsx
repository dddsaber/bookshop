import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Spin, notification } from "antd";
import { logoutAuth, reloginAuth } from "./redux/slices/authSlice";
import PropTypes from "prop-types";
import LayoutPage from "./page/LayoutPage";
import LoginPage from "./page/auth/LoginPage";
import ForgotPasswordPage from "./page/auth/ForgotPasswordPage";
import ResetPasswordPage from "./page/auth/ResetPasswordPage";
import RegisterPage from "./page/auth/RegisterPage";
import ManageUsersPage from "./page/admin/users/ManageUsersPage";
import { TYPE_USER } from "./utils/constans";
import ManageBooksPage from "./page/admin/books/ManageBooksPage";
import DashboardPage from "./page/users/DashboardPage";
import HomePage from "./page/users/HomePage";
import BookDetailPage from "./page/users/BookDetailPage";
import CartPage from "./page/users/CartPage";
import ListBooksPage from "./page/users/ListBooksPage";
import OrderPage from "./page/users/OrderPage";
import ManageOrdersPage from "./page/admin/orders/ManageOrdersPage";
import ProfilePage from "./page/users/ProfilePage";
import Dashboard from "./page/admin/analysis/DashBoard";
import Products from "./page/admin/analysis/Products";
import MyOrdersPage from "./page/users/MyOrders";

// Private Route for confirm admin
const PrivateRoute = ({ element, requiredPermission = [] }) => {
  const userType = useSelector((state) => state.auth?.user?.userType);
  const loading = useSelector((state) => state.auth?.loading);
  const hasPermission =
    requiredPermission.length === 0 || requiredPermission.includes(userType);

  return hasPermission || loading ? (
    element
  ) : (
    <Navigate
      to="/unauthorized"
      replace
      state={{ from: window.location.pathname }}
    />
  );
};
PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired, // Kiểm tra rằng element là React element
  requiredPermission: PropTypes.arrayOf(PropTypes.string), // Kiểm tra mảng các quyền là mảng chuỗi
};
function LogoutPage({ userId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutAuth(userId));
    navigate("/login", { replace: true });
  }, []);

  return <Spin fullscreen />;
}

LogoutPage.propTypes = {
  userId: PropTypes.string,
};
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const name = useSelector((state) => state.auth?.user?.name);
  const userId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const token = localStorage.getItem("token"); // accessToken
    const refreshToken = localStorage.getItem("refreshToken"); // refreshToken
    const path = window.location.pathname;

    // Nếu không có userId và có accessToken, đăng nhập lại
    if (!userId && refreshToken) {
      dispatch(reloginAuth({ refreshToken }));
    }
    // Nếu không có accessToken
    else if (!token) {
      // Nếu không có refreshToken, chuyển hướng đến trang login
      if (!refreshToken) {
        const allowedPaths = [
          "/login",
          "/register",
          "/forgot-password",
          "/change-password",
        ];

        // Chỉ cho phép truy cập vào các đường dẫn này
        if (!allowedPaths.some((p) => path.startsWith(p))) {
          navigate("/login", { replace: true });
        }
      } else {
        // Nếu có refreshToken, thử sử dụng nó để lấy accessToken
        dispatch(reloginAuth({ refreshToken }));
      }
    }
  }, [dispatch, navigate, userId]);

  useEffect(() => {
    const path = window.location.pathname;
    if (userId && !name && path !== "/profile") {
      navigate("/profile");
      notification.warning({
        message: "Notification",
        description: "Please update your profile to see your name",
      });
    }
  }, [userId, name, navigate]);

  return (
    <>
      <Routes>
        {/* Layout  */}
        <Route path="/" element={<LayoutPage />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={<PrivateRoute element={<ProfilePage />} />}
          />
          <Route
            path="/users"
            element={
              <PrivateRoute
                element={<ManageUsersPage />}
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute
                element={<ManageBooksPage />}
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute
                element={<ManageOrdersPage />}
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />

          <Route path="/home" element={<HomePage />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/book" element={<BookDetailPage />}>
            <Route path=":bookId" element={<BookDetailPage />} />
          </Route>
          <Route path="/order" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category" element={<ListBooksPage />}>
            <Route path=":categoryId" element={<ListBooksPage />} />
          </Route>
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage userId={userId} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/change-password" element={<ResetPasswordPage />}>
          <Route path=":userId" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
