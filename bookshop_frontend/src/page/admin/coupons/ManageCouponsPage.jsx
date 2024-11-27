import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  message,
  InputNumber,
  Input,
  Row,
  Col,
  Space,
  Popconfirm,
  Tag,
} from "antd";
import {
  createCoupon,
  deleteCoupon,
  getCouponsForManage,
} from "../../../api/coupon.api";
import { DeleteOutlined } from "@ant-design/icons";

const CouponPage = () => {
  const [form] = Form.useForm();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ isDeleted: null }); // Lưu trạng thái filter bảng

  // Fetch danh sách coupon khi trang load
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Lấy danh sách coupon từ API
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getCouponsForManage();
      const data = response.data || [];
      setCoupons(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      message.error("Không thể tải danh sách coupon!");
      setLoading(false);
    }
  };

  // Xử lý submit form để thêm coupon
  const handleAddCoupon = async (values) => {
    try {
      // Đảm bảo rằng expiryDate được truyền trong request
      const response = await createCoupon({
        ...values,
        expiryDate: values.expiryDate, // Thêm trường ngày hết hạn vào dữ liệu gửi lên
      });

      if (response.status) {
        message.success("Thêm coupon thành công!");
        form.resetFields(); // Reset form
        fetchCoupons(); // Refresh danh sách coupon
      } else {
        message.error(response.data?.message || "Lỗi khi thêm coupon!");
      }
    } catch (error) {
      console.log(error);
      message.error("Đã xảy ra lỗi khi thêm coupon!");
    }
  };

  // Xử lý xóa coupon
  const handleDeleteCoupon = async (record) => {
    try {
      const response = await deleteCoupon(record._id);
      if (response.status) {
        message.success("Xóa coupon thành công!");
        fetchCoupons();
      } else {
        message.error("Lỗi khi xóa coupon!");
      }
    } catch (error) {
      console.log(error);
      message.error("Đã xảy ra lỗi khi xóa coupon!");
    }
  };

  // Cột trong bảng
  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Phần trăm giảm giá",
      dataIndex: "percent",
      key: "percent",
      render: (value) => (value ? `${value}%` : "N/A"),
    },
    {
      title: "Giảm giá cố định",
      dataIndex: "flat",
      key: "flat",
      render: (value) => (value ? `${value} VND` : "N/A"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "Chưa có",
    },
    {
      width: 150,
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      filters: [
        {
          text: "Đang hoạt động",
          value: false,
        },
        {
          text: "Đã khóa",
          value: true,
        },
      ],
      filteredValue: filter.isDeleted ? [filter.isDeleted] : null, // Filter trực tiếp trên bảng
      onFilter: (value, record) => record.isDeleted === value,
      render: (_, { isDeleted }) => (
        <Tag color={!isDeleted ? "green" : "red"} key={isDeleted}>
          {!isDeleted ? "Đang hoạt động" : "Đã khóa"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      fixed: "right",
      align: "center",
      width: 150,
      ellipsis: true,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn xóa?"
            onConfirm={() => handleDeleteCoupon(record)}
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý Coupon</h2>

      {/* Form thêm mới coupon */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddCoupon}
        style={{ marginBottom: 30 }}
      >
        <Row justify={"space-between"}>
          <Col span={10}>
            <Form.Item
              label="Loại Coupon"
              name="type"
              rules={[
                { required: true, message: "Vui lòng chọn loại coupon!" },
              ]}
            >
              <Input placeholder="Nhập tên coupon" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Giảm giá (Phần trăm)"
              name="percent"
              rules={[
                {
                  required: true,
                  type: "number",
                  min: 0,
                  max: 100,
                  message: "Vui lòng nhập giá trị hợp lệ (0-100)",
                },
              ]}
            >
              <InputNumber placeholder="Nhập phần trăm giảm giá" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Giảm giá (Cố định)"
              name="flat"
              rules={[
                {
                  required: true,
                  type: "number",
                  min: 0,
                  message: "Vui lòng nhập giá trị hợp lệ!",
                },
              ]}
            >
              <InputNumber placeholder="Nhập số tiền giảm giá cố định" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Ngày hết hạn"
              name="expiryDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn!" },
              ]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">
          Thêm Coupon
        </Button>
      </Form>

      {/* Bảng danh sách coupon */}
      <Table
        dataSource={coupons}
        columns={columns}
        rowKey="_id" // Giả sử mỗi coupon có `_id` là unique
        loading={loading}
        onChange={(pagination, filters) => {
          // Lưu filter vào state khi thay đổi
          setFilter({
            isDeleted: filters.isDeleted?.[0] || null,
          });
        }}
      />
    </div>
  );
};

export default CouponPage;
