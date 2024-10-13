import {
  BellOutlined,
  BookOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Divider, Menu, Tag, Typography, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { TYPE_USER, TYPE_USER_STR, colorOfType } from "../../utils/constans";
import PropTypes from "prop-types";
import { useMemo } from "react";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, user, userType }) => {
  const navigate = useNavigate();

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
          key: "books",
          icon: <BookOutlined />,
          label: "Book",
          link: "/books",
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
    menuItems.push({
      key: "home",
      icon: <HomeOutlined />,
      label: "Home",
      link: "/home",
    });
    menuItems.push({
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      link: "/dashboard",
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
    <Sider
      trigger={null}
      collapsed={collapsed}
      collapsible
      theme="light"
      width={250}
      style={{
        minHeight: "100vh",
      }}
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
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            float: "left",
          }}
        />
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
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  userType: PropTypes.string,
  user: PropTypes.shape({
    _id: PropTypes.string,
    userType: PropTypes.string,
  }),
};

export default Sidebar;
