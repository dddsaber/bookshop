import { instance } from ".";

const baseURL = "/order";

export const createOrder = async (order) => {
  const response = await instance.post(`${baseURL}/`, order);
  return response;
};

export const getOrders = async (params) => {
  const response = await instance.post(`${baseURL}/get-orders`, { params });
  return response;
};

export const getOrderDetail = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const updateOrderStatus = async (order, status) => {
  const response = await instance.put(`${baseURL}/update-status/${order._id}`, {
    status,
  });
  return response;
};

export const cancelOrder = async (id) => {
  const response = await instance.put(`${baseURL}/cancel-order/${id}`);
  return response;
};

export const updateOrder = async (order) => {
  const response = await instance.put(`${baseURL}/update/${order._id}`, order);
  return response;
};

// Chua viet
export const deleteOrder = async (id) => {
  const response = await instance.delete(`${baseURL}/delete/${id}`);
  return response;
};
