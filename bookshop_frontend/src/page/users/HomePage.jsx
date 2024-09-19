import { Avatar, Flex, Input, Table, Tooltip } from "antd";
import Title from "../../components/Title/Title";
import { Button } from "antd";
import { PlusCircleFilled, ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getSourceImage } from "../../utils/constans";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      width: 60,
      align: "center",
      render: (photo) => <Avatar src={getSourceImage(photo)} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "left",
      ellipsis: true,
    },
    {},
  ];

  return (
    <div>
      <Title title="Home" />
      <Flex gap={10}>
        <Tooltip title="Recover">
          <Button onClick={() => {}}>
            <ReloadOutlined />
          </Button>
        </Tooltip>
        <Input
          value={keyword}
          placeholder="Search..."
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={() => {}}
        />
        <Button type="primary" icon={<PlusCircleFilled />} onClick={() => {}}>
          Add...
        </Button>
      </Flex>
      <Table
        rowKey={"_id"}
        columns={columns}
        loading={loading}
        dataSource={books}
        pagination={pagination}
        scroll={{ x: 1300, y: 500 }}
        onChange={() => {}}
      />
    </div>
  );
};

export default HomePage;
