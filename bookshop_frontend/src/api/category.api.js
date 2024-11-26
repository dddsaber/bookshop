import { instance } from ".";

const baseURL = "/category";

export const createCategory = async (category) => {
  const response = await instance.post(`${baseURL}`, category);
  return response;
};

export const getCategories = async (body) => {
  const response = await instance.post(`${baseURL}/get-categories`, body);
  return response;
};

export const getCategoryById = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const updateCategory = async (id, category) => {
  const response = await instance.put(`${baseURL}/update/${id}`, category);
  return response;
};

export const deleteCategory = async (id) => {
  const response = await instance.delete(`${baseURL}/delete/${id}`);
  return response;
};

export const getCategoriesOnParentId = async (body) => {
  const response = await instance.post(`${baseURL}/get-on-parent-id`, body);
  return response;
};

export const getCategoriesOnIds = async (body) => {
  console.log(body);
  const response = await instance.post(
    `${baseURL}/get-categories-on-ids`,
    body
  );
  return response;
};
