import { Card, Flex } from "antd";
import { useSelector } from "react-redux";
import Title from "../Title/Title";
import { DeliveredProcedureOutlined, RightOutlined } from "@ant-design/icons";

const BookDeliveryInfomation = () => {
  const user = useSelector((state) => state.auth.user);
  const { address } = user || {};
  return (
    <Card style={{ marginTop: "10px" }}>
      <Title title={"Thong tin van chuyen"} />
      <p>
        Giao hang den:
        <strong>{address !== null ? address : ""}</strong>
      </p>
      <p>
        <DeliveredProcedureOutlined /> <strong>Giao hang tieu chuan: </strong>
        <br />
        Du kien giao : Thu 2 24/02
      </p>
      <Title title={"Uu dai lien quan"} />
      <Flex></Flex>
      <span>
        <a href="#">
          Xem them <RightOutlined />
        </a>
      </span>
    </Card>
  );
};

export default BookDeliveryInfomation;
