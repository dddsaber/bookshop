import { instance } from ".";

const baseURL = "/delivery";

export const createDelivery = async (delivery) => {
  const response = await instance.post(`${baseURL}`, delivery);
  return response;
};

export const getDeliveryById = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const updateDeliveryStatus = async (delivery) => {
  const response = await instance.put(
    `${baseURL}/update-status/${delivery._id}`,
    delivery
  );
  return response;
};

export const getDeliveryByOrderId = async (order) => {
  const response = await instance.get(`${baseURL}/${order._id}`, order);
  return response;
};

export const deleteDelivery = async (id) => {
  const response = await instance.delete(`${baseURL}/delete/${id}`);
  return response;
};

export const getDeliveries = async (body) => {
  const response = await instance.post(`${baseURL}`, body);
  return response;
};
