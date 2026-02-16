const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// GET all posts
router.get("/", getPosts);

// POST a new post
router.post("/", createPost);

// UPDATE a post
router.put("/:id", updatePost);

// DELETE a post
router.delete("/:id", deletePost);

module.exports = router;
