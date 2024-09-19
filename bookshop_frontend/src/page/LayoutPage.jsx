import {
  // Link,
  useNavigate,
  Outlet,
} from "react-router-dom";
import {
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  UserOutlined,

  // CalendarOutlined,
  // ClockCircleOutlined,
  // FileOutlined,
  // GroupOutlined,
  // MedicineBoxOutlined,
  // ShoppingOutlined,
  // UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Tag,
  Typography,
  theme,
  Button,
  Flex,
  Layout,
  Menu,
  Divider,
  // Avatar,
  // Card,
  // List,
  // Popover,
  // Space,
} from "antd";
const { Header, Sider, Content } = Layout;
import { useMemo, useState } from "react";
import {
  TYPE_USER,
  TYPE_USER_STR,
  colorOfType,
  getSourceImage,
} from "../utils/constans";
import { useSelector } from "react-redux";

// const items = [
//   {
//     key: "1",
//     label: (
//       <Link to={"/profile"}>
//         <UserOutlined /> Profile
//       </Link>
//     ),
//   },
//   {
//     key: "2",
//     label: (
//       <Link to={"/logout"}>
//         <LogoutOutlined />
//         Logout
//       </Link>
//     ),
//   },
// ];

const LayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { phone, email, userType, name, avatar } = user || {};

  const menuSidebars = useMemo(() => {
    const menuItems = [];
    switch (userType) {
      case TYPE_USER.admin: {
        menuItems.push({
          key: "users",
          icon: <UsergroupAddOutlined />,
          label: "Users",
          link: "/users",
        });
        menuItems.push({
          key: "chat",
          icon: <MessageOutlined />,
          label: "Chat",
          link: "/chat",
        });
        break;
      }
      case TYPE_USER.user: {
        menuItems.push({
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          link: "/dashboard",
        });
        menuItems.push({
          key: "orders",
          icon: <ShoppingCartOutlined />,
          label: "Orders",
          link: "/orders",
        });
        menuItems.push({
          key: "notifications",
          icon: <BellOutlined />,
          label: "Notifications",
          link: "/notifications",
        });
        break;
      }
      default: {
        break;
      }
    }
    menuItems.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      link: "/logout",
    });
    return menuItems;
  }, [userType]);

  const selectedMenu = () => {
    const menu = menuSidebars.find((menu) =>
      window.location.pathname.includes(menu.link)
    );

    if (menu) {
      return [menu.key];
    }
    return [];
  };

  const onClickMenu = ({ item }) => {
    const { link } = item.props;

    if (link) {
      navigate(link);
    }
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsed={collapsed}
        collapsible
        theme="light"
        width={250}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography.Title
            level={5}
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Book Shop
          </Typography.Title>
          {collapsed ? null : (
            <Tag color={colorOfType[user?.userType]}>
              <Typography.Text>{TYPE_USER_STR[user?.userType]}</Typography.Text>
            </Tag>
          )}
        </div>
        <Divider />
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedMenu()}
          items={menuSidebars}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Flex justify="space-between" align="center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <Flex style={{ marginRight: 20 }} align="center" gap={20}>
              {/* <Popover
                content={contentNoti}
                title="Thông báo"
                placement="bottomRight"
                trigger="click"
              >
                <Button type="text" icon={<BellOutlined size={2} />} />
              </Popover> */}
              <Button
                type="text"
                style={{ paddingLeft: 30 }}
                onClick={() => navigate("/profile")}
                icon={
                  avatar ? (
                    <img
                      style={{
                        borderRadius: "50%",
                        position: "absolute",
                        left: 5,
                        top: 3,
                        height: 25,
                        width: 25,
                        objectFit: "cover",
                      }}
                      src={getSourceImage(avatar)}
                    />
                  ) : (
                    <UserOutlined />
                  )
                }
              >
                {name || phone || email}
              </Button>
            </Flex>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
