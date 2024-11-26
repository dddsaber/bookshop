import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Layout,
  Modal,
  notification,
  Row,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { getSourceBookImage } from "../../utils/image";
import { useLocation, useNavigate } from "react-router-dom";
import AddressComponent from "../../components/Map/Address";
import { useSelector } from "react-redux";
import { createOrder } from "../../api/order.api";
import "./OrderPage.css";
const OrderPage = () => {
  const onFinish = () => {};
  const location = useLocation();
  const { selectedItems, totalAmount } = location.state || {};
  const userId = useSelector((state) => state.auth?.user?._id);
  const [isVisible, setIsVisible] = useState(false);
  const [orderRecord, setOrderRecord] = useState({}); // Khởi tạo với object rỗng
  const navigate = useNavigate();

  const handleAddressData = (data) => {
    setOrderRecord((prev) => ({
      ...prev,
      address: data || "Địa chỉ mặc định", // Đảm bảo có giá trị hợp lệ
    }));
  };
  const handleNav = async () => {
    setIsVisible(false);
    navigate("/myorders", { replace: true });
  };

  const handleOk = async () => {
    const updatedOrderDetails = selectedItems.map((item) => ({
      bookId: item._id, // Dùng _id làm bookId
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
    }));

    const orderData = {
      ...orderRecord,
      orderDetails: updatedOrderDetails,
      userId: userId || "",
      status: "pending",
    };

    const response = await createOrder(orderData);
    if (response.status) {
      notification.success({
        message: "Đơn hàng đã được tạo",
        duration: 2,
      });
      setIsVisible(true);
    } else {
      console.error("Đơn hàng không thể tạo");
    }
  };

  useEffect(() => {}, [orderRecord]); // useEffect chỉ chạy khi orderRecord thay đổi
  const columns = [
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
      render: (price) => (
        <span>{price ? price.toLocaleString() : "N/A"} đ</span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Thành tiền",
      render: (_, record) => (
        <span>{record ? record.price * record.quantity : 0} đ</span>
      ),
    },
  ];

  return (
    <Layout style={{ padding: "20px", minHeight: "100vh" }}>
      <h2>Thanh toan</h2>
      <Row gutter={(12, 12)}>
        <Col span={16}>
          <Table
            style={{ marginTop: "20px" }}
            dataSource={selectedItems}
            columns={columns}
            rowKey={(record) => record._id || record.key}
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={4} align="right">
                  <strong>Total Price:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <span>{totalAmount.toLocaleString()} đ</span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
          <Card title={"Dia chi giao hang"}>
            <AddressComponent sendData={handleAddressData} />
          </Card>
          <Card title={"Phuong thuc thanh toan"} style={{ marginTop: 10 }}>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="paymentMethod"
                rules={[
                  { required: true, message: "Please select a payment method" },
                ]}
              >
                <Select
                  placeholder="Select a payment method"
                  onChange={(value) =>
                    setOrderRecord((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                >
                  <Select.Option value="credit_card">Credit Card</Select.Option>
                  <Select.Option value="paypal">PayPal</Select.Option>
                  <Select.Option value="cod">Cash on Delivery</Select.Option>
                  <Select.Option value="bank_transfer">
                    Bank Transfer
                  </Select.Option>
                  <Select.Option value="cash">Cash</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={"Thanh toan"}
            style={{ marginTop: "20px", textAlign: "left" }}
          >
            <Button type="primary" size="large" onClick={handleOk}>
              Thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
      <Modal
        open={isVisible}
        title="Đặt hàng thành công"
        onOk={handleNav}
        onCancel={handleNav}
        destroyOnClose
        style={{ top: 20, width: 400, height: 500, position: "relative" }}
        width={400}
        height={500}
        footer={null}
      >
        <div className="frame">
          <input
            type="checkbox"
            id="button"
            checked={true}
            className="hidden"
          />
          <label className="button">
            Finish
            <img src="https://100dayscss.com/codepen/checkmark-green.svg" />
          </label>
          <svg className="circle">
            <circle cx="30" cy="30" r="29" />
          </svg>
          <p
            style={{
              textAlign: "center",
              fontSize: " 24px",
              marginTop: "30px",
            }}
          >
            Bạn đã đặt hàng thành công
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default OrderPage;
