import {
  Table,
  Tag,
  Typography,
  Flex,
  Tooltip,
  Button,
  Input,
  Space,
  Modal,
  Descriptions,
  Select,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  cancelOrder,
  getOrders,
  updateOrderStatus,
} from "../../../api/order.api";
import {
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { STATUS_MAP, PAYMENT_METHOD_MAP } from "../../../utils/constans";
import dayjs from "dayjs";

const { Text } = Typography;

const ManageOrdersPage = () => {
  const [orderDataList, setOrderDataList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(true);
  const [filter, setFilter] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleResearch = async () => {};

  const handleEditOrder = async (record) => {
    setSelectedOrder(record);
    showModal(true);
  };
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

  const handleOk = async () => {
    try {
      let response;
      if (selectedOrder.status === "cancelled") {
        response = await cancelOrder(selectedOrder._id);
      } else {
        response = await updateOrderStatus(
          selectedOrder._id,
          selectedOrder.status
        );
      }

      if (response.status) {
        notification.success({
          message: "Order status updated successfully!",
        });

        setLoading(!reload);
      } else {
        notification.error({
          message: "Error updating order status",
        });
        console.log("Error updating order status");
      }
    } catch (error) {
      console.log(error);
    }
    fetchData();
    showModal(false);
  };

  const handleCancel = () => {
    showModal(false);
  };

  const showModal = (value) => {
    setIsVisible(value);
  };

  const fetchData = async () => {
    try {
      const response = await getOrders(filter);
      setOrderDataList(response?.data.orders);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [reload, filter]);

  const columns = [
    {
      title: "Order Id",
      dataIndex: "_id",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "userId",
      width: 100,
      render: (userId) => <Text strong>{userId.name}</Text>,
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
            <Button
              onClick={() => {
                clearFilters(); // Reset the filter
                setSelectedKeys([]); // Reset the selected keys
                confirm();
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  status: undefined, // Reset filter state
                }));
                setReload(!reload); // Trigger re-fetch of data after reset
              }}
            >
              Reset
            </Button>
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
            value={selectedKeys[0] || undefined} // Ensure undefined when no value is selected
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
                confirm(); // Apply the filter
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  paymentMethod: selectedKeys[0],
                }));
                setReload(!reload); // Trigger re-fetch of data after reset
              }}
            >
              Apply
            </Button>
            <Button
              onClick={() => {
                clearFilters(); // Reset the filter
                setSelectedKeys([]); // Reset the selected keys
                confirm();
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  paymentMethod: undefined, // Reset filter state
                }));
                setReload(!reload); // Trigger re-fetch of data after reset
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Shipping Fee",
      dataIndex: "shippingFee",
      render: (fee) => `${fee.toFixed(2)} đ`,
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
            icon={<EditOutlined />}
            onClick={() => handleEditOrder(record)}
          ></Button>
        </Space>
      ),
    },
  ];

  const itemColumns = [
    {
      title: "Mã sách",
      dataIndex: "bookId",
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
            <Button onClick={handleResearch}>
              <ReloadOutlined />
            </Button>
          </Tooltip>
          <Input
            value={keyword}
            placeholder="Search..."
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
        dataSource={filteredOrders}
        pagination={{ pageSize: 10, current: 1, total: totalOrders }}
        loading={loading}
        bordered
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <Table
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
        title="Thông tin đơn hàng"
        onText="Cập nhật"
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        cancelText="Cancel"
        style={{ top: 10, width: 700 }}
        width={700}
      >
        <Descriptions title="" column={2} style={{ marginBottom: "15px" }}>
          <Descriptions.Item label="Order Id">
            {selectedOrder?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            {selectedOrder?.userId?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {STATUS_MAP[selectedOrder?.status]?.label}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            {PAYMENT_METHOD_MAP[selectedOrder?.paymentMethod] ||
              "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            {selectedOrder?.totalAmount.toFixed(2)} đ
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {selectedOrder?.address
              ? `${selectedOrder.address.detail}, ${selectedOrder.address.ward}, ${selectedOrder.address.district}, ${selectedOrder.address.province}`
              : "Chưa có thông tin địa chỉ"}
          </Descriptions.Item>
          <Descriptions.Item label="Distance">
            {selectedOrder?.distance}
          </Descriptions.Item>
          <Descriptions.Item label="Shipping Fee">
            {selectedOrder?.shippingFee}
          </Descriptions.Item>
        </Descriptions>
        <label>
          <strong>Chi tiết đơn hàng</strong>
        </label>
        <Table
          style={{ margin: "0 0 15px 0" }}
          rowKey={(record) => record._id}
          columns={itemColumns}
          dataSource={selectedOrder?.orderDetails}
          scroll={{ x: "max-content", y: 435 }}
          pagination={false}
        />
        <Descriptions column={2} title="Theo dõi trạng thái">
          <Descriptions.Item label={STATUS_MAP["pending"].label}>
            {selectedOrder?.statusTimestamps?.pending
              ? dayjs(selectedOrder.statusTimestamps.pending).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label={STATUS_MAP["confirm"].label}>
            {selectedOrder?.statusTimestamps?.confirm
              ? dayjs(selectedOrder.statusTimestamps.confirm).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label={STATUS_MAP["shipped"].label}>
            {selectedOrder?.statusTimestamps?.shipped
              ? dayjs(selectedOrder.statusTimestamps.shipped).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label={STATUS_MAP["delivered"].label}>
            {selectedOrder?.statusTimestamps?.delivered
              ? dayjs(selectedOrder.statusTimestamps.delivered).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label={STATUS_MAP["complete"].label}>
            {selectedOrder?.statusTimestamps?.complete
              ? dayjs(selectedOrder.statusTimestamps.complete).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label={STATUS_MAP["cancelled"].label}>
            {selectedOrder?.statusTimestamps?.cancelled
              ? dayjs(selectedOrder.statusTimestamps.cancelled).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "Chưa cập nhật"}
          </Descriptions.Item>
        </Descriptions>
        <Flex justify="space-around" style={{ margin: "20px 0 0" }}>
          <Text>
            <strong>Cập nhật trạng thái:</strong>
          </Text>
          <Select
            style={{ width: 200 }}
            value={selectedOrder?.status}
            onChange={(value) => {
              setSelectedOrder((prevOrder) => ({
                ...prevOrder,
                status: value,
              }));
            }}
            placeholder="Chọn trạng thái"
            disabled={
              selectedOrder?.status === "cancelled" ||
              selectedOrder?.status === "complete"
            }
          >
            {Object.entries(STATUS_MAP).map(([key, { label, color }]) => (
              <Select.Option key={key} value={key}>
                <Text style={{ color: color }}>{label}</Text>
              </Select.Option>
            ))}
          </Select>
        </Flex>
      </Modal>
    </div>
  );
};

export default ManageOrdersPage;
