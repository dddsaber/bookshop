import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Tag,
  InputNumber,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const BookDetail = ({ book }) => {
  const handleAddToCart = () => {
    // Xử lý thêm vào giỏ hàng
  };

  return (
    <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
      {/* Left Column - Image and Additional Images */}
      <Col span={10}>
        <Card>
          <Image
            width={300}
            src={book.mainImage}
            alt={book.title}
            style={{ marginBottom: "10px" }}
          />
          <Row gutter={[8, 8]}>
            {book.images.slice(0, 3).map((img, index) => (
              <Col key={index}>
                <Image
                  width={80}
                  height={100}
                  src={img}
                  alt={`Book image ${index}`}
                />
              </Col>
            ))}
            {book.images.length > 4 && (
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
                  +{book.images.length - 4}
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      </Col>

      {/* Right Column - Book Details */}
      <Col span={14}>
        <Title level={3}>{book.title}</Title>
        <Text strong>{book.author}</Text>
        <div style={{ margin: "10px 0" }}>
          <Tag color="red">Flash Sale</Tag>
          <Title level={2} style={{ color: "red" }}>
            {book.salePrice}đ
          </Title>
          <Text delete>{book.originalPrice}đ</Text>
        </div>
        <Text>Số lượng:</Text>
        <InputNumber
          min={1}
          max={book.stock}
          defaultValue={1}
          style={{ marginLeft: "10px" }}
        />
        <div style={{ marginTop: "20px" }}>
          <Button type="primary" size="large" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
          <Button type="default" size="large" style={{ marginLeft: "10px" }}>
            Mua ngay
          </Button>
        </div>
      </Col>
    </Row>
  );
};

// Ví dụ dữ liệu cho component
const exampleBook = {
  title: "Người Đàn Ông Mang Tên Ove",
  author: "Fredrik Backman",
  mainImage: "https://example.com/main-image.jpg",
  images: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
    "https://example.com/image4.jpg",
    "https://example.com/image5.jpg",
  ],
  salePrice: 128000,
  originalPrice: 160000,
  stock: 5,
};

const App = () => {
  return <BookDetail book={exampleBook} />;
};

export default App;
