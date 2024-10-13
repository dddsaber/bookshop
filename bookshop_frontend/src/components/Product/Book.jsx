import { Card, Button } from "antd";
import PropTypes from "prop-types";
import { getSourceBookImage } from "../../utils/image";

import { Link } from "react-router-dom";

const Book = ({ book, addToCart }) => {
  return (
    <Card
      style={{ textAlign: "center", paddingTop: "15px" }}
      hoverable
      cover={
        <Link to={`/book/${book._id}`}>
          <img
            style={{ width: 200, margin: 3 }}
            alt={book.title}
            src={getSourceBookImage(book.coverPhoto)}
            onClick={window.scrollTo(0, 0)}
          />
        </Link>
      }
    >
      <Card.Meta title={book.title} description={`${book.price} VND`} />
      <Button
        type="primary"
        style={{ marginTop: "10px" }}
        onClick={() => addToCart(book)}
      >
        Thêm vào giỏ
      </Button>
    </Card>
  );
};

Book.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    photos: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
    coverPhoto: PropTypes.string,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default Book;
