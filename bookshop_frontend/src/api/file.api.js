import { imgInstance } from ".";
import { baseURL } from "../utils/constans";

export const uploadFileUser = async (file) => {
  const formData = new FormData(); // Tạo FormData
  formData.append("user", file); // Thêm file vào FormData

  const response = await imgInstance.post(`${baseURL}/upload/user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Đảm bảo đúng header
    },
  });
  return response;
};

export const uploadFileBook = async (file) => {
  const formData = new FormData(); // Tạo FormData
  formData.append("book", file); // Thêm file vào FormData

  const response = await imgInstance.post(`${baseURL}/upload/book`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Đảm bảo đúng header
    },
  });
  return response;
};
export const uploadFilesBook = async (files) => {
  const formData = new FormData(); // Tạo FormData
  files.forEach((file) => {
    formData.append("books", file); // Thêm file vào FormData
  });
  const response = await imgInstance.post(`${baseURL}/upload/books`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Đảm bảo đúng header
    },
  });
  return response;
};
