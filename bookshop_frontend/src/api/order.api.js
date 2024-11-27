import { instance } from ".";

const baseURL = "/order";

export const createOrder = async (order) => {
  const response = await instance.post(`${baseURL}/`, order);
  return response;
};

export const getOrders = async (data) => {
  const response = await instance.post(`${baseURL}/get-orders`, data);
  return response;
};

export const getOrdersByUserId = async (id, data) => {
  const response = await instance.post(`${baseURL}/orders-by-user/${id}`, data);
  return response;
};

export const getOrderDetail = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await instance.put(`${baseURL}/update-status/${orderId}`, {
    status,
  });
  return response;
};

export const turnOffNotice = async (orderId) => {
  const response = await instance.put(`${baseURL}/turn-off-notice/${orderId}`);
  return response;
};

export const cancelOrder = async (id, body) => {
  const response = await instance.put(`${baseURL}/cancel-order/${id}`, body);
  return response;
};

export const updateOrder = async (order) => {
  const response = await instance.put(`${baseURL}/update/${order._id}`, order);
  return response;
};

export const getOrderStats = async () => {
  const response = await instance.post(`${baseURL}/stats`);
  return response;
};

export const getRevenueByDay = async (body) => {
  const response = await instance.post(`${baseURL}/revenue/day`, body);
  return response;
};

export const getRevenueByMonth = async (body) => {
  const response = await instance.post(`${baseURL}/revenue/month`, body);
  return response;
};

export const getRevenueByYear = async (body) => {
  const response = await instance.post(`${baseURL}/revenue/year`, body);
  return response;
};

export const calculateMonthlyConversionRate = async (body) => {
  const response = await instance.post(`${baseURL}/conversion-rate`, body);
  return response;
};
