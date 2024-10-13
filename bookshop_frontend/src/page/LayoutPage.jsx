import {
  // Link,
  Outlet,
} from "react-router-dom";
import { theme, Layout } from "antd";
const { Content } = Layout;
import Header from "../components/Layout/Header";
import { useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";
import { TYPE_USER } from "../utils/constans";

const LayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.auth.user); // Lấy user từ Redux store
  const { userType } = user || {};
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh", padding: "0px" }}>
      <div
        style={{
          width: collapsed ? 80 : 250, // Điều chỉnh chiều rộng khi collapsed
          position: "fixed", // Cố định sidebar
          height: "100vh", // Chiếm toàn bộ chiều cao màn hình
          zIndex: 1000, // Đảm bảo nằm trên các thành phần khác
          background: colorBgContainer, // Màu nền tùy chỉnh
        }}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          userType={userType}
          user={user}
        />
      </div>
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header />
        <Content
          style={{
            padding: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
        {userType !== TYPE_USER.admin ? <Footer /> : ""}
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
