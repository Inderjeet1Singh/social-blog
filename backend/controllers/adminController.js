import Post from "../models/Post.js";
import User from "../models/User.js";

export const adminGetAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email role image")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const adminDeletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await post.deleteOne();
    res.json({ message: "Post deleted by admin" });
  } catch (err) {
    next(err);
  }
};

export const adminGetAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};
