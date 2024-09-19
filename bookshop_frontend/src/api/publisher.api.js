import { instance } from ".";

const baseURL = "/publisher";

export const getPublishers = async (body) => {
  const response = await instance.post(`${baseURL}/$get-publishers`, body);
  return response;
};

export const getPublisherById = async (publisher) => {
  const response = await instance.get(`${baseURL}/${publisher._id}`);
  return response;
};

export const createPublisher = async (publisher) => {
  const response = await instance.post(`${baseURL}/`, publisher);
  return response;
};

export const updatePublisher = async (publisher) => {
  const response = await instance.put(
    `${baseURL}/update/${publisher._id}`,
    publisher
  );
  return response;
};

export const deletePublisher = async (publisher) => {
  const response = await instance.put(`${baseURL}/delete/${publisher._id}`);
  return response;
};
