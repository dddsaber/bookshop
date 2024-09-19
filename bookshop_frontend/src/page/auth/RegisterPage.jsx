import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerAuth } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    values.phone = values.phone.trim();
    values.email = values.email.trim();
    const { user } = await dispatch(registerAuth(values)).unwrap();
    if (!user) {
      alert("Register failed");
      return;
    }
    alert("Register successful");
    navigate("/home");
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
          name="register"
          className="register-form"
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
            Register
          </Typography.Title>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Phone must be provided!",
              },
              {
                message: "Invalid phone number format",
                pattern: /^[0-9]{1,3}\s?[0-9]{1,15}$/,
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icons" />}
              placeholder="Enter Your Phone Number"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                message: "Invalid Email!",
                type: "email",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icons" />}
              placeholder="Enter your email address"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Password must be provided!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
            hasFeedback
          >
            <Input
              size="large"
              prefix={<LockOutlined className="site-form-item-icons" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Confirm Password must be provided!",
              },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  value === getFieldValue("password")
                    ? Promise.resolve()
                    : Promise.reject("Passwords do not match!"),
              }),
            ]}
          >
            <Input
              size="large"
              prefix={<LockOutlined className="site-form-item-icons" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="agreement" valuePropName="checked">
              <Checkbox>
                I have read and agree to the terms and conditions
              </Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{ marginBottom: 10 }}
              className="login-form-button"
            >
              Register
            </Button>
            <Space block>
              <Link to="/login">Already have account</Link>
            </Space>
            <Space block>
              <Link to="/forgot-password">Forgot password?</Link>
            </Space>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default RegisterPage;
