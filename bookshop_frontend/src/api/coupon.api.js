import { instance } from ".";

const baseURL = "/coupon";

// Lấy danh sách tất cả coupon
export const getCoupons = async () => {
  const response = await instance.get(baseURL);
  return response;
};

export const getCouponsForManage = async () => {
  console.log("ok");
  const response = await instance.get(`${baseURL}/manage/get`);
  return response;
};

// Lấy thông tin coupon theo ID
export const getCouponById = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

// Tạo mới một coupon
export const createCoupon = async (coupon) => {
  const response = await instance.post(baseURL, coupon);
  return response;
};

// Cập nhật thông tin coupon
export const updateCoupon = async (coupon) => {
  const response = await instance.put(`${baseURL}/${coupon._id}`, coupon);
  return response;
};

// Xóa coupon bằng cách thay đổi trạng thái
export const deleteCoupon = async (id) => {
  const response = await instance.put(`${baseURL}/delete/${id}`);
  return response;
};
