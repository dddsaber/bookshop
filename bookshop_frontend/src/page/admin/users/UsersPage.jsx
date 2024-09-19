import {
  Avatar,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Title from "../../../components/Title/Title";
import {
  EditOutlined,
  LockOutlined,
  PlusCircleFilled,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getSourceImage, TYPE_USER } from "../../../utils/constans";
import { createUser, getUsers, updateUser } from "../../../api/user.api";
import { Option } from "antd/es/mentions";

const UsersPage = () => {
  const handleTableChange = (pagination, filter) => {
    setPagination(pagination);
    setFilter(() => {
      return {
        userTypes: filter.userTypes,
        activeStatuses: filter.activeStatuse,
      };
    });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (selectedUser) {
          const response = await updateUser({
            ...values,
            _id: selectedUser._id,
          });
          notification.success({ message: "User updated successfully!" });
          console.log(response);
        } else {
          const response = await createUser(values);
          notification.success({ message: "User created successfully!" });
          console.log(response);
        }
        form.resetFields();
        setIsVisible(false);
        setSelectedUser(null);
        setReload(!reload);
      })
      .catch((info) => {
        console.log("Validate Failed: ", info);
      });
  };

  const handleCancel = () => {
    setIsVisible(false);
    setSelectedUser(null);
  };

  const handleResearch = () => {
    setKeyword("");
    setReload(!reload);
  };

  const handleStatus = async (record) => {
    try {
      const user = {
        _id: record._id,
        activeStatus: !record.activeStatus,
      };
      // await changeActiveStatus(user);
      notification.success({
        message: `Tài khoản ${
          user.activeStatus ? "Mở khóa" : "khóa"
        } thành công`,
      });
      setReload(!reload);
    } catch (error) {
      console.log(error);
      notification.error({ message: "Có lỗi xảy ra" });
    }
  };

  const handleEdit = async (record) => {
    try {
      setSelectedUser(record);
      form.setFieldValue({
        ...record,
      });
    } catch (error) {
      console.log(error);
      notification.error({ message: `Failed to load user: ${error}` });
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [filter, setFilter] = useState({
    userTypes: [TYPE_USER.user, TYPE_USER.admin],
    activeStatuses: [true],
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      width: 60,
      key: "avatar",
      render: (avatar) => <Avatar src={getSourceImage(avatar)} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      width: 170,
      key: "name",
    },
    {
      width: 90,
      ellipsis: true,
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      // render: (gender) => {
      //   return Gender[gender];
      // },
    },
    {
      width: 120,
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      width: 150,
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      width: 150,
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        {
          text: "Đang hoạt động",
          value: true,
        },
        {
          text: "Dừng hoạt động",
          value: false,
        },
      ],
      filteredValue: filter.activeStatuses,
      render: (_, { isActive }) => (
        <>
          <Tag color={isActive ? "green" : "red"} key={isActive}>
            {isActive ? "Đang hoạt động" : "Đã khóa"}
          </Tag>
        </>
      ),
    },
    {
      title: "Hành động",
      fixed: "right",
      align: "center",
      width: 150,
      ellipsis: true,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip
            title={
              record?.activeStatus ? "Bạn muốn khóa ?" : "Bạn muốn mở khóa?"
            }
          >
            <Button
              type="text"
              onClick={() => handleStatus(record)}
              icon={
                record?.activeStatus ? <UnlockOutlined /> : <LockOutlined />
              }
            ></Button>
          </Tooltip>
          {record?.userType === TYPE_USER.user ? null : (
            <Tooltip title="Chỉnh sửa thông tin">
              <Button
                type="text"
                onClick={() => handleEdit(record)}
                icon={<EditOutlined />}
              ></Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUsers({
          searchKey: keyword,
          limit: pagination.pageSize,
          skip: pagination.pageSize * (pagination.current - 1),
          ...filter,
        });
        console.log(response);
        const result = response.data;
        console.log(result);
        setUsers(result?.users);
        console.log(users);
        setPagination({
          ...pagination,
          total: result?.total,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [reload, pagination.page, filter]);

  // Search data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUsers({
          searchKey: keyword,
          limit: pagination.pageSize,
          skip: pagination.pageSize * (pagination.current - 1),
          ...filter,
        });
        const result = response.data;
        setUsers(result?.users);
        setPagination({
          ...pagination,
          total: result?.total,
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [reload, pagination.page, filter]);

  return (
    <div>
      <Title title="Manage Accounts" />
      <Flex gap={10} justify="space-between" style={{ marginBottom: 10 }}>
        <Flex>
          <Tooltip title="Recover">
            <Button onClick={() => {}}>
              <ReloadOutlined />
            </Button>
          </Tooltip>
          <Input
            value={keyword}
            placeholder="Search..."
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => setReload(!reload)}
          />
          <Button type="primary" onClick={() => setReload(!reload)}>
            <SearchOutlined />
          </Button>
        </Flex>
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={() => setIsVisible(true)}
        >
          Add...
        </Button>
      </Flex>
      <Table
        rowKey={"_id"}
        loading={loading}
        columns={columns}
        dataSource={users}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: "max-content", y: 500 }}
      />
      <Modal
        open={isVisible}
        title={selectedUser ? "Update user" : "Add user"}
        onOk={handleOk}
        onText={selectedUser ? "Update" : "Add"}
        cancelText="Cancel"
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          form={form}
          name="addUserForm"
          initialValues={{}}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập đúng format!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker format="DD/MM/YYYY" placeholder="Ngày sinh" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng giới tính!" }]}
          >
            <Select style={{ width: 100 }}>
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: new RegExp(/^\d{10,12}$/),
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
