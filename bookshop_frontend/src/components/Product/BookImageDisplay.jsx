import {
  CarOutlined,
  PlusOutlined,
  RightOutlined,
  SyncOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Image, InputNumber, Row, notification } from "antd";
import { getSourceBookImage } from "../../utils/image";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { ProductContext } from "../../context/ProductContext";

const BookImageDisplay = ({ book }) => {
  const { addCart } = useContext(ProductContext);
  const [quantity, setQuantity] = useState(1);
  const increment = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrement = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleAddCart = (book, quantity) => {
    addCart(book._id, quantity);
    notification.success({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      description: `${quantity} "${book.title}" đã được thêm vào giỏ hàng`,
    });
  };
  return (
    <Card
      style={{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Image
        width={300}
        src={getSourceBookImage(book.coverPhoto)}
        alt={book.title}
        style={{ marginBottom: "10px" }}
      />
      <Row gutter={[8, 8]} style={{ justifyContent: "space-around" }}>
        {book.photos.slice(0, 3).map((img, index) => (
          <Col key={index}>
            <Image
              width={80}
              height={100}
              src={getSourceBookImage(book.photos[index])}
              style={{ border: "1px solid grey", borderRadius: "2px" }}
            />
          </Col>
        ))}
        {book.photos.length > 4 && (
          <Col>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{
                width: 80,
                height: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {book.photos.length - 3}
            </Button>
          </Col>
        )}
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "center",
            }}
          >
            <span
              style={{ marginRight: "10px", fontWeight: "bold", fontSize: 20 }}
            >
              Số lượng:
            </span>
            <div
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                width: "30%",
                border: " 2px solid grey",
                borderRadius: 15,
                height: "45px",
              }}
            >
              <span
                onClick={decrement}
                style={{
                  cursor: "pointer",
                  fontSize: 25,
                  margin: 0,
                  marginRight: 5,
                }}
              >
                -
              </span>{" "}
              <InputNumber
                min={1}
                max={100}
                value={quantity}
                onChange={(value) => setQuantity(value)}
                controls={false} // Hiển thị các nút điều khiển (+, -)
                style={{
                  textAlign: "center",
                  color: "black",
                  margin: "0 10px",
                  border: "0px",
                  width: "40px",
                }}
              />
              <span
                onClick={increment}
                style={{ cursor: "pointer", fontSize: 25, margin: 0 }}
              >
                +
              </span>
            </div>
          </div>
          <Button
            style={{ color: "red", borderColor: "red", width: "45%" }} // Thêm width cho nút này
            size="large"
            onClick={() => {
              handleAddCart(book, quantity);
            }}
          >
            Thêm vào giỏ hàng
          </Button>
          <Button
            type="default"
            size="large"
            style={{
              marginLeft: "10px",
              width: "45%", // Cũng đặt width là 40% cho nút này
              backgroundColor: "red",
              color: "white",
            }}
          >
            Mua ngay
          </Button>
        </div>
        {/* 
                chinh sach uu dai
                 */}
        <div style={{ width: "100%", margin: "15px 0 0" }}>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline",
              marginTop: "20px",
            }}
          >
            Chính sách ưu đãi
          </p>
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div>
                <p>
                  <CarOutlined
                    style={{
                      color: "red",
                      fontSize: "20px",
                      marginRight: "10px",
                      display: "inline",
                    }}
                  />
                  <strong>Thời gian giao hàng: </strong> Giao nhanh và uy tín
                </p>
              </div>
              <RightOutlined />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div>
                <p>
                  <SyncOutlined
                    style={{
                      color: "red",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  />
                  <strong>Chính sách đổi trả: </strong> Đổi trả miễn phí toàn
                  quốc
                </p>
              </div>
              <RightOutlined />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p>
                  <TeamOutlined
                    style={{
                      color: "red",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  />
                  <strong>Chính sách khách sỉ: </strong>Ưu đãi khi mua số lượng
                  lớn
                </p>
              </div>
              <RightOutlined />
            </div>
          </div>
        </div>
      </Row>
    </Card>
  );
};
BookImageDisplay.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    photos: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
    coverPhoto: PropTypes.string,
  }).isRequired,
};

export default BookImageDisplay;
