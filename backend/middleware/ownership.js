import Post from "../models/Post.js";
export const checkPostOwnership = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not owner" });
  }
  req.post = post;
  next();
};
