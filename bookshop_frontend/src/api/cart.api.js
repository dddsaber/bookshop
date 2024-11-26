import { instance } from ".";

const baseURL = "/cart";

export const getCart = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const addItem = async (bookId, userId, quantity) => {
  const response = await instance.put(`${baseURL}/add-item`, {
    bookId,
    userId,
    quantity,
  });
  return response;
};

export const removeItem = async (bookId, userId) => {
  const response = await instance.put(`${baseURL}/remove-item`, {
    bookId,
    userId,
  });
  return response;
};

export const deleteItem = async (bookId, userId) => {
  const response = await instance.delete(`${baseURL}/delete-item`, {
    bookId,
    userId,
  });
  return response;
};
export const updateQuantity = async (bookId, userId, quantity) => {
  const response = await instance.put(`${baseURL}/update`, {
    bookId,
    userId,
    quantity,
  });
  return response;
};
