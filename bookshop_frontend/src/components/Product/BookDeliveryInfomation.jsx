import { Card, Flex } from "antd";
import { useSelector } from "react-redux";
import Title from "../Title/Title";
import { DeliveredProcedureOutlined, RightOutlined } from "@ant-design/icons";

const BookDeliveryInfomation = () => {
  const user = useSelector((state) => state.auth.user);
  const { address } = user || {};
  return (
    <>
      <Card style={{ margin: "20px 0" }}>
        <Title title={"Thong tin van chuyen"} />
        <p>
          Giao hàng đến:
          <strong>
            {address !== null
              ? `${address.province}, ${address.district}, ${address.ward}, ${address.detail}`
              : ""}
          </strong>
        </p>
        <p>
          <DeliveredProcedureOutlined /> <strong>Giao hàng tiêu chuẩn: </strong>
          <br />
          Dự kiến giao:
        </p>
      </Card>
      <Card style={{ margin: "10px 0" }}>
        <Title title={"Ưu đãi liên quan"} />
        <Flex></Flex>
        <span>
          <a href="#">
            Xem thêm <RightOutlined />
          </a>
        </span>
      </Card>
    </>
  );
};

export default BookDeliveryInfomation;
