import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
  toggleLike,
  searchByTitle,
  filterByCity,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";
import { checkPostOwnership } from "../middleware/ownership.js";
import upload from "../utils/multer.js";
const router = express.Router();
router.post("/", protect, upload.single("image"), createPost);
router.get("/", getAllPosts);
router.get("/my", protect, getMyPosts);
router.put(
  "/:id",
  protect,
  checkPostOwnership,
  upload.single("image"),
  updatePost,
);
router.delete("/:id", protect, checkPostOwnership, deletePost);
router.patch("/:id/like", protect, toggleLike);
router.get("/search", searchByTitle);
router.get("/filter", filterByCity);
export default router;
