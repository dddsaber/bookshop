import { instance } from ".";
const baseURL = "/review";

export const getReviewsByBookId = async (bookId) => {
  const response = await instance.get(`${baseURL}/book/${bookId}`);
  return response;
};

export const createReview = async (review) => {
  const response = await instance.post(`${baseURL}/`, review);
  return response;
};

export const updateReview = async (review) => {
  const response = await instance.put(
    `${baseURL}/update/${review._id}`,
    review
  );
  return response;
};

export const deleteReview = async (reviewId) => {
  const response = await instance.put(`${baseURL}/delete/${reviewId}`);
  return response;
};
