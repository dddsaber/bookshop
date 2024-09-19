import { instance } from ".";

const baseURL = "/book";

export const getBooks = async (body) => {
  const response = await instance.post(`${baseURL}/get-books`, body);
  return response;
};

export const getBookById = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const createBook = async (book) => {
  const response = await instance.post(`${baseURL}/`, book);
  return response;
};

export const updateBook = async (book) => {
  const response = await instance.put(`${baseURL}/update/${book._id}`, book);
  return response;
};

export const deleteBook = async (id) => {
  const response = await instance.put(`${baseURL}/delete/${id}`);
  return response;
};
