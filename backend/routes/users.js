import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from "../utils/multer.js";
const router = express.Router();
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("image"), updateProfile);
export default router;
