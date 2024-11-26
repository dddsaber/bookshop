import { Layout, Input, Flex, Button, Badge } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSourceUserImage } from "../../utils/image";
import { ProductContext } from "../../context/ProductContext";
import { useContext } from "react";

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const { name, phone, email, avatar } = user || {};
  const navigate = useNavigate();
  const { cart } = useContext(ProductContext);
  const cartItems = cart.items ?? [];
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
        <Search placeholder="Tìm kiếm sách..." style={{ width: 300 }} />

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
