/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { getBooks, getBooksOnCategories } from "../api/book.api";
import { addItem, getCart, removeItem, updateQuantity } from "../api/cart.api";
import { useSelector } from "react-redux";

export const ProductContext = createContext(null);

const ProductContextProvider = (props) => {
  const [cart, setCart] = useState({});
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user); // Lấy user từ Redux store
  const { _id } = user || {};

  const fetchBooksOnCategory = async (categoryId) => {
    try {
      const response = await getBooksOnCategories(categoryId);

      if (response.status) {
        const books = response.data;
        setBooks(books);
        setTotal(books.length);
      } else {
        console.error("Error fetching books");
      }
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const fetchCartItems = async (userId) => {
    if (!userId) {
      console.log("error");
      return;
    } // Chỉ gọi API nếu _id có giá trị
    try {
      const response = await getCart(userId);
      if (response.status) {
        setCart(response.data);
      } else {
        console.error("Error fetching cart");
      }
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const addCart = async (bookId, quantity) => {
    if (!_id) {
      console.log("error");
      return;
    }

    try {
      const response = await addItem(bookId, user._id, quantity);
      if (response.status) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart", error);
      return false;
    }
  };

  const updateCart = async (bookId, quantity) => {
    if (!_id) {
      console.log("error");
      return;
    }
    try {
      const response = await updateQuantity(bookId, user._id, quantity);
      if (response.status) {
        fetchCartItems(user._id);
      } else {
        console.error("Error updating cart");
      }
    } catch (error) {
      console.error("Error updating cart", error);
    }
  };

  const removeCart = async (bookId) => {
    if (!_id) {
      console.log("error");
      return;
    }
    try {
      const response = await removeItem(bookId, user._id);
      if (response.status) {
        fetchCartItems(user._id);
      } else {
        console.error("Error removing from cart");
      }
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  useEffect(() => {
    if (_id) {
      fetchCartItems(_id);
    }
  }, [_id]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await getBooks();
        const { books } = await response.data;
        if (isMounted) {
          setAllProducts(books);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message); // Xử lý lỗi nếu có
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, []);

  const contextValue = {
    total,
    books,
    fetchBooksOnCategory,
    cart,
    addCart,
    updateCart,
    removeCart,
    allProducts,
    setAllProducts,
    error,
    fetchCartItems,
    _id,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
