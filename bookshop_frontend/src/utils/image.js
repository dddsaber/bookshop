export const baseURL = "http://localhost:5000";

export const getSourceUserImage = (url) => {
  if (!url) return "/images/default.png";
  return `${baseURL}/upload/user/${url}`;
};

export const getSourceBookImage = (url) => {
  if (!url) return "/images/default.png";
  return `${baseURL}/upload/book/${url}`;
};

export const getSourceOthersImage = (url) => {
  if (!url) return "/images/default.png";
  return `${baseURL}/upload/others/${url}`;
};
