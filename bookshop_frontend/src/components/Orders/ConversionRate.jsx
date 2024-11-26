import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { calculateMonthlyConversionRate } from "../../api/order.api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ConversionRateChart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại

  // Hàm tạo danh sách năm từ 2015 đến năm hiện tại
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2015; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  // Hàm fetch dữ liệu
  const fetchData = async () => {
    try {
      const response = await calculateMonthlyConversionRate({
        year: selectedYear,
      });
      if (response.status) {
        const fetchedData = response.data;

        const labels = fetchedData.map((item) => `Tháng ${item.month}`);
        const conversionRates = fetchedData.map((item) =>
          parseFloat(item.conversionRate)
        );

        // Cập nhật dữ liệu cho biểu đồ
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Tỷ lệ mua hàng (%)",
              data: conversionRates,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.3, // Làm mềm đường nối
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "#fff",
              pointRadius: 5,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Gọi API khi năm thay đổi
  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: `Biểu đồ Tỷ lệ mua hàng theo tháng (${selectedYear})`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tháng",
        },
      },
      y: {
        title: {
          display: true,
          text: "Tỷ lệ mua hàng (%)",
        },
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "20px auto" }}>
      {/* Select để chọn năm */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="year-select" style={{ marginRight: "10px" }}>
          Chọn năm:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {generateYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
      <p style={{ textAlign: "center" }}>
        (Tỉ lệ mua hàng được tính dựa trên số lượng đơn hàng thành công trên số
        sản phẩm được đưa vào giỏ hàng.)
      </p>
    </div>
  );
};

export default ConversionRateChart;
