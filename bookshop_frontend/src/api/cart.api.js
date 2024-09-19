import { instance } from ".";

const baseURL = "/auth";

export const getCart = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const addItem = async (book, user, quantity) => {
  const response = await instance.put(`${baseURL}/add-item`, {
    bookId: book._id,
    userId: user._id,
    quantity,
  });
  return response;
};

export const removeItem = async (book, user, quantity) => {
  const response = await instance.put(`${baseURL}/remove-item`, {
    bookId: book._id,
    userId: user._id,
    quantity,
  });
  return response;
};

export const deleteItem = async (book, user) => {
  const response = await instance.delete(`${baseURL}/delete-item`, {
    bookId: book._id,
    userId: user._id,
  });
  return response;
};
export const updateQuantity = async (book, user, quantity) => {
  const response = await instance.put(`${baseURL}/update`, {
    bookId: book._id,
    userId: user._id,
    quantity,
  });
  return response;
};
