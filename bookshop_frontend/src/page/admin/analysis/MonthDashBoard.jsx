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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin datalabels
import { getRevenueByMonth } from "../../../api/order.api";
import { Select } from "antd";

// Đăng ký các thành phần của Chart.js và plugin datalabels
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Đăng ký plugin datalabels
);

const MonthDashBoard = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();

  // Tạo danh sách năm từ 2015 đến hiện tại
  const years = [];
  for (let year = 2015; year <= currentYear; year++) {
    years.push(year);
  }
  const fetchRevenueData = async () => {
    try {
      // Gửi yêu cầu đến API
      const response = await getRevenueByMonth({ year: selectedYear });
      console.log(response);
      const data = response.data;

      // Chuyển đổi dữ liệu từ API để phù hợp với biểu đồ
      const labels = data.map((item) => `Tháng ${item.month}`); // Lấy danh sách các tháng
      const revenues = data.map((item) => item.totalRevenue); // Lấy tổng doanh thu từng tháng
      const orderCounts = data.map((item) => item.orderCount); // Lấy số lượng đơn hàng từng tháng

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
            yAxisID: "y1", // Gắn với trục y1 (Doanh thu)
          },
          {
            label: "Số lượng đơn hàng",
            data: orderCounts,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            yAxisID: "y2", // Gắn với trục y2 (Số lượng đơn hàng)
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedYear]);

  // Hàm xử lý khi thay đổi năm
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>
        Doanh thu và Số lượng đơn hàng trong năm {selectedYear}
      </h2>
      <div style={{ padding: "0px" }}>
        <h3>Chọn năm:</h3>
        <Select
          style={{ width: 200 }}
          value={selectedYear}
          onChange={handleYearChange}
          placeholder="Chọn năm"
        >
          {years.map((year) => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      </div>

      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: "Biểu đồ doanh thu và số lượng đơn hàng theo tháng",
              },
              datalabels: {
                display: true, // Hiển thị con số
                color: "black", // Màu chữ cho con số
                font: {
                  weight: "bold",
                },
                formatter: (value, context) => {
                  if (context.datasetIndex === 1) {
                    // Làm tròn số lượng đơn hàng về số nguyên
                    return Math.round(value); // Làm tròn số lượng đơn hàng
                  }
                  return value; // Đối với doanh thu, không làm tròn
                },
                anchor: "end", // Đặt con số ở cuối cột
                align: "top", // Đặt con số ở trên cột
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Tháng",
                },
              },
              y1: {
                title: {
                  display: true,
                  text: "Doanh thu (VND)",
                },
                beginAtZero: true,
              },
              y2: {
                title: {
                  display: true,
                  text: "Số lượng đơn hàng",
                },
                beginAtZero: true,
                position: "right", // Trục y thứ hai sẽ ở bên phải
              },
            },
          }}
        />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default MonthDashBoard;
