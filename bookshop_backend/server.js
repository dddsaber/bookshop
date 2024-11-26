require("dotenv").config();
const config = require("./src/config/connect");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connect } = require("mongoose");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { CreateChat } = require("./src/controllers/chat/chat.controller");
const logVisit = require("./src/controllers/visit.controller");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logVisit);
app.use(
  cors({
    origin: "*",
  })
);

// Add Routes
const authRouter = require("./src/routers/auth.routes");
const authorRouter = require("./src/routers/author.routes");
const bookRouter = require("./src/routers/book.routes");
const cartRouter = require("./src/routers/cart.routes");
const categoryRouter = require("./src/routers/category.routes");
const deliveryRouter = require("./src/routers/delivery.routes");
const invoiceRouter = require("./src/routers/invoice.routes");
const orderRouter = require("./src/routers/order.routes");
const publisherRouter = require("./src/routers/publisher.routes");
const reviewRouter = require("./src/routers/review.routes");
const userRouter = require("./src/routers/user.routes");
const conversationRouter = require("./src/routers/conversation.routes");
const chatRouter = require("./src/routers/chat.routes");
const fileRouter = require("./src/routers/file.routes");
const couponRouter = require("./src/routers/coupon.routes");
app.use("/auth", authRouter);

app.use("/author", authorRouter);

app.use("/book", bookRouter);

app.use("/cart", cartRouter);

app.use("/category", categoryRouter);

app.use("/delivery", deliveryRouter);

app.use("/invoice", invoiceRouter);

app.use("/order", orderRouter);

app.use("/publisher", publisherRouter);

app.use("/review", reviewRouter);

app.use("/user", userRouter);

app.use("/coupon", couponRouter);

app.use("/conversation", conversationRouter);

app.use("/chat", chatRouter);

app.use("/upload", fileRouter);

// Serve static images
app.use("/upload", express.static("upload"));

// Start Server
async function startServer() {
  try {
    connect(config.db.uri)
      .then(() => {
        console.log("Database connection established!");
      })
      .catch((error) => {
        console.log("Database connection error!", error);
        process.exit(1);
      });
    app.listen(config.app.port, () => {
      console.log(`Server is running at http://localhost:${config.app.port}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit(1);
  }
}

startServer();
