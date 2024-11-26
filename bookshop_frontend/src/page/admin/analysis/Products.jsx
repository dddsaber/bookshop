import ConversionRateChart from "../../../components/Orders/ConversionRate";
import Stats from "../../../components/Orders/Stats";

const Products = () => {
  return (
    <div>
      <h3 style={{ margin: "20px auto", textAlign: "center" }}>
        Biểu đồ tỉ lệ mua háng
      </h3>
      <ConversionRateChart />

      <Stats />
    </div>
  );
};

export default Products;
