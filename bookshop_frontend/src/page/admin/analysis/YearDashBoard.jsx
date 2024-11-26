import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Select } from "antd"; // Import Select từ Ant Design
import { getRevenueByYear } from "../../../api/order.api";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;

const YearDashBoard = () => {
  const [chartData, setChartData] = useState(null);
  const [years, setYears] = useState(5); // Giá trị mặc định là 5 năm

  const fetchRevenueData = async (selectedYears) => {
    try {
      // Gửi yêu cầu đến API để lấy dữ liệu
      const response = await getRevenueByYear({ years: selectedYears });
      const revenueData = response.data;

      // Chuyển đổi dữ liệu để phù hợp với biểu đồ
      const labels = revenueData.map((item) => item._id.year);
      const revenues = revenueData.map((item) => item.totalRevenue);

      // Cập nhật dữ liệu biểu đồ
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: revenues,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData(years); // Lấy dữ liệu ban đầu
  }, [years]);

  const handleYearChange = (value) => {
    setYears(value); // Cập nhật số năm và tự động tải lại dữ liệu
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Doanh thu theo năm",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu (VND)",
        },
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "20px auto" }}>
      <h2 style={{ textAlign: "center" }}>Biểu đồ doanh thu theo năm</h2>
      {/* Select để chọn số năm */}
      <Select
        defaultValue={5}
        style={{ width: 200, marginBottom: 20 }}
        onChange={handleYearChange}
      >
        {[1, 2, 3, 5, 10].map((year) => (
          <Option key={year} value={year}>
            {year} năm gần đây
          </Option>
        ))}
      </Select>
      {/* Biểu đồ */}
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default YearDashBoard;
