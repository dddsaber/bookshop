import { useState, useEffect } from "react";
import { getOrderStats } from "../../api/order.api";
import { Table, Typography } from "antd";
const { Text } = Typography;
import { STATUS_MAP } from "../../utils/constans";
const Stats = () => {
  const [stats, setStats] = useState([]);

  const fetchStats = async () => {
    const response = await getOrderStats();
    if (response.status) {
      setStats(response.data);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const columns = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Text style={{ color: STATUS_MAP[status]?.color || "gray" }}>
          {STATUS_MAP[status]?.label || "Không xác định"}
        </Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <div style={{ width: "60%", margin: "20px auto" }}>
      <h2 style={{ textAlign: "center" }}>Thống kê trạng thái đơn hàng</h2>
      <Table
        columns={columns}
        dataSource={stats.map((item, index) => ({
          ...item,
          key: index,
        }))}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default Stats;
