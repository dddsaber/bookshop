const PASSWORD_DEFAULT = "12345678";
const TAX_RATE_VAC = 0.1;
const BOOK_SHOP_EMAIL = "nhbl.loc@gmail.com";
const BOOK_SHOP_PASSWORD = "fbjs cwie eswt zfjh";

// URL den form o frontend
const confirmationUrl = `http://localhost:3001/change-password`;

// Cấu hình email HTML với nút xác nhận
const htmlContentForConfirmPassword = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #333;">Xác nhận tài khoản của bạn</h2>
        <p>Chào mừng bạn đến với Book Shop!</p>
        <p>Vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của bạn:</p>
        <a href="${confirmationUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          color: white;
          background-color: #28a745;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">Xác nhận tài khoản</a>
        <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
      </div>
    `;

const TYPE_USER = {
  admin: "admin",
  user: "user",
  administrative: "administrative",
  sales: "sales",
};

const TYPE_USER_STR = {
  admin: "Quản trị",
  user: "Người dùng",
  administrative: "Quản trị văn phòng",
  sales: "Bán hàng",
};

const PAYMENT_METHODS = {
  cash: "cash",
  credit_card: "credit_card",
  paypal: "paypal",
  bank_transfer: "bank_transfer",
  cod: "cod",
};

const ORDER_STATUS = {
  pending: "pending",
  confirm: "confirm",
  shipped: "shipped",
  delivered: "delivered",
  complete: "complete",
  cancelled: "cancelled",
};

const DELIVERY_STATUS = {
  pending: "pending",
  processing: "processing",
  delivered: "delivered",
  cancelled: "cancelled",
};

const LANGUAGE = {
  en: "en",
  vi: "vi",
  ko: "ko",
  zh: "zh",
  ja: "ja",
};

const FORMAT_BOOK = {
  hardback: "hardback",
  paperback: "paperback",
  ebook: "ebook",
};

const AGE_RANGE = {
  u6: "Dưới 6 tuổi",
  u12: "Dưới 12 tuổi",
  u18: "Dưới 18 tuổi",
  a18: "Hơn 18 tuổi",
};

const BOOK_PRICE_FILTERS = [
  { label: "Dưới 200,000 VNĐ", value: { min: 0, max: 200000 } },
  {
    label: "Từ 200,000 VNĐ đến 500,000 VNĐ",
    value: { min: 200000, max: 500000 },
  },
  {
    label: "Từ 500,000 VNĐ đến 1,000,000 VNĐ",
    value: { min: 500000, max: 1000000 },
  },
  { label: "Trên 1,000,000 VNĐ", value: { min: 1000000, max: Infinity } },
];
module.exports = {
  PASSWORD_DEFAULT,
  TYPE_USER,
  TYPE_USER_STR,
  PAYMENT_METHODS,
  ORDER_STATUS,
  DELIVERY_STATUS,
  TAX_RATE_VAC,
  BOOK_SHOP_EMAIL,
  BOOK_SHOP_PASSWORD,
  htmlContentForConfirmPassword,
  confirmationUrl,
  LANGUAGE,
};
