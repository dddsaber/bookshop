import { Layout, Carousel, Row, Col, Card, Tabs, Image } from "antd";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import BookHero from "../../components/Product/BookHero"; // Sử dụng BookHero component
import carousel1 from "../../assets/carousel1.jpg";
import carousel2 from "../../assets/carousel2.jpg";
import carousel4 from "../../assets/carousel4.jpg";
import book1 from "../../assets/p1.jpg";
import book2 from "../../assets/p2.jpg";
import book3 from "../../assets/p3.jpg";
import book4 from "../../assets/p4.jpg";
import BookList from "../../components/Product/BookList";
const { Content } = Layout;

const HomePage = () => {
  const { allProducts } = useContext(ProductContext);
  const books = Array.isArray(allProducts) ? allProducts : [allProducts];

  // Hàm để lấy ngẫu nhiên 4 sách từ mảng
  const getRandomBooks = (bookArray, count = 4) => {
    const shuffled = [...bookArray].sort(() => 0.5 - Math.random()); // Xáo trộn mảng
    return shuffled.slice(0, count); // Lấy 4 sách ngẫu nhiên
  };

  // Lấy 4 sách ngẫu nhiên cho mỗi tab
  const bestSellers = getRandomBooks(books);
  const latestBooks = getRandomBooks(books);

  const saleBooks = books.filter((book) => book.discount > 0);

  const tab_items = [
    {
      key: "1",
      label: "Bán chạy nhất",
      children: <BookHero books={bestSellers} />, // Truyền 4 sách ngẫu nhiên vào đây
    },
    {
      key: "2",
      label: "Sách mới nhất",
      children: <BookHero books={latestBooks} />, // Truyền 4 sách ngẫu nhiên vào đây
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: "20px 50px" }}>
        <Carousel autoplay arrows>
          <div>
            <img
              src={carousel1}
              alt="Sách mới ra mắt"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={carousel2}
              alt="Giảm giá đặc biệt"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={carousel4}
              alt="Khuyến mãi mua 1 tặng 1"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          </div>
        </Carousel>

        <Row justify={"space-between"} style={{ margin: "20px 0" }}>
          <Col span={5}>
            <Image src={book1} style={{ borderRadius: "5px" }} />
          </Col>
          <Col span={5}>
            <Image src={book2} style={{ borderRadius: "5px" }} />
          </Col>
          <Col span={5}>
            <Image src={book3} style={{ borderRadius: "5px" }} />
          </Col>
          <Col span={5}>
            <Image src={book4} style={{ borderRadius: "5px" }} />
          </Col>
        </Row>
        {/* Featured Books */}
        <Card
          style={{ backgroundColor: "#fda481" }}
          title="Sách khuyến mãi"
          headStyle={{
            color: "#fff",
            fontWeight: "bold",
            backgroundColor: "#a34054",
          }}
        >
          <BookHero books={saleBooks} />
        </Card>
        {/* Best Sellers and Latest Books Tabs */}
        <Card
          style={{ marginTop: "20px" }}
          title="Đáng lưu ý"
          headStyle={{
            color: "#fff",
            fontWeight: "bold",
            backgroundColor: "#ae7dac",
          }}
        >
          <Tabs defaultActiveKey="1" items={tab_items} />
        </Card>
        <Card
          style={{ margin: "20px 0" }}
          title="Sáchs trong nước"
          headStyle={{
            color: "#fff",
            fontWeight: "bold",
            backgroundColor: "#413b61",
          }}
        >
          <BookList books={books} />
        </Card>
      </Content>
    </Layout>
  );
};

export default HomePage;
