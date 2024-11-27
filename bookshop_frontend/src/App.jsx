import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Spin, notification } from "antd";
import { logoutAuth, reloginAuth } from "./redux/slices/authSlice";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";

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
import CouponPage from "./page/admin/coupons/ManageCouponsPage";

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
  element: PropTypes.element.isRequired,
  requiredPermission: PropTypes.arrayOf(PropTypes.string),
};

function LogoutPage({ userId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutAuth(userId));
    navigate("/login", { replace: true });
  }, [dispatch, navigate, userId]);

  return <Spin fullscreen />;
}

LogoutPage.propTypes = {
  userId: PropTypes.string,
};

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const name = useSelector((state) => state.auth?.user?.name);
  const userId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const path = window.location.pathname;

    if (!userId && refreshToken) {
      dispatch(reloginAuth({ refreshToken }));
    } else if (!token) {
      if (!refreshToken) {
        const allowedPaths = [
          "/login",
          "/register",
          "/forgot-password",
          "/change-password",
        ];
        if (!allowedPaths.some((p) => path.startsWith(p))) {
          navigate("/login", { replace: true });
        }
      } else {
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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Layout */}
        <Route path="/" element={<LayoutPage />}>
          <Route
            path="/"
            element={
              <motion.div {...pageTransition}>
                <HomePage />
              </motion.div>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                element={
                  <motion.div {...pageTransition}>
                    <ProfilePage />
                  </motion.div>
                }
              />
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute
                element={
                  <motion.div {...pageTransition}>
                    <ManageUsersPage />
                  </motion.div>
                }
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />
          <Route
            path="/coupons"
            element={
              <PrivateRoute
                element={
                  <motion.div {...pageTransition}>
                    <CouponPage />
                  </motion.div>
                }
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute
                element={
                  <motion.div {...pageTransition}>
                    <ManageBooksPage />
                  </motion.div>
                }
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute
                element={
                  <motion.div {...pageTransition}>
                    <ManageOrdersPage />
                  </motion.div>
                }
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />
          <Route
            path="/home"
            element={
              <motion.div {...pageTransition}>
                <HomePage />
              </motion.div>
            }
          />
          <Route
            path="/myorders"
            element={
              <motion.div {...pageTransition}>
                <MyOrdersPage />
              </motion.div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <motion.div {...pageTransition}>
                <DashboardPage />
              </motion.div>
            }
          />
          <Route
            path="/book/:bookId"
            element={
              <motion.div {...pageTransition}>
                <BookDetailPage />
              </motion.div>
            }
          />
          <Route
            path="/cart"
            element={
              <motion.div {...pageTransition}>
                <CartPage />
              </motion.div>
            }
          />
          <Route
            path="/order"
            element={
              <motion.div {...pageTransition}>
                <OrderPage />
              </motion.div>
            }
          />
          <Route
            path="/category/:categoryId"
            element={
              <motion.div {...pageTransition}>
                <ListBooksPage />
              </motion.div>
            }
          />
          <Route
            path="/dash"
            element={
              <motion.div {...pageTransition}>
                <Dashboard />
              </motion.div>
            }
          />
          <Route
            path="/products"
            element={
              <motion.div {...pageTransition}>
                <Products />
              </motion.div>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition}>
              <LoginPage />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div {...pageTransition}>
              <RegisterPage />
            </motion.div>
          }
        />
        <Route
          path="/logout"
          element={
            <motion.div {...pageTransition}>
              <LogoutPage userId={userId} />
            </motion.div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <motion.div {...pageTransition}>
              <ForgotPasswordPage />
            </motion.div>
          }
        />
        <Route
          path="/change-password/:userId"
          element={
            <motion.div {...pageTransition}>
              <ResetPasswordPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
