import {
  BellOutlined,
  BookOutlined,
  CarOutlined,
  DashboardOutlined,
  DashOutlined,
  FolderOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  ProductOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Menu,
  Tag,
  Typography,
  Layout,
  Spin,
  Flex,
} from "antd"; // Thêm Spin
import { useNavigate } from "react-router-dom";
import { TYPE_USER, TYPE_USER_STR, colorOfType } from "../../utils/constans";
import PropTypes from "prop-types";
import { useContext, useMemo } from "react";
import { CategoryContext } from "../../context/CategoryContext";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, user, userType }) => {
  const navigate = useNavigate();
  const { categoriesLv1, categoriesLv2, categoriesLv3, loading } =
    useContext(CategoryContext);

  const menuSidebars = useMemo(() => {
    if (loading) {
      return []; // Trả về mảng rỗng khi đang loading
    }

    const menuItems = [];

    // Thêm mục "The loai" vào menu
    menuItems.push({
      key: "category",
      icon: <FolderOutlined />,
      label: "The loai",
      link: "#",
      children: categoriesLv1.map((category) => {
        // Xây dựng children cho từng category
        const subCategories = categoriesLv2
          .filter((subCategory) => subCategory.parentId === category._id)
          .map((subCategory) => {
            // Xây dựng children cho từng subCategory
            const subSubCategories = categoriesLv3
              .filter(
                (subSubCategory) => subSubCategory.parentId === subCategory._id
              )
              .map((subSubCategory) => {
                return {
                  key: subSubCategory._id,
                  icon: <FolderOutlined />,
                  label: subSubCategory.name,
                  link: `/category/${subSubCategory._id}`,
                };
              });

            return {
              key: subCategory._id,
              icon: <FolderOutlined />,
              label: subCategory.name,
              link: `/category/${subCategory._id}`,
              children: subSubCategories, // Gán children vào subCategory
            };
          });

        return {
          key: category._id,
          icon: <FolderOutlined />,
          label: category.name,
          link: `/category/${category._id}`,
          children: subCategories, // Gán children vào category
        };
      }),
    });

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
          key: "orders",
          icon: <ShoppingCartOutlined />,
          label: "Orders",
          link: "/orders",
        });

        menuItems.push({
          key: "dash",
          icon: <DashOutlined />,
          label: "Dashboard",
          link: "/dash",
        });
        menuItems.push({
          key: "products",
          icon: <ProductOutlined />,
          label: "Products",
          link: "/products",
        });
        menuItems.push({
          key: "myorders",
          icon: <OrderedListOutlined />,
          label: "My Orders",
          link: "/myorders",
        });
        break;
      }
      case TYPE_USER.user: {
        menuItems.push({
          key: "myorders",
          icon: <ShoppingCartOutlined />,
          label: "Orders",
          link: "/myorders",
        });
        menuItems.push({
          key: "notifications",
          icon: <BellOutlined />,
          label: "Notifications",
          link: "/notifications",
        });
        menuItems.push({
          key: "myorders",
          icon: <OrderedListOutlined />,
          label: "My Orders",
          link: "/myorders",
        });
        break;
      }
      default: {
        break;
      }
    }

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
    menuItems.push({
      key: "profile",
      icon: <ProfileOutlined />,
      label: user?.name,
      link: `/profile`,
    });
    menuItems.push({
      key: "cart",
      icon: <CarOutlined />,
      label: "Cart",
      link: "/cart",
    });
    menuItems.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      link: "/logout",
    });

    return menuItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, loading]); // Thêm loading vào dependency

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
      theme="dark"
      width={300}
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
            color: "white",
          }}
        />
        {collapsed ? null : (
          <Tag color={colorOfType[user?.userType]}>
            <Typography.Text>{TYPE_USER_STR[user?.userType]}</Typography.Text>
          </Tag>
        )}
      </div>
      <Divider />
      <Flex
        style={{ maxHeight: "80vh", overflowY: "auto", overflowX: "hidden" }}
      >
        {loading ? ( // Hiển thị loading nếu đang fetch
          <Spin style={{ margin: "auto" }} />
        ) : (
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedMenu()}
            items={menuSidebars}
            onClick={onClickMenu}
          />
        )}
      </Flex>
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
    name: PropTypes.string,
  }),
};

export default Sidebar;
