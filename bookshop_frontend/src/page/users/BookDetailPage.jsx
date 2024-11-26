import { Row, Col, Card, Rate, Layout, Flex, Table } from "antd";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";

import Title from "../../components/Title/Title";
import BookImageDisplay from "../../components/Product/BookImageDisplay";
import BookDeliveryInfomation from "../../components/Product/BookDeliveryInfomation";
import { StarOutlined } from "@ant-design/icons";
import Book from "../../components/Product/Book";
import BookReview from "../../components/Product/BookReview";
import BookBreadCrumb from "../../components/Product/BookBreadCrumb";
import LoadingPage from "../sub_pages/LoadingPage";

const BookDetailPage = () => {
  const { allProducts } = useContext(ProductContext);
  const books = Array.isArray(allProducts) ? allProducts : [allProducts];
  const { bookId } = useParams();
  if (!books.length) {
    return <LoadingPage />; // Hiển thị thông báo đang tải
  }
  const book = books.find((book) => book._id === bookId);

  const relatedBooks = books;

  const reviews = [];
  const columns = [
    {
      title: "",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "",
      dataIndex: "value",
      key: "value",
    },
  ];
  const dataForm = [
    {
      title: "Mã hàng",
      value: book._id,
    },
    {
      title: "Tên nhà cung cấp",
      value: book.provider ? book.provider : "",
    },
    {
      title: "Tác giả",
      value: book.authors ? book.authors : "",
    },
    {
      title: "NXB",
      value: book.publisher ? book.publisher : "",
    },
    {
      title: "Năm xuất bản",
      value: book.publicationYear ? book.publicationYear : "",
    },
    {
      title: "Trọng lượng (gr)",
      value: book.weight ? book.weight : "",
    },
    {
      title: "Kích thước bao bì",
      value:
        book.height && book.width ? `${book.height} x ${book.width} cm` : "",
    },
    {
      title: "Số trang",
      value: book.pages ? book.pages : "",
    },
  ];
  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        {/* Breadcrumbs */}
        <BookBreadCrumb categoryId={book.categories[0]._id} />

        <Row gutter={[12, 12]} style={{ marginTop: "15px" }}>
          <Col span={10} style={{ position: "sticky" }}>
            <BookImageDisplay book={book} />
          </Col>

          <Col span={14} style={{ overflowY: "auto" }}>
            <Card>
              <Title title={book.title} styles={{ paddingLeft: "10px" }} />

              <p style={{ margin: 0, padding: 20 }}>Kho : {book.quantity}</p>
              <p
                style={{
                  color: "red",
                  fontSize: 30,
                  margin: 0,
                  paddingLeft: 20,
                }}
              >
                {book.discount !== 0 ? (
                  <>
                    {(book.price * (1 - book.discount)).toLocaleString()} đ
                    <del
                      style={{
                        marginLeft: "10px",
                        color: "gray",
                        fontSize: "26px",
                      }}
                    >
                      {book.price.toLocaleString()} đ
                    </del>
                  </>
                ) : (
                  <>{book.price.toLocaleString()} đ</>
                )}
              </p>
            </Card>
            <BookDeliveryInfomation />
          </Col>
        </Row>
        <Row gutter={[12, 12]} style={{ marginTop: "10px" }}>
          <Col span={24}>
            <Card style={{ marginTop: "10px" }}>
              <Title
                title={"Thông tin chi tiết"}
                styles={{ paddingLeft: "10px" }}
              />
              <Table
                rowKey={"_id"}
                loading={() => {}}
                columns={columns}
                dataSource={dataForm}
                pagination={false}
                showHeader={false}
              />
              <p>
                Giá sản phẩm trên bookshop.com đã bao gồm thuế theo luật hiện
                hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ
                giao hàng mà có thể phát sinh thêm chi phí khác như Phụ phí đóng
                gói, phí vận chuyển, phụ phí hàng cồng kềnh,...
                <br />{" "}
                <span style={{ color: "red" }}>
                  Chính sách khuyến mãi trên Bookshop.com không áp dụng cho Hệ
                  thống Nhà sách Bookshop trên toàn quốc
                </span>
              </p>
            </Card>
            <Card style={{ margin: "15px 0" }}>
              <Title title={"Mo ta san pham"} />
              <p>
                {book?.description && book.description.trim().length > 0
                  ? book.description.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))
                  : "Không có mô tả cho sản phẩm này"}
              </p>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
          {/* Related Products */}
          <Col span={24}>
            <Card title="Related Products">
              <Row gutter={[16, 16]}>
                {relatedBooks.map((relatedBook) => (
                  <Col span={4} key={relatedBook._id}>
                    <Book book={relatedBook} />{" "}
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
          {/* Reviews */}
          <Col span={24}>
            <Card title="Reviews">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <Rate disabled defaultValue={review.rating} />
                    <p>
                      <strong>{review.author}</strong>: {review.content}
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews yet</p>
              )}
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
          <Col span={24}>
            <BookReview bookId={bookId} />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default BookDetailPage;
