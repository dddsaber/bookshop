import "./Footer.css"; // Tạo file CSS riêng để quản lý styles

const Footer = () => {
  return (
    <footer className="footer">
      {/* Cột 1: Thông tin công ty */}
      <div className="column">
        <h3>Fahasa.com</h3>
        <p>Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM</p>
        <p>Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA</p>
        <p>60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</p>
        <p>Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi.</p>
        <div className="social-icons">
          <a href="#">
            <img
              src="https://img.icons8.com/ios-glyphs/30/facebook.png"
              alt="Facebook"
            />
          </a>
          <a href="#">
            <img
              src="https://img.icons8.com/ios-glyphs/30/instagram-new.png"
              alt="Instagram"
            />
          </a>
          <a href="#">
            <img
              src="https://img.icons8.com/ios-glyphs/30/youtube-play.png"
              alt="YouTube"
            />
          </a>
        </div>
      </div>

      {/* Cột 2: Dịch vụ */}
      <div className="column">
        <h3>Dịch vụ</h3>
        <a href="#">Điều khoản sử dụng</a>
        <a href="#">Chính sách bảo mật thông tin cá nhân</a>
        <a href="#">Chính sách bảo mật thanh toán</a>
        <a href="#">Giới thiệu Fahasa</a>
        <a href="#">Hệ thống trung tâm - nhà sách</a>
      </div>

      {/* Cột 3: Hỗ trợ */}
      <div className="column">
        <h3>Hỗ trợ</h3>
        <a href="#">Chính sách đổi - trả - hoàn tiền</a>
        <a href="#">Chính sách bảo hành - bồi hoàn</a>
        <a href="#">Chính sách vận chuyển</a>
        <a href="#">Chính sách khách sỉ</a>
      </div>

      {/* Cột 4: Tài khoản của tôi */}
      <div className="column">
        <h3>Tài khoản của tôi</h3>
        <a href="#">Đăng nhập/Tạo mới tài khoản</a>
        <a href="#">Thay đổi địa chỉ khách hàng</a>
        <a href="#">Chi tiết tài khoản</a>
        <a href="#">Lịch sử mua hàng</a>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>
          Giấy chứng nhận Đăng ký Kinh doanh số 0304132047 do Sở Kế hoạch và Đầu
          tư TP.HCM cấp
        </p>
        <div className="payment-methods">
          <img
            src="https://img.icons8.com/ios-glyphs/30/vnpay.png"
            alt="VNPay"
          />
          <img src="https://img.icons8.com/ios-glyphs/30/momo.png" alt="MoMo" />
          <img
            src="https://img.icons8.com/ios-glyphs/30/shopee.png"
            alt="ShopeePay"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
