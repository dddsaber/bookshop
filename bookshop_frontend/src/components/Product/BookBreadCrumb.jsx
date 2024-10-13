import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getCategoriesOnIds } from "../../api/category.api";
import { useEffect, useState } from "react";

const BookBreadCrumb = ({ book }) => {
  const [category0, setCategory0] = useState({});
  const [category1, setCategory1] = useState({});
  const [category2, setCategory2] = useState({});

  const fetchCategory = async () => {
    try {
      // Lấy danh sách categoryIds từ book
      let categoryIds = book.categories.map((category) => category._id);
      categoryIds = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

      // Gọi API để lấy category dựa trên Ids
      const response = await getCategoriesOnIds({ Ids: categoryIds });
      setCategory0(response.data[0]);

      // Kiểm tra và xử lý nếu category0 có parentId
      if (response.data[0]?.parentId) {
        const response1 = await getCategoriesOnIds({
          Ids: [response.data[0].parentId], // Chuyển parentId thành mảng chứa chuỗi
        });
        setCategory1(response1.data[0]);
      }

      // Kiểm tra và xử lý nếu category1 có parentId
      if (category1?.parentId) {
        const response2 = await getCategoriesOnIds({
          Ids: [category1.parentId], // Chuyển parentId thành mảng chứa chuỗi
        });
        setCategory2(response2.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Sử dụng useEffect để gọi fetchCategory khi 'book' thay đổi
  useEffect(() => {
    fetchCategory();
  }, [book]);

  return (
    <>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/books">{category2?.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/books">{category1?.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/books">{category0?.name}</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{book.title}</Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
};

BookBreadCrumb.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    photos: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
    coverPhoto: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default BookBreadCrumb;
