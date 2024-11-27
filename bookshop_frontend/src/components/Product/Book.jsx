import { Card, Button, notification } from "antd";
import PropTypes from "prop-types";
import { getSourceBookImage } from "../../utils/image";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";

const Book = ({ book }) => {
  const { addCart } = useContext(ProductContext);
  const handleAddCart = async (book, quantity) => {
    const status = await addCart(book._id, quantity);
    if (status)
      notification.success({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        description: `${quantity} ${book.title} đã được thêm vào giỏ hàng`,
      });
  };
  return (
    <Card
      style={{ textAlign: "center", paddingTop: "15px" }}
      hoverable
      cover={
        <Link to={`/book/${book._id}`} onClick={() => window.scrollTo(0, 0)}>
          <img
            style={{ width: 160, margin: 3 }}
            alt={book.title}
            src={getSourceBookImage(book.coverPhoto)}
          />
        </Link>
      }
    >
      <Card.Meta
        title={book.title}
        description={
          book.discount !== 0 ? (
            <>
              <span style={{ color: "#b4182d", fontWeight: "bold" }}>
                {(book.price * (1 - book.discount)).toLocaleString()}{" "}
                đ&nbsp;&nbsp;
                <span style={{ backgroundColor: "#b4182d", color: "#fff" }}>
                  - {book.discount * 100} %
                </span>
                <br />
              </span>
              <del
                style={{
                  marginLeft: "10px",
                  color: "gray",
                }}
              >
                {book.price.toLocaleString()} đ
              </del>
            </>
          ) : (
            <span style={{ color: "#b4182d", fontWeight: "bold" }}>
              {book.price.toLocaleString()} đ <br /> <br />
            </span>
          )
        }
      />
      <Button
        type="primary"
        style={{ marginTop: "10px" }}
        onClick={(e) => {
          e.preventDefault();
          handleAddCart(book, 1);
        }}
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
    discount: PropTypes.number,
    _id: PropTypes.string,
    coverPhoto: PropTypes.string,
  }).isRequired,
};

export default Book;
