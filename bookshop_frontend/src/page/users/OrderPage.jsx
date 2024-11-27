import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Layout,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { getSourceBookImage } from "../../utils/image";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createOrder } from "../../api/order.api";
import {
  calculateDistance,
  calculateShippingFee,
} from "../../api/vnaddress.api";
import "./OrderPage.css";
import { getCoupons } from "../../api/coupon.api";

const OrderPage = () => {
  const onFinish = () => {};
  const location = useLocation();
  const { selectedItems, totalAmount } = location.state || {};
  const userId = useSelector((state) => state.auth?.user?._id);
  const user = useSelector((state) => state.auth?.user);
  const [isVisible, setIsVisible] = useState(false);
  const [orderRecord, setOrderRecord] = useState({}); // Khởi tạo với object rỗng
  const [distance, setDistance] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [coupons, setCoupons] = useState([]); // Lưu danh sách coupon
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Lưu coupon được chọn

  const navigate = useNavigate();

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
      couponId: selectedCoupon._id,
      distance: distance,
      address: user.address || "",
      shippingFee: shippingFee || 0,
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

  useEffect(() => {
    const location2 = user?.address
      ? `${user.address.ward ? user.address.ward + ", " : ""} 
         ${user.address.district ? user.address.district + ", " : ""}
         ${user.address.province ? user.address.province : ""}`
      : "";

    // Đảm bảo tính toán async với await
    const calculate = async () => {
      try {
        const value = await calculateDistance(location2); // await nếu calculateDistance là async
        setDistance(value);
        setShippingFee(calculateShippingFee(value)); // Sử dụng ngay sau khi có giá trị distance
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    };

    calculate(); // Gọi hàm tính toán
  }, [user?.address]); // useEffect chỉ chạy khi user.address thay đổi

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getCoupons(); // Hàm API gọi đến backend
        setCoupons(response.data || []); // Lưu danh sách coupon vào state
      } catch (error) {
        console.error("Không thể tải danh sách coupon:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách coupon.",
          duration: 2,
        });
      }
    };

    fetchCoupons(); // Gọi hàm khi component được render
  }, []);
  const calculateTotalWithDiscount = () => {
    if (!selectedCoupon) return totalAmount + shippingFee;

    if (selectedCoupon.percent) {
      return (
        totalAmount - (totalAmount * selectedCoupon.percent) / 100 + shippingFee
      );
    } else if (selectedCoupon.flat) {
      return totalAmount - selectedCoupon.flat >= 0
        ? totalAmount - selectedCoupon.flat + shippingFee
        : shippingFee;
    }

    return totalAmount + shippingFee;
  };

  const totalWithDiscount = calculateTotalWithDiscount();

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
          <Card title={"Địa chỉ giao hàng"}>
            {user?.address ? (
              <div>
                <p>
                  {user.address.detail ? user.address.detail + ", " : ""}
                  {user.address.ward ? user.address.ward + ", " : ""}
                  {user.address.district ? user.address.district + ", " : ""}
                  {user.address.province ? user.address.province : ""}
                </p>
                <Link href="/profile" style={{ color: "#1890ff" }}>
                  Thay địa chỉ
                </Link>
              </div>
            ) : (
              <div>
                <p>Địa chỉ không có sẵn</p>
                <Link href="/profile" style={{ color: "#1890ff" }}>
                  Thêm địa chỉ
                </Link>
              </div>
            )}
          </Card>
          <Card title={"Phương thức thanh toán"} style={{ marginTop: 10 }}>
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
          <Card title={"Thông tin vận chuyển"} style={{ marginTop: "20px" }}>
            <p>Khoảng cách : {distance} km</p>
            <p>Phí vận chuyển : {shippingFee} đ</p>
          </Card>
          <Card title={"Ưu đãi"} style={{ marginTop: "20px" }}>
            {coupons.length > 0 ? (
              <Radio.Group
                onChange={(e) => {
                  const selectedCouponId = e.target.value;
                  const coupon = coupons.find(
                    (c) => c._id === selectedCouponId
                  );
                  setSelectedCoupon(coupon); // Lưu coupon đã chọn
                }}
              >
                {coupons.map((coupon) => (
                  <Radio key={coupon._id} value={coupon._id}>
                    {`${coupon.type} - ${
                      coupon.percent
                        ? `${coupon.percent}%`
                        : coupon.flat
                        ? `${coupon.flat} VND`
                        : ""
                    }`}
                  </Radio>
                ))}
              </Radio.Group>
            ) : (
              <p>Không có ưu đãi khả dụng.</p>
            )}
          </Card>

          <Card
            title={"Thanh toán"}
            style={{ marginTop: "20px", textAlign: "left" }}
          >
            <p>
              Tổng tiền sau giảm giá:{" "}
              <strong>{totalWithDiscount.toLocaleString()} đ</strong>
            </p>
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
            style={{ textAlign: "center", fontSize: "24px", marginTop: "30px" }}
          >
            Bạn đã đặt hàng thành công
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default OrderPage;
