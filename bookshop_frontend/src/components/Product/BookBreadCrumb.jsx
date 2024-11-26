import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "../../context/CategoryContext";

const BookBreadCrumb = ({ categoryId }) => {
  const { categoriesLv1, categoriesLv2, categoriesLv3, loading } =
    useContext(CategoryContext);

  const [category1, setCategory1] = useState();
  const [category2, setCategory2] = useState();
  const [category3, setCategory3] = useState();

  useEffect(() => {
    if (categoriesLv3.some((category) => category._id === categoryId)) {
      const foundCategory3 = categoriesLv3.find(
        (category) => category._id === categoryId
      );
      setCategory3(foundCategory3);

      if (foundCategory3) {
        const foundCategory2 = categoriesLv2.find(
          (category) => category._id === foundCategory3.parentId
        );
        setCategory2(foundCategory2);

        if (foundCategory2) {
          const foundCategory1 = categoriesLv1.find(
            (category) => category._id === foundCategory2.parentId
          );
          setCategory1(foundCategory1);
        }
      }
    } else if (categoriesLv2.some((category) => category._id === categoryId)) {
      const foundCategory2 = categoriesLv2.find(
        (category) => category._id === categoryId
      );
      setCategory2(foundCategory2);

      if (foundCategory2) {
        const foundCategory1 = categoriesLv1.find(
          (category) => category._id === foundCategory2.parentId
        );
        setCategory1(foundCategory1);
      }
    } else if (categoriesLv1.some((category) => category._id === categoryId)) {
      const foundCategory1 = categoriesLv1.find(
        (category) => category._id === categoryId
      );
      setCategory1(foundCategory1);
    }
  }, [categoryId, categoriesLv1, categoriesLv2, categoriesLv3]);

  if (loading) {
    return <></>;
  }

  const breadcrumbItems = [
    {
      title: <Link to="/">Home</Link>,
    },
    category1 && {
      title: <Link to={`/category/${category1._id}`}>{category1.name}</Link>,
    },
    category2 && {
      title: <Link to={`/category/${category2._id}`}>{category2.name}</Link>,
    },
    category3 && {
      title: <Link to={`/category/${category3._id}`}>{category3.name}</Link>,
    },
  ].filter(Boolean); // Loại bỏ các giá trị `null` hoặc `undefined` khỏi mảng

  return <Breadcrumb items={breadcrumbItems} separator=">" />;
};

BookBreadCrumb.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

export default BookBreadCrumb;
