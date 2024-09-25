export const baseURL = "http://localhost:5000";

export const Gender = {
  true: "Male",
  false: "female",
};

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
export const LANGUAGE = {
  en: "en",
  vi: "vi",
  ko: "ko",
  zh: "zh",
  ja: "ja",
};

export const LANGUAGE_STR = [
  { code: "en", str: "English" },
  { code: "vi", str: "Vietnamese" },
  { code: "ko", str: "Korean" },
  { code: "zh", str: "Chinese" },
  { code: "ja", str: "Japanese" },
];

export const FORMAT_BOOK_STR = [
  { code: "hardback", str: "Bìa cứng" },
  { code: "paperback", str: "Bìa mềm" },
  { code: "ebook", str: "E-book" },
];

export const AGE_RANGE_STR = [
  { code: "u6", str: "Dưới 6 tuổi" },
  { code: "u12", str: "Dưới 12 tuổi" },
  { code: "u18", str: "Dưới 18 tuổi" },
  { code: "a18", str: "Hơn 18 tuổi" },
];
