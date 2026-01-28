import express from "express";
import {
  adminGetAllPosts,
  adminDeletePost,
  adminGetAllUsers,
} from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
const router = express.Router();
router.get("/posts", protect, authorize("admin"), adminGetAllPosts);
router.delete("/posts/:id", protect, authorize("admin"), adminDeletePost);
router.get("/users", protect, authorize("admin"), adminGetAllUsers);
export default router;
