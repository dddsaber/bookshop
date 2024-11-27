import {
  Layout,
  Input,
  Flex,
  Button,
  Badge,
  AutoComplete,
  Dropdown,
  Menu,
} from "antd";
import {
  BellFilled,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSourceUserImage } from "../../utils/image";
import { ProductContext } from "../../context/ProductContext";
import { useContext, useEffect, useState } from "react";
import { getOrdersByUserId, turnOffNotice } from "../../api/order.api";

const { Header: AntHeader } = Layout;

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const { name, phone, email, avatar } = user || {};
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const { cart, allProducts } = useContext(ProductContext);
  const cartItems = cart.items ?? [];
  const [orderDataList, setOrderDataList] = useState([]);

  const userId = useSelector((state) => state.auth?.user?._id);

  // Fetch orders based on userId
  const fetchData = async (userId) => {
    if (!userId) return;
    try {
      const response = await getOrdersByUserId(userId, { isNotice: true });
      if (Array.isArray(response?.data?.orders)) {
        setOrderDataList(response?.data?.orders);
      } else {
        console.error("Invalid data:", response?.data?.orders);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
  }, [userId]);

  const handleSearch = (value) => {
    const filteredOptions = allProducts
      .filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
      .map((item) => ({
        value: item.title,
        link: `/book/${item._id}`,
      }));
    setOptions(filteredOptions);
  };

  const handleSelect = (value) => {
    const selectedItem = options.find((option) => option.value === value);
    if (selectedItem?.link) {
      navigate(selectedItem.link);
    }
  };

  const handleNotificationClick = async (orderId) => {
    console.log(orderId);
    try {
      await turnOffNotice(orderId);
      setOrderDataList((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, notice: false } : order
        )
      );
    } catch (error) {
      console.error("Failed to turn off notice", error);
    }
  };

  const notificationMenu = (
    <Menu>
      {orderDataList.filter((order) => order.notice).length > 0 ? (
        orderDataList
          .filter((order) => order.notice)
          .map((order) => (
            <Menu.Item
              key={order._id}
              onClick={() => handleNotificationClick(order._id)}
            >
              <span>
                {order.notice}
                <br />
                Click to mark as read.
              </span>
            </Menu.Item>
          ))
      ) : (
        <Menu.Item disabled>No new notifications</Menu.Item>
      )}
    </Menu>
  );

  return (
    <AntHeader
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="logo" style={{ color: "#fff", fontSize: "24px" }}>
        My Bookstore
      </div>
      <Flex justify="space-between" align="center">
        <AutoComplete
          style={{ width: 200 }}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
          placeholder="Search for books"
        >
          <SearchOutlined />
          <Input />
        </AutoComplete>
        <Flex>
          <Button
            type="text"
            onClick={() => navigate("/cart")}
            style={{ color: "white", paddingLeft: 20 }}
          >
            <Badge
              count={
                <span style={{ fontSize: 15 }}>{cartItems?.length || 0}</span>
              }
              offset={[0, 5]}
              style={{
                color: "white",
                background: "red",
                borderRadius: "10px",
                width: "15px",
                height: "15px",
              }}
            >
              <ShoppingCartOutlined style={{ fontSize: 24, color: "white" }} />
            </Badge>
          </Button>
          <Dropdown overlay={notificationMenu} trigger={["click"]}>
            <Button
              type="text"
              style={{ color: "white", paddingLeft: 20, marginRight: 20 }}
              icon={
                <Badge
                  count={
                    <span style={{ fontSize: 15 }}>
                      {orderDataList.filter((order) => order.notice).length}
                    </span>
                  }
                  offset={[0, 5]}
                  style={{
                    color: "white",
                    background: "red",
                    borderRadius: "10px",
                    width: "15px",
                    height: "15px",
                  }}
                >
                  <BellFilled style={{ fontSize: 24, color: "white" }} />
                </Badge>
              }
            />
          </Dropdown>
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
                  src={getSourceUserImage(avatar)}
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
    </AntHeader>
  );
};

export default Header;
