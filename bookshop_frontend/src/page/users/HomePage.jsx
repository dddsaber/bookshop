import { Layout, Button, Carousel, Row, Col, Card, Tabs } from "antd";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import Book from "../../components/Product/Book";
import BookHero from "../../components/Product/BookHero";

const { Content, Footer } = Layout;

const categories = [
  "Văn học",
  "Khoa học",
  "Kinh tế",
  "Thiếu nhi",
  "Trinh thám",
];

const HomePage = () => {
  const { allProducts, cartItems } = useContext(ProductContext);
  const books = Array.isArray(allProducts) ? allProducts : [allProducts];
  console.log(books);
  return (
    <Layout>
      {/* Banner/Carousel */}
      <Content style={{ padding: "20px 50px" }}>
        <Carousel autoplay arrows>
          <div>
            <h3 style={carouselStyle}>Sách mới ra mắt</h3>
          </div>
          <div>
            <h3 style={carouselStyle}>Giảm giá đặc biệt</h3>
          </div>
          <div>
            <h3 style={carouselStyle}>Khuyến mãi mua 1 tặng 1</h3>
          </div>
        </Carousel>

        {/* Categories */}
        <div style={{ margin: "40px 0" }}>
          <h2>Thể loại sách</h2>
          <Row gutter={[16, 16]}>
            {categories.map((category, index) => (
              <Col key={index} span={4}>
                <Button type="primary" block>
                  {category}
                </Button>
              </Col>
            ))}
          </Row>
        </div>

        {/* Featured Books */}
        <div>
          <h2>Sách nổi bật</h2>
          <Row gutter={[16, 16]}>
            {books.map((book) => (
              <Col key={book._id} span={6}>
                <Book book={book} />
              </Col>
            ))}
          </Row>
        </div>

        {/* Best Sellers */}
        <div style={{ marginTop: "40px" }}>
          <h2>Sách bán chạy</h2>
          <Row gutter={[16, 16]}>
            {books.map((book) => (
              <Col key={book._id} span={6}>
                <Book book={book} />
              </Col>
            ))}
          </Row>
        </div>

        <Card style={{ marginTop: "20px" }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Ban chay nhat" key={1}>
              <BookHero books={books} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Sach moi nhat" key={2}>
              <BookHero books={books} keySearch={"Date"} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        My Bookstore ©2024 Created by Me
      </Footer>
    </Layout>
  );
};

// Styles
const carouselStyle = {
  height: "300px",
  color: "#fff",
  lineHeight: "300px",
  textAlign: "center",
  background: "#364d79",
  fontSize: "24px",
};

export default HomePage;
