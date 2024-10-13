import { Col, Row } from "antd";
import Book from "./Book";
import PropTypes from "prop-types";

const BookHero = ({ books, keySearch }) => {
  // Lấy 4 cuốn sách đầu tiên
  const displayedBooks = keySearch
    ? books
        // Giả sử bạn muốn tìm theo tiêu đề
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sắp xếp theo updatedAt giảm dần
        .slice(0, 4) // Lấy 4 cuốn mới nhất
    : books.slice(0, 4); // Lấy 4 cuốn sách đầu tiên nếu không có keySearch
  console.log(displayedBooks);
  return (
    <div>
      <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
        {displayedBooks.map((book) => (
          <Col key={book._id} span={5}>
            <Book book={book} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

BookHero.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of book objects
  keySearch: PropTypes.string,
};

export default BookHero;
