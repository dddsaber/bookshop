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
import { getSourceBookImage } from "./utils/image";
import UsersPage from "./page/admin/users/UsersPage";
import { TYPE_USER } from "./utils/constans";
import BooksPage from "./page/admin/books/BooksPage";

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
function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutAuth());
    navigate("/login", { replace: true });
  }, []);

  return <Spin fullscree />;
}

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const name = useSelector((state) => state.auth?.user?.name);
  const userId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = window.location.pathname;
    if (!userId && token) {
      dispatch(reloginAuth({ token }));
    } else if (!token) {
      const allowedPaths = [
        "/login",
        "/register",
        "/forgot-password",
        "/change-password",
      ];

      // Thay đổi điều kiện kiểm tra để bao gồm đường dẫn có userId
      if (!allowedPaths.some((p) => path.startsWith(p))) {
        navigate("/login", { replace: true });
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
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/profile" element={<PrivateRoute element={<></>} />} />
          <Route
            path="/users"
            element={
              <PrivateRoute
                element={<UsersPage />}
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute
                element={<BooksPage />}
                requiredPermission={[TYPE_USER.admin]}
              />
            }
          />
          <Route
            path="/home"
            element={
              <div style={{ display: "flex", width: "200px" }}>
                <img
                  src={getSourceBookImage(
                    "cay_cam_ngot_cua_toi_1726226522403.jpg"
                  )}
                />
              </div>
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/change-password" element={<ResetPasswordPage />}>
          <Route path=":userId" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
