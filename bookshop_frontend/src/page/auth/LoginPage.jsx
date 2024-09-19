import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAuth } from "../../redux/slices/authSlice";
import { TYPE_USER } from "../../utils/constans";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    values.identifier = values.identifier.trim();
    const { user } = await dispatch(loginAuth(values)).unwrap();

    switch (user?.userType) {
      case TYPE_USER.admin:
        navigate("/users");
        break;
      case TYPE_USER.user:
        navigate("/home");
        break;
      default:
        navigate("/login", { replace: true });
    }
  };
  return (
    <div>
      <Flex
        justify="center"
        align="center"
        style={{
          width: "100%",
          height: "90vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          style={{
            width: "450px",
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: "20px",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography.Title level={3} style={{ textAlign: "center" }}>
            Login
          </Typography.Title>
          <Form.Item
            name="identifier"
            rules={[
              {
                required: true,
                message: "Phone/Email must be provided",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icons" />}
              placeholder="Phone/Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Password must be provided",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icons" />}
              placeholder="Password"
              type="password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ marginBottom: 10 }}
              block
            >
              Log in
            </Button>
            <Space>
              <Link to="/forgot-password">Forgot password?</Link>
            </Space>
            <Space>
              <Checkbox style={{ marginTop: 10 }}>Remember me</Checkbox>
            </Space>
            <Space>
              <Link to="/register">Register now!</Link>
            </Space>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default LoginPage;
