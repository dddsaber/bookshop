import {
  Table,
  Checkbox,
  Button,
  InputNumber,
  Image,
  Layout,
  Row,
  Col,
  Card,
} from "antd";
import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../../context/ProductContext";
import { getSourceBookImage } from "../../utils/image";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeCart, updateCart, _id, fetchCartItems } =
    useContext(ProductContext);
  const cartItems = cart.items ?? [];
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  const handlePayment = () => {
    const selectedItems = cartItems.filter((item) =>
      checkedItems.includes(item._id)
    );
    const totalAmount = calculateSelectedTotal();

    navigate("/order", { state: { selectedItems, totalAmount } });
  };

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (id, value) => {
    if (value > 0) {
      updateCart(id, value); // Cập nhật số lượng trong giỏ hàng
    }
  };

  // Hàm tính tổng tiền của sản phẩm
  const calculateTotal = (item) => {
    return item.price * item.quantity * (1 - item.discount);
  };

  // Hàm xử lý chọn/bỏ chọn sản phẩm
  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Hàm xử lý chọn tất cả
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setCheckedItems(cartItems.map((item) => item._id));
    } else {
      setCheckedItems([]);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleRemove = (id) => {
    removeCart(id); // Gọi hàm xóa sản phẩm trong giỏ hàng
  };

  // Hàm tính tổng tiền cho các sản phẩm được chọn
  const calculateSelectedTotal = () => {
    return checkedItems.reduce((acc, id) => {
      const item = cartItems.find((item) => item._id === id);
      return acc + (item ? calculateTotal(item) : 0);
    }, 0);
  };

  useEffect(() => {
    fetchCartItems(_id);
  }, []);

  // Cấu hình các cột cho bảng giỏ hàng
  const columns = [
    {
      title: (
        <Checkbox
          onChange={handleSelectAll}
          checked={checkedItems.length === cartItems.length}
        />
      ),
      dataIndex: "checked",
      render: (checked, record) => (
        <Checkbox
          checked={checkedItems.includes(record._id)}
          onChange={() => handleCheck(record._id)}
        />
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div>
          <Image
            width={80}
            src={getSourceBookImage(record.image)}
            alt={record.name}
          />
        </div>
      ),
    },
    {
      title: "",
      render: (_, record) => (
        <div>
          <p>{record.title}</p>
          <span>{record.price}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 180,
      render: (price, record) => {
        // Kiểm tra xem có discount không
        const discountPrice = record.discount
          ? price - price * record.discount
          : null;

        return (
          <span>
            {discountPrice ? (
              <>
                <span
                  style={{ textDecoration: "line-through", marginRight: "8px" }}
                >
                  {price.toLocaleString()} đ
                </span>
                <span style={{ color: "red" }}>
                  {discountPrice.toLocaleString()} đ
                </span>
              </>
            ) : (
              <span>{price.toLocaleString()} đ</span>
            )}
          </span>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(record._id, value)}
        />
      ),
    },
    {
      title: "Thành tiền",
      render: (_, record) => (
        <span>{calculateTotal(record).toLocaleString()} đ</span>
      ),
    },
    {
      title: "",
      render: (_, record) => (
        <Button danger onClick={() => handleRemove(record._id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ padding: "20px", minHeight: "100vh" }}>
      <h2>Giỏ hàng của bạn</h2>
      <Row gutter={(12, 12)}>
        <Col span={16}>
          <Table
            style={{ marginTop: "20px" }}
            dataSource={cartItems}
            columns={columns}
            rowKey={(record) => {
              record._id;
            }}
            pagination={false}
          />
        </Col>
        <Col span={8}>
          <Card
            title={"Thanh toán"}
            style={{ marginTop: "20px", textAlign: "left" }}
          >
            <h3>Tổng tiền: {calculateSelectedTotal()}đ</h3>
            <Button type="primary" size="large" onClick={handlePayment}>
              Tiến hành thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default CartPage;
