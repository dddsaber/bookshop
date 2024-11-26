import {
  Table,
  Tag,
  Typography,
  Flex,
  Tooltip,
  Button,
  Input,
  Space,
  Image,
  Modal,
  notification,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { STATUS_MAP, PAYMENT_METHOD_MAP } from "../../utils/constans";
import { useSelector } from "react-redux";
import {
  cancelOrder,
  getOrdersByUserId,
  updateOrderStatus,
} from "../../api/order.api";
import { getSourceBookImage } from "../../utils/image";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

const MyOrdersPage = () => {
  const [orderDataList, setOrderDataList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // Add filtered orders state
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const [filter, setFilter] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const userId = useSelector((state) => state.auth?.user?._id); // Lấy userId từ Redux store

  // Fetch orders based on userId and filter
  const fetchData = async (userId) => {
    if (!userId) {
      console.log("Không có userId, không thể tải đơn hàng");
      return; // Dừng việc tải dữ liệu nếu không có userId
    }
    setLoading(true);
    try {
      const response = await getOrdersByUserId(userId, filter);
      if (Array.isArray(response?.data?.orders)) {
        setOrderDataList(response?.data?.orders);
        setTotalOrders(response?.data?.total); // Cập nhật tổng số đơn hàng
      } else {
        console.error("Dữ liệu không hợp lệ:", response?.data?.orders);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Lỗi khi tải đơn hàng:", error);
    }
  };

  // Effect hook to trigger data fetch
  useEffect(() => {
    if (userId) {
      fetchData(userId); // Gọi fetchData khi có userId
    }
  }, [userId, filter, reload]); // Cập nhật khi userId, filter hoặc reload thay đổi

  // Handle search/filtering based on the keyword
  useEffect(() => {
    if (keyword) {
      const filtered = orderDataList.filter((order) =>
        order.orderDetails.some((item) =>
          item.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      setFilteredOrders(filtered);
      setTotalOrders(filtered.length);
    } else {
      setFilteredOrders(orderDataList);
      setTotalOrders(orderDataList.length);
    }
  }, [keyword, orderDataList]);

  const columns = [
    {
      title: "Order Id",
      dataIndex: "_id",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "userId",
      render: (userId) => <Text strong>{userId?.name || "Unknown"}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const statusInfo = STATUS_MAP[status] || {
          label: "Không xác định",
          color: "default",
        };
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 150 }}
            placeholder="Select status"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
          >
            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            ))}
          </Select>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  status: selectedKeys[0],
                }));
              }}
            >
              Apply
            </Button>
            <Button onClick={() => clearFilters()}>Reset</Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      render: (paymentMethod) => {
        const paymentLabel =
          PAYMENT_METHOD_MAP[paymentMethod] || "Không xác định";
        return <Text>{paymentLabel}</Text>;
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 150 }}
            placeholder="Select payment method"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
          >
            {Object.entries(PAYMENT_METHOD_MAP).map(([key, label]) => (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            ))}
          </Select>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  paymentMethod: selectedKeys[0],
                }));
              }}
            >
              Apply
            </Button>
            <Button onClick={() => clearFilters()}>Reset</Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      render: (total) => `${total.toFixed(2)} đ`,
    },
    {
      title: "",
      fixed: "right",
      align: "center",
      width: 50,
      ellipsis: true,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<CheckCircleOutlined />}
            onClick={() => handleEditOrder(record)}
            disabled={record.status !== "delivered"}
            style={{
              backgroundColor:
                record.status !== "delivered" ? "gray" : "#52c41a",
              color: "#fff",
            }}
          >
            Đã nhận
          </Button>
          <Button
            disabled={
              record.status !== "pending" && record.status !== "confirm"
            }
            style={{
              backgroundColor:
                record.status !== "pending" && record.status !== "confirm"
                  ? "gray"
                  : "#f5222d",
              color: "#fff",
            }}
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsVisible(true);
              setSelectedOrder(record);
            }}
          >
            Hủy đơn
          </Button>
        </Space>
      ),
    },
  ];

  const handleEditOrder = async (record) => {
    try {
      record.status = "complete";
      const resposne = await updateOrderStatus(record._id, record.status);
      if (resposne.status) {
        notification.success({
          message: "Đã nhận đơn hàng thành công!",
        });
      } else {
        notification.error({
          message: "Error updating order.",
        });
      }
      setReload(!reload);
    } catch (error) {
      notification.error({
        message: `Error updating order: ${error.message}`,
      });
    }
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      console.log(selectedOrder);
      const response = await cancelOrder(selectedOrder._id, {
        cancelNote: cancelReason,
      });
      if (response.status) {
        notification.success({
          message: "Hủy đơn hàng thành công!",
        });
        setReload(true);
        setIsVisible(false);
      } else {
        notification.error({
          message: "Hủy đơn hàng thất bại!",
        });
      }
      setLoading(false);
      setReload(!reload);
    } catch (error) {
      setLoading(false);
      console.log("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const itemColumns = [
    {
      title: "Ảnh",
      dataIndex: "bookId",
      key: "bookId",
      width: 100,
      align: "center",
      render: (bookId) => <Image src={getSourceBookImage(bookId.coverPhoto)} />,
    },
    {
      title: "Name",
      dataIndex: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `${price.toFixed(2)} đ`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 100,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (total) => `${total.toFixed(2)} đ`,
    },
    {
      title: "Disc",
      dataIndex: "discount",
      render: (discount) => `${discount * 100}%`,
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (text, record) => {
        // Tính total dựa trên price, quantity và discount
        const total = record.price * record.quantity * (1 - record.discount);
        return `${total.toFixed(2)} đ`;
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Flex gap={10} justify="space-between" style={{ marginBottom: 10 }}>
        <Flex>
          <Tooltip title="Refesh">
            <Button onClick={() => setReload(!reload)}>
              <ReloadOutlined />
            </Button>
          </Tooltip>
          <Input
            value={keyword}
            placeholder="Search by book title..."
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => setReload(!reload)}
          />
          <Button type="primary" onClick={() => setReload(!reload)}>
            <SearchOutlined />
          </Button>
        </Flex>
      </Flex>
      <Table
        scroll={{ x: "max-content" }}
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={filteredOrders} // Use filtered orders here
        pagination={{
          pageSize: 10,
          current: 1,
          total: totalOrders, // Cập nhật tổng số đơn hàng
        }}
        loading={loading}
        bordered
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <Table
                loading={loading}
                rowKey={(record) => record._id}
                columns={itemColumns}
                dataSource={record.orderDetails}
                size="small"
                pagination={false}
                style={{ width: "98%", marginLeft: "1%" }} // Đảm bảo chiều rộng bảng con như bảng chính
              />
            </div>
          ),
        }}
      />
      <Modal
        open={isVisible}
        title="Cancel Order"
        onOk={handleCancelOrder}
        cancelText="Cancel"
        destroyOnClose
        style={{ top: 10, width: 700 }}
        width={700}
      >
        <TextArea
          placeholder="Nhập lý do hủy đơn hàng"
          onChange={(e) => setCancelReason(e.target.value)}
        ></TextArea>
      </Modal>
    </div>
  );
};

export default MyOrdersPage;
