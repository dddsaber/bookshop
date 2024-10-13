import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { getSourceBookImage } from "../../../utils/image";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Title from "../../../components/Title/Title";
import {
  getCategoriesOnIds,
  getCategoriesOnParentId,
} from "../../../api/category.api";
import {
  AGE_RANGE_STR,
  FORMAT_BOOK_STR,
  LANGUAGE_STR,
} from "../../../utils/constans";
import { uploadFileBook, uploadFilesBook } from "../../../api/file.api";
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "../../../api/book.api";

const BooksPage = () => {
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(false);
  const [form] = Form.useForm();
  const [selectedBook, setSelectedBook] = useState();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [categoriesLv1, setCategoriesL1] = useState([]);
  const [categoriesLv2, setCategoriesL2] = useState([]);
  const [categoriesLv3, setCategoriesL3] = useState([]);
  const [selectedCategoriesLv1, setSelectedCategoriesLv1] = useState([]);
  const [selectedCategoriesLv2, setSelectedCategoriesLv2] = useState([]);

  const [reload, setReload] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [filter, setFilter] = useState({
    price_low: 0,
    price_high: 10000000,
    isDeleted: false,
  });

  useEffect(() => {
    const fetchCategoryLv1 = async () => {
      try {
        const response = await getCategoriesOnParentId({ parentId: null });
        const result = response.data;
        setCategoriesL1(result);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchCategoryLv1();
  }, [reload]);
  useEffect(() => {
    const fetchCategoryLv2 = async () => {
      try {
        const response = await getCategoriesOnParentId({
          parentId: selectedCategoriesLv1,
        });
        const result = response.data;
        setCategoriesL2(result);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchCategoryLv2();
  }, [reload, selectedCategoriesLv1]);
  useEffect(() => {
    const fetchCategoryLv3 = async () => {
      try {
        const response = await getCategoriesOnParentId({
          parentId: selectedCategoriesLv2,
        });
        const result = response.data;
        setCategoriesL3(result);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchCategoryLv3();
  }, [reload, selectedCategoriesLv2]);

  // Fetch books
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getBooks({
          searchKey: keyword,
          limit: pagination.pageSize,
          skip: pagination.pageSize * (pagination.current - 1),
          ...filter,
        });
        const result = response.data;
        console.log(result);
        setBooks(result?.books);
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
  }, [reload, pagination.pageSize, filter]);

  const handleDeleteBook = async (record) => {
    const deletedRecord = await deleteBook(record._id);
    if (deletedRecord.status) {
      notification.success({
        message: "Xóa thành công",
        description: "Sách đã được xóa thành công.",
      });
      setReload(true);
    } else {
      notification.error({
        message: "Xóa thất bại",
        description: "Có lỗi xảy ra khi xóa sách.",
      });
    }
  };
  const handleEditBook = async (record) => {
    try {
      const updatedCategories = record.categories.map(
        (category) => category._id
      );

      const parentIdsLv2 = record.categories.map(
        (category) => category.parentId
      );

      const categoriesLv2 = (await getCategoriesOnIds(parentIdsLv2)).data;

      const parentIdsLv1 = categoriesLv2.map((category) => category.parentId);

      const categoriesLv1 = (await getCategoriesOnIds(parentIdsLv1)).data;

      setSelectedCategoriesLv1(categoriesLv1.map((category) => category._id)); // Set lại giá trị

      setCategoriesL2(categoriesLv2);
      setSelectedCategoriesLv2(categoriesLv2.map((category) => category._id)); // Set lại giá trị

      const updatedRecord = {
        ...record,
        categories: updatedCategories,
        categoriesLv1: categoriesLv1.map((category) => category._id),
        categoriesLv2: categoriesLv2.map((category) => category._id),
      };

      setSelectedBook(updatedRecord);

      // Set lại tất cả các trường trong form bao gồm cả categoriesLv1, categoriesLv2 và categories
      form.setFieldsValue({
        ...record,
        categoriesLv1: categoriesLv1.map((category) => category._id),
        categoriesLv2: categoriesLv2.map((category) => category._id),
        categories: updatedCategories,
      });

      setIsVisible(true);
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error updating book." });
    }
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      if (coverImage) {
        const coverImageResponse = await uploadFileBook(coverImage);
        if (coverImageResponse.status) {
          values.coverPhoto = coverImageResponse.data.image_name;
        }
      }
      if (images.length > 0) {
        const imgResponse = await uploadFilesBook(images);
        if (imgResponse && imgResponse.status) {
          if (Array.isArray(imgResponse.data?.files)) {
            values.photos = imgResponse.data.files.map(
              (file) => file.image_name
            );
            setImages([]);
            console.log(values);
          } else {
            console.error("Không có files hợp lệ trong imgResponse.data.");
          }
        }
      }
      // eslint-disable-next-line no-unused-vars
      const { categoriesLv1, categoriesLv2, ...sendValues } = values;

      if (selectedBook) {
        const response = await updateBook({
          ...sendValues,
          _id: selectedBook._id,
        });
        if (response && response.status) {
          notification.success({ message: "Book updated successfully!" });
        }
      } else {
        const response = await createBook(sendValues);
        if (response && response.status) {
          notification.success({ message: "Book created successfully!" });
        }
      }
      form.resetFields();
      setIsVisible(false);
      setSelectedBook(null);
      setReload(!reload);
    });
  };
  const imageHandler = (e) => {
    const fileList = [...e.target.files];
    setImages(fileList);
  };
  const coverImageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };
  const handleResearch = () => {
    setKeyword("");
    setReload(!reload);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setSelectedBook(null);
  };
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
      title: "Photo",
      dataIndex: "coverPhoto",
      key: "coverPhoto",
      width: 120,
      align: "center",
      render: (coverPhoto) => <Image src={getSourceBookImage(coverPhoto)} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 150,
      align: "left",
      ellipsis: true,
    },
    {
      title: "Giá nhập",
      dataIndex: "costPrice",
      key: "costPrice",
      width: 120,
      align: "right",
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "right",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      width: 100,
      align: "center",
      render: (discount) => `${discount * 100}%`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center",
    },
    {
      title: "Thể loại",
      dataIndex: "categories",
      key: "categories",
      width: 120,
      align: "left",
      ellipsis: true,
      render: (categories) =>
        categories.map((category) => category.name).join("\n"),
    },
    {
      title: "Tác giả",
      dataIndex: "authors",
      key: "authors",
      width: 150,
      align: "left",
      ellipsis: true,
      render: (authors) => authors.map((author) => author.name).join("\n"),
    },
    {
      title: "Giới thiệu",
      dataIndex: "description",
      key: "description",
      width: 300,
      align: "left",
      ellipsis: true,
      render: (text) => (
        <div
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 4, // Giới hạn số dòng là 4
            whiteSpace: "normal",
          }}
        >
          {text}
        </div>
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
          <Tooltip title="Edit Information">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditBook(record)}
            ></Button>
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn xóa?"
            onConfirm={() => handleDeleteBook(record)}
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <Title title="Manage Books" />
      <Flex gap={10} justify="space-between" style={{ marginBottom: 10 }}>
        <Flex>
          <Tooltip title="Refesh">
            <Button onClick={handleResearch}>
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
        <Button type="primary" onClick={() => setIsVisible(true)}>
          <PlusOutlined /> Add Book
        </Button>
      </Flex>
      <Table
        rowKey="_id"
        columns={columns}
        loading={loading}
        dataSource={books}
        pagination={pagination}
        scroll={{ x: "max-content", y: 500 }}
      />
      <Modal
        open={isVisible}
        title={selectedBook ? "Update book" : "Add book"}
        onText={selectedBook ? "Update" : "Add"}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        cancelText="Cancel"
        style={{ top: 10, width: 700 }}
        width={700}
      >
        <Form
          form={form}
          name="addBookForm"
          initialValues={{}}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 0 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Title must be provided",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Cost Price"
            name="costPrice"
            rules={[
              {
                required: true,
                message: "Cost Price must be provided",
              },
              {
                type: "number",
                min: 0,
                message: "Cost Price must be a positive number",
              },
            ]}
          >
            <InputNumber step={1000} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Price must be provided",
              },
              {
                type: "number",
                min: 0,
                message: "Price must be a positive number",
              },
            ]}
          >
            <InputNumber step={1000} />
          </Form.Item>
          <Form.Item
            label="Discount "
            name="discount"
            rules={[
              {
                type: "number",
                min: 0,
                max: 1,
                message: "Price must be a >= 0 adn <= 1",
              },
            ]}
          >
            <InputNumber step={0.01} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Quantity must be a positive number",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="Categories Lv1" name="categoriesLv1">
            <Select
              mode="multiple"
              placeholder="Select categories"
              onChange={setSelectedCategoriesLv1}
              filterOption={(input, categoriesLv1) =>
                categoriesLv1.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              } // Cập nhật state
            >
              {categoriesLv1.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Categories Lv2" name="categoriesLv2">
            <Select
              mode="multiple"
              placeholder="Select categories"
              onChange={setSelectedCategoriesLv2}
              filterOption={(input, categoriesLv2) =>
                categoriesLv2.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {categoriesLv2.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Categories Lv3" name="categories">
            <Select
              mode="multiple"
              placeholder="Select categories"
              filterOption={(input, categoriesLv3) =>
                categoriesLv3.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {categoriesLv3.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Language" name="language">
            <Select mode="multiple" placeholder="Select languages">
              {LANGUAGE_STR.map((lang) => (
                <Select.Option key={lang.code} value={lang.code}>
                  {lang.str}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Format" name="format">
            <Select mode="multiple" placeholder="Select format">
              {FORMAT_BOOK_STR.map((fbs) => (
                <Select.Option key={fbs.code} value={fbs.code}>
                  {fbs.str}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Age Range" name="ageRange">
            <Select placeholder="Select languages">
              {AGE_RANGE_STR.map((age) => (
                <Select.Option key={age.code} value={age.code}>
                  {age.str}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Weight"
            name="weight"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Weight must be a positive number",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Pages"
            name="pages"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Pages must be a positive number",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Heigh"
            name="heigh"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Heigh must be a positive number",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Width"
            name="width"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Width must be a positive number",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Form>
        <span>Main image:</span>
        <Input type="file" onChange={coverImageHandler} name="coverPhoto" />
        <span>Side images:</span>
        <Input type="file" onChange={imageHandler} name="photos" multiple />
      </Modal>
    </div>
  );
};

export default BooksPage;
