/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { getCategoriesOnParentId } from "../api/category.api";

export const CategoryContext = createContext(null);

const CategoryContextProvider = (props) => {
  const [categoriesLv1, setCategoriesL1] = useState([]);
  const [categoriesLv2, setCategoriesL2] = useState([]);
  const [categoriesLv3, setCategoriesL3] = useState([]);
  const [selectedCategoryLv1, setSelectedCategoryLv1] = useState();
  const [selectedCategoryLv2, setSelectedCategoryLv2] = useState();
  const [selectedCategoryLv3, setSelectedCategoryLv3] = useState();
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const responseLv1 = await getCategoriesOnParentId({ parentId: null });

      const resultLv1 = responseLv1.data; // Đảm bảo result là mảng
      setCategoriesL1(resultLv1);

      // Chỉ fetch categories level 2 nếu categoriesLv1 có dữ liệu
      if (resultLv1.length > 0) {
        const responseLv2 = await getCategoriesOnParentId({
          parentId: resultLv1.map((category) => category._id),
        });
        const resultLv2 = responseLv2.data; // Đảm bảo result là mảng
        setCategoriesL2(resultLv2);

        // Chỉ fetch categories level 3 nếu categoriesLv2 có dữ liệu
        if (resultLv2.length > 0) {
          const responseLv3 = await getCategoriesOnParentId({
            parentId: resultLv2.map((category) => category._id),
          });
          const resultLv3 = responseLv3.data; // Đảm bảo result là mảng
          setCategoriesL3(resultLv3);
        } else {
          setCategoriesL3([]); // Đặt categoriesLv3 về mảng rỗng nếu không có level 2
        }
      } else {
        setCategoriesL2([]); // Đặt categoriesLv2 về mảng rỗng nếu không có level 1
        setCategoriesL3([]); // Đặt categoriesLv3 về mảng rỗng
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const contextValue = {
    categoriesLv1,
    categoriesLv2,
    categoriesLv3,
    selectedCategoryLv1,
    setSelectedCategoryLv1,
    selectedCategoryLv2,
    setSelectedCategoryLv2,
    selectedCategoryLv3,
    setSelectedCategoryLv3,
    loading, // Cung cấp trạng thái loading
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
