import { Spin } from "antd";
import "./LoadingPage.css";

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <Spin size="large" />
    </div>
  );
};

export default LoadingPage;
