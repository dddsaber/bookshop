import { createContext, useEffect, useState } from "react";
import { getBooks } from "../api/book.api";
import { getCart } from "../api/cart.api";
import { useSelector } from "react-redux";

export const ProductContext = createContext(null);

const ProductContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user); // Lấy user từ Redux store
  const { _id } = user || {};

  const fetchCartItems = async (userId) => {
    if (!userId) {
      console.log("error");
      return;
    } // Chỉ gọi API nếu _id có giá trị
    try {
      const response = await getCart(userId);
      if (response.status) {
        setCartItems(response.data);
        console.log("Cart fetched successfully", response.data);
      } else {
        console.error("Error fetching cart");
      }
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    console.log("ok");
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
    cartItems,
    allProducts,
    setAllProducts,
    error, // Có thể thêm thông tin lỗi vào context nếu cần
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
