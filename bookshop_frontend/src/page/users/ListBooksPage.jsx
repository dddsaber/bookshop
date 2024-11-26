import { Card, Col, Layout, Row } from "antd";
import Book from "../../components/Product/Book";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import LoadingPage from "../sub_pages/LoadingPage";
import { useParams } from "react-router-dom";
import BookBreadCrumb from "../../components/Product/BookBreadCrumb";

const ListBooksPage = () => {
  const { categoryId } = useParams();
  const { books, fetchBooksOnCategory } = useContext(ProductContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooksOnCategory(categoryId);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [categoryId]);
  return loading ? (
    <LoadingPage />
  ) : (
    <div>
      <Layout style={{ padding: "10px 20px" }}>
        <BookBreadCrumb categoryId={categoryId} />
        <Layout.Content>
          <Card style={{ backgroundColor: "#fff", borderRadius: 10 }}>
            <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
              {books.map((book) => (
                <Col key={book._id} span={4}>
                  <Book book={book} />
                </Col>
              ))}
            </Row>
          </Card>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default ListBooksPage;
