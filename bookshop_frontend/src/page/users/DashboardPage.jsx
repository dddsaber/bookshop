import { Layout, Breadcrumb, Card, Statistic, Row, Col, Table } from "antd";

const { Content, Footer } = Layout;

// Sample table data
const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];

const DashboardPage = () => {
  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Active Users"
                value={1128}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Orders"
                value={93}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Revenue"
                value={21000}
                precision={2}
                valueStyle={{ color: "#1890ff" }}
                prefix="$"
              />
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: "24px" }}>
          <Col span={24}>
            <Card title="Recent Users">
              <Table columns={columns} dataSource={data} />
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        My DashboardPage ©2024 Created with Ant Design
      </Footer>
    </div>
  );
};

export default DashboardPage;
