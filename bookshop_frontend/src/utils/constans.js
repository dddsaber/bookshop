export const baseURL = "http://localhost:5000";
export const colorOfType = {
  admin: "red",
  user: "green",
};

export const TYPE_USER_STR = {
  admin: "Quản trị viên",
  user: "Người dùng",
};

export const TYPE_USER = {
  admin: "admin",
  user: "user",
};

export const getSourceImage = (url) => {
  if (!url) return "/default.png";
  return `${baseURL}/uploads/${url}`;
};
