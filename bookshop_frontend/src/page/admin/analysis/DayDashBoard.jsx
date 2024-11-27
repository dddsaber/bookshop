import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Đăng ký PointElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin datalabels
import { getRevenueByDay } from "../../../api/order.api"; // Giả sử có API này
import { Select } from "antd";

// Đăng ký các thành phần của Chart.js và plugin datalabels
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Đăng ký PointElement
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Đăng ký plugin datalabels
);

const DayDashBoard = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Lấy tháng hiện tại
  const currentYear = new Date().getFullYear();

  // Tạo danh sách năm và tháng từ 2015 đến hiện tại
  const years = [];
  for (let year = 2015; year <= currentYear; year++) {
    years.push(year);
  }

  const months = [];
  for (let month = 1; month <= 12; month++) {
    months.push(month);
  }

  const fetchRevenueData = async () => {
    try {
      // Gửi yêu cầu đến API để lấy dữ liệu doanh thu theo ngày
      const response = await getRevenueByDay({
        year: selectedYear,
        month: selectedMonth,
      });
      console.log(response);
      const data = response.data;

      // Chuyển đổi dữ liệu từ API để phù hợp với biểu đồ
      const labels = data.map((item) => `Ngày ${item.day}`); // Lấy danh sách các ngày trong tháng
      const revenues = data.map((item) => item.totalRevenue); // Lấy tổng doanh thu từng ngày
      const orderCounts = data.map((item) => item.orderCount); // Lấy số lượng đơn hàng từng ngày

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
            fill: false, // Không tô màu phía dưới đường
            yAxisID: "y1", // Gắn với trục y1 (Doanh thu)
            tension: 0.3,
          },
          {
            label: "Số lượng đơn hàng",
            data: orderCounts,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false, // Không tô màu phía dưới đường
            yAxisID: "y2", // Gắn với trục y2 (Số lượng đơn hàng)
            tension: 0.3,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedYear, selectedMonth]);

  // Hàm xử lý khi thay đổi năm
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Hàm xử lý khi thay đổi tháng
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>
        Doanh thu và Số lượng đơn hàng trong tháng {selectedMonth}/
        {selectedYear}
      </h2>

      <div style={{ padding: "0px" }}>
        <span>
          <strong>Chọn thời gian: </strong>
        </span>
        <Select
          title="Chọn tháng"
          style={{ width: 200, marginRight: "20px" }}
          value={selectedMonth}
          onChange={handleMonthChange}
          placeholder="Chọn tháng"
        >
          {months.map((month) => (
            <Select.Option key={month} value={month}>
              {month}
            </Select.Option>
          ))}
        </Select>
        <Select
          title="Chọn năm"
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
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: "Biểu đồ doanh thu và số lượng đơn hàng theo ngày",
              },
              datalabels: {
                display: true,
                color: "black",
                font: {
                  weight: "bold",
                },
                formatter: (value, context) => {
                  if (context.datasetIndex === 1) {
                    // Làm tròn số lượng đơn hàng
                    return Math.round(value);
                  }
                  return value;
                },
                anchor: "end",
                align: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Ngày",
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
                position: "right",
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

export default DayDashBoard;
