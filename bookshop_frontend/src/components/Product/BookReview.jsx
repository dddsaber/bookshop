import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  List,
  Progress,
  Rate,
  Row,
  message,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  createReview,
  deleteReview,
  getReviewsByBookId,
  updateReview,
} from "../../api/review.api";
import PropTypes from "prop-types";

const { TextArea } = Input;

const BookReview = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("newest");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const user = useSelector((state) => state.auth.user); // Lấy thông tin user từ Redux

  const calculateReviewData = (reviews) => {
    const totalReviews = reviews.length;
    const ratingCounts = [0, 0, 0, 0, 0];

    reviews.forEach((review) => {
      ratingCounts[review.rating - 1]++;
    });

    const reviewStats = ratingCounts.map((count, index) => ({
      rating: index + 1,
      percent:
        totalReviews === 0 ? 0 : Math.round((count / totalReviews) * 100),
    }));

    const avgRating =
      totalReviews === 0
        ? 0
        : (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1);

    return { reviewStats, avgRating, totalReviews };
  };

  const fetchData = async () => {
    try {
      const response = await getReviewsByBookId(bookId);
      setReviews(response.data);

      const { reviewStats, avgRating, totalReviews } = calculateReviewData(
        response.data
      );
      setReviewData({
        stats: reviewStats,
        avgRating,
        totalReviews,
      });
    } catch (error) {
      console.error("Error fetching reviews", error);
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddComment = async () => {
    if (!newComment || newRating === 0) {
      message.warning("Vui lòng nhập nội dung và đánh giá!");
      return;
    }

    if (editingReview) {
      // Cập nhật đánh giá
      try {
        const updatedReview = {
          ...editingReview,
          userId: editingReview.userId._id,
          content: newComment,
          rating: newRating,
          updatedAt: new Date().toISOString(),
          _id: editingReview._id,
        };

        const response = await updateReview(updatedReview);

        if (!response.status) {
          notification.error({
            message: "Có lỗi xảy ra khi cập nhật đánh giá!",
            description: response.message,
          });
          return;
        }

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === editingReview._id ? updatedReview : review
          )
        );

        const updatedStats = calculateReviewData(
          reviews.map((review) =>
            review._id === editingReview._id ? updatedReview : review
          )
        );
        setReviewData(updatedStats);

        notification.success({ message: "Đánh giá đã được cập nhật!" });
      } catch (error) {
        notification.error({ message: `Có lỗi xảy ra: ${error}` });
      }
    } else {
      // Tạo mới đánh giá
      const newReview = {
        userId: user?._id,
        bookId: bookId,
        updatedAt: new Date().toISOString(),
        rating: newRating,
        content: newComment,
      };

      const response = await createReview(newReview);
      if (!response.status) {
        notification.error({
          message: "Có lỗi xảy ra khi tạo đánh giá!",
          description: response.message,
        });
        return;
      }

      notification.success({ message: "Đánh giá đã được gửi!" });
      newReview.userId = { name: user.name, _id: user._id };
      setReviews((prev) => [newReview, ...prev]);
      const updatedStats = calculateReviewData([newReview, ...reviews]);
      setReviewData(updatedStats);
    }

    setNewComment("");
    setNewRating(0);
    setEditingReview(null);
  };

  const handleSort = (sortType) => {
    setSelectedTab(sortType);
    if (sortType === "newest") {
      const sortByNewest = [...reviews].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setReviews(sortByNewest);
    } else if (sortType === "favorite") {
      const sortByFavorite = [...reviews].sort((a, b) => b.rating - a.rating);
      setReviews(sortByFavorite);
    }
  };

  const handleEditReview = (reviewId) => {
    const reviewToEdit = reviews.find((review) => review._id === reviewId);
    if (reviewToEdit) {
      setEditingReview(reviewToEdit);
      setNewComment(reviewToEdit.content);
      setNewRating(reviewToEdit.rating);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await deleteReview(reviewId);
      if (!response.status) {
        notification.error({
          message: "Có lỗi xảy ra khi xóa đánh giá!",
          description: response.message,
        });
        return;
      }
      notification.success({
        message: "Đánh giá đã được xóa!",
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
      const updatedStats = calculateReviewData(
        reviews.filter((review) => review._id !== reviewId)
      );
      setReviewData(updatedStats);
    } catch (error) {
      notification.error({
        message: `Có lỗi xảy ra: ${error}`,
      });
    }
  };

  return (
    <Card
      style={{ backgroundColor: "#fff", borderRadius: 10 }}
      title={"Đánh giá sản phẩm"}
    >
      <Row gutter={16}>
        <Col span={6}>
          <h1>{reviewData.avgRating || 0}/5</h1>
          <Rate
            disabled
            value={parseFloat(reviewData.avgRating) || 0}
            allowHalf
            style={{ fontSize: 24 }}
          />
          <p>({reviewData.totalReviews || 0} đánh giá)</p>
        </Col>
        <Col span={12}>
          {reviewData.stats?.map((review) => (
            <Row
              key={review.rating}
              align="middle"
              style={{ marginBottom: "8px" }}
            >
              <Col span={4}>{review.rating} sao</Col>
              <Col span={16}>
                <Progress
                  percent={review.percent}
                  strokeColor="#fadb14"
                  showInfo={false}
                />
              </Col>
              <Col span={4}>{review.percent}%</Col>
            </Row>
          ))}
        </Col>
        <Col span={6} style={{ textAlign: "right" }}></Col>
      </Row>

      <div style={{ marginTop: "20px" }}>
        <h3>{editingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}</h3>
        <Rate
          value={newRating}
          onChange={(value) => setNewRating(value)}
          style={{ fontSize: 24 }}
        />
        <TextArea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập nội dung bình luận..."
          style={{ margin: "10px 0" }}
        />
        <Button type="primary" onClick={handleAddComment}>
          {editingReview ? "Cập nhật" : "Gửi bình luận"}
        </Button>
        {editingReview && (
          <Button
            type="link"
            onClick={() => {
              setNewComment("");
              setNewRating(0);
              setEditingReview(null);
            }}
          >
            Hủy
          </Button>
        )}
      </div>

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
          rowKey={(record) => record._id}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              actions={
                item.userId._id === user?._id
                  ? [
                      <Button
                        key="edit"
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => handleEditReview(item._id)}
                      >
                        Sửa
                      </Button>,
                      <Button
                        key="delete"
                        icon={<DeleteOutlined />}
                        danger
                        type="link"
                        onClick={() => handleDeleteReview(item._id)}
                      >
                        Xóa
                      </Button>,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                title={
                  <div>
                    <span style={{ fontWeight: "bold" }}>
                      {item.userId.name}
                    </span>{" "}
                    - {new Date(item.updatedAt).toLocaleString()}
                  </div>
                }
                description={
                  <Rate disabled value={item.rating} style={{ fontSize: 16 }} />
                }
              />
              <p>{item.content}</p>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

BookReview.propTypes = {
  bookId: PropTypes.string.isRequired,
};

export default BookReview;
