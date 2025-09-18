const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectdb = require("./config/dbConnection.js");

// Cloudinary + Multer
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

// Load env
dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // update this with your frontend domain in prod
  },
});

// Connect Mongo
connectdb();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config (store in memory or tmp dir)
const storage = multer.diskStorage({});
const upload = multer({ storage });

const port = process.env.PORT || 3001;

// Routes
app.use(express.json());
app.use(cors());

app.use("/send-bill-email", require("./routes/sendBill"));
app.use("/api/reports", require("./routes/reportRoutes"));

require("./models/restaurantModel.js");
require("./models/orderModel.js");
require("./models/activityModel.js");

app.get("/", (req, res) => {
  res.send("Food App");
});

app.use("/auth", require("./routes/authroutes.js"));
app.use("/orders", require("./routes/orderRoutes.js")(io)); // pass io
app.use("/menu", require("./routes/menuRoutes.js"));
app.use("/insights", require("./routes/insightsRoutes"));
app.use("/activities", require("./routes/activityRoutes"));
app.use("/", require("./routes/settingsRoutes.js"));
app.use("/api/restaurant", require("./routes/restaurantRoutes.js"));

// ✅ Cloudinary Upload Route
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "baootamadu",
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.IO connection listener
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
