import {
  EditOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, List, Progress, Rate, Row } from "antd";
import { useState } from "react";
const reviewData = [
  { stars: 5, percent: 80 },
  { stars: 4, percent: 0 },
  { stars: 3, percent: 10 },
  { stars: 2, percent: 0 },
  { stars: 1, percent: 10 },
];
const allReviews = [
  {
    name: "Lê Hoa",
    updatedAt: "25/01/2024",
    rating: 5,
    content: "Quyển sách này đã khiến mình rơi nước mắt nhiều lần. ...",
    likes: 0,
  },
  {
    name: "Le******",
    updatedAt: "25/01/2024",
    rating: 1,
    content: "Quyển sách này đã khiến mình rơi nước mắt nhiều lần. ...",
    likes: 1,
  },
  {
    name: "Ma******",
    updatedAt: "25/01/2024",
    rating: 5,
    content: "Quyển sách này đã khiến mình rơi nước mắt nhiều lần. ...",
    likes: 2,
  },
];
const BookReview = () => {
  const totalReviews = 10; // Tổng số đánh giá
  const rating = 4.4; // Điểm đánh giá trung bình
  const [reviews, setReviews] = useState(allReviews);
  const [selectedTab, setSelectedTab] = useState("newest");

  const handleSort = (sortType) => {
    setSelectedTab(sortType);
    if (sortType === "newest") {
      const sortByNewest = [...allReviews].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setReviews(sortByNewest);
    } else if (sortType === "favorite") {
      const sortByFavorite = [...allReviews].sort((a, b) => b.likes - a.likes);
      setReviews(sortByFavorite);
    }
  };

  return (
    <Card
      style={{ backgroundColor: "#fff", borderRadius: 10 }}
      title={"Đánh giá sản phẩm"}
    >
      <Row gutter={16}>
        <Col span={6}>
          <h1>{rating}/5</h1>
          <Rate
            disabled
            defaultValue={4.4}
            allowHalf
            style={{ fontSize: 24 }}
          />
          <p>({totalReviews} đánh giá)</p>
        </Col>
        <Col span={12}>
          {reviewData.map((review) => (
            <Row
              key={review.stars}
              align="middle"
              style={{ marginBottom: "8px" }}
            >
              <Col span={4}>{review.stars} sao</Col>
              <Col span={16}>
                <Progress
                  percent={review.percent}
                  strokeColor="#fadb14" // Màu vàng cho thanh progress
                  showInfo={false}
                />
              </Col>
              <Col span={4}>{review.percent}%</Col>
            </Row>
          ))}
        </Col>
        <Col span={6} style={{ textAlign: "right" }}>
          <Button type="primary" icon={<EditOutlined />} danger>
            Viết đánh giá
          </Button>
        </Col>
      </Row>
      <div style={{ marginTop: "20px" }}>
        <Button
          type="link"
          onClick={() => handleSort("newest")}
          style={{ color: selectedTab === "newest" ? "red" : "black" }}
        >
          Mới nhất
        </Button>
        <Button
          type="link"
          onClick={() => handleSort("favorite")}
          style={{ color: selectedTab === "favorite" ? "red" : "black" }}
        >
          Yêu thích nhất
        </Button>
        <hr />
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item
              key={item.name}
              actions={[
                <Button
                  key={"like"}
                  type="text"
                  icon={item.likes > 0 ? <LikeFilled /> : <LikeOutlined />}
                >
                  Thích ({item.likes})
                </Button>,
                <Button key={"message"} type="text" icon={<MessageOutlined />}>
                  Báo cáo
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span>
                    {item.name}{" "}
                    <Rate
                      disabled
                      defaultValue={item.rating}
                      style={{ fontSize: 16 }}
                    />
                  </span>
                }
                description={item.date}
              />
              <div>{item.content}</div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default BookReview;
