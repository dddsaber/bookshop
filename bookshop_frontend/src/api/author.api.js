import { instance } from ".";

const baseURL = "/author";

export const createAuthor = async (author) => {
  const response = await instance.post(`${baseURL}/$create`, author);
  return response;
};

export const getAuthors = async (body) => {
  const response = await instance.post(`${baseURL}/get-authors`, body);
  return response;
};

export const getAuthorById = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const updateAuthor = async (author) => {
  const response = await instance.put(
    `${baseURL}/update/${author._id}`,
    author
  );
  return response;
};

export const deleteAuthor = async (id) => {
  const response = await instance.delete(`${baseURL}/delete/${id}`);
  return response;
};
