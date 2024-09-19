import { instance } from ".";

const baseURL = "/file";

export const uploadFileUser = (file) => {
  const formData = new FormData(); // Tạo FormData
  formData.append("file", file); // Thêm file vào FormData

  return instance.post(`${baseURL}/upload/user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
