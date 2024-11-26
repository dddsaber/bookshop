import { Layout, Carousel, Row, Col, Card, Tabs } from "antd";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import BookHero from "../../components/Product/BookHero"; // Sử dụng BookHero component
import carousel1 from "../../assets/carousel1.jpg";
import carousel2 from "../../assets/carousel2.jpg";
import carousel4 from "../../assets/carousel4.jpg";
const { Content, Footer } = Layout;

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
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={carousel2}
              alt="Giảm giá đặc biệt"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src={carousel4}
              alt="Khuyến mãi mua 1 tặng 1"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </div>
        </Carousel>

        {/* Featured Books */}

        {/* Best Sellers and Latest Books Tabs */}
        <Card style={{ marginTop: "20px" }}>
          <Tabs defaultActiveKey="1" items={tab_items} />
        </Card>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        My Bookstore ©2024 Created by Me
      </Footer>
    </Layout>
  );
};

export default HomePage;
