import {
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
  Modal,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import AddressComponent from "../../components/Map/Address";
import { getSourceUserImage } from "../../utils/image";
import { uploadFileUser } from "../../api/file.api";
import { updateUser } from "../../api/user.api";
import "./ProfilePage.css";
import { changePassword } from "../../api/auth.api";
const { Title } = Typography;
const { Option } = Select;

const ProfilePage = () => {
  const user = useSelector((state) => state.auth?.user);
  const [avatar, setAvatar] = useState(null);
  const [address, setAddress] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const handleAddressData = (data) => {
    setAddress(data);
  };
  const avatarHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleChangePassword = async () => {
    form.validateFields().then(async (values) => {
      if (values.newPassword !== values.newPasswordConfirm) {
        notification.error({
          message: "Mật khẩu mới và xác nhận mật khẩu phải giống nhau!",
        });
        return;
      }
      const response = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        userId: user._id,
      });
      if (response.status) {
        notification.success({ message: "Mật khẩu đã được thay đoi!" });
      } else {
        notification.error({ message: response.message });
      }
      setIsVisible(false);
    });
  };

  const onFinish = async (values) => {
    try {
      if (avatar) {
        const avatarResponse = await uploadFileUser(avatar);
        if (avatarResponse.status) {
          values.avatar = avatarResponse.data.image_name;
        }
      }

      if (address) {
        values.address = address;
      }
      const response = await updateUser({
        _id: user._id,
        ...values,
      });
      if (response.status) {
        notification.success({ message: "Thông tin đã được cập nhật!" });
      } else {
        notification.error({
          message: "Có l��i xảy ra khi cập nhật thông tin!",
        });
      }
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      notification.error({
        message: `Có loi xảy ra:${error}`,
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        {!isEditing ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div className="image">
                  <div className="circle-1"></div>
                  <div className="circle-2"></div>
                  <Avatar
                    className="avatar"
                    size={200}
                    src={getSourceUserImage(user.avatar)}
                  />
                </div>
              </Col>
              <Col span={8}>
                <Title level={3}>{user.name}</Title>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <strong>Gender:</strong> {user.gender ? "Nam" : "Nữ"}
                </p>
                <p>
                  <strong>Birthday:</strong>{" "}
                  {dayjs(user.birthday).format("DD/MM/YYYY")}
                </p>
                <p>
                  <strong>User Type:</strong> {user.userType}
                </p>
                <p>
                  <strong>Status:</strong> {user.status}
                </p>
              </Col>
              <Col span={8}>
                <Title level={3}>Description</Title>
                <p>{user.description}</p>
                <Title level={4}>Address</Title>
                <p>
                  {user.address?.detail}, {user.address?.ward},{" "}
                  {user.address?.district}, {user.address?.province}
                </p>
              </Col>
            </Row>
            <Divider />
            <Button
              type="primary"
              onClick={() => setIsEditing(true)}
              style={{ float: "right", marginRight: "20px" }}
            >
              Chỉnh sửa thông tin
            </Button>
            <Button
              type="primary"
              onClick={() => setIsVisible(true)}
              style={{ float: "right", marginRight: "20px" }}
            >
              Thay đổi mật khẩu
            </Button>
            <Modal
              open={isVisible}
              title="Thay doi mat khau"
              onOk={handleChangePassword}
              onCancel={() => setIsVisible(false)}
              destroyOnClose
              style={{ top: 10, width: 700 }}
            >
              <Form
                form={form}
                name="changePasswordForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ marginTop: 0 }}
              >
                <Form.Item
                  label="Old password"
                  name="oldPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]}
                >
                  <Input type="password" />
                </Form.Item>
                <Form.Item
                  label="New password"
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]}
                >
                  <Input type="password" />
                </Form.Item>
                <Form.Item
                  label="Confirm new password"
                  name="newPasswordConfirm"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]}
                >
                  <Input type="password" />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        ) : (
          <Form
            layout="vertical"
            initialValues={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              gender: user.gender,
              birthday: dayjs(user.birthday),
              address: user.address,
              description: user.description,
            }}
            onFinish={onFinish}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone">
                  <Input />
                </Form.Item>
                <Form.Item label="Giới tính" name="gender">
                  <Select>
                    <Option value={true}>Nam</Option>
                    <Option value={false}>Nữ</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Ngày sinh" name="birthday">
                  <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <br />
                <AddressComponent sendData={handleAddressData} />
                <br />
                <Form.Item label="Mô tả" name="description">
                  <Input.TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
                </Form.Item>
                <span>Avatar:</span>
                <Input type="file" onChange={avatarHandler} name="avatar" />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <Button type="primary" htmlType="submit">
                  Lưu thông tin
                </Button>
                <Button
                  style={{ marginLeft: "10px" }}
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
