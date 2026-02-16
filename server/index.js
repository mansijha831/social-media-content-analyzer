const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./uploads/uploadRoutes");

app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });
