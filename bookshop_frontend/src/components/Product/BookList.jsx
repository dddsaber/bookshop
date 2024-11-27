import { Col, Row } from "antd";
import Book from "./Book";
import PropTypes from "prop-types";

const BookList = ({ books }) => {
  return (
    <div>
      <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
        {books.map((book) => (
          <Col key={book._id} span={5}>
            <Book book={book} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of book objects
  keySearch: PropTypes.string,
};

export default BookList;
