import Post from "../models/Post.js";
import cloudinary from "../utils/cloudinary.js";
export const createPost = async (req, res, next) => {
  try {
    const { title, description, city, tags } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });
    if (!req.file) return res.status(400).json({ message: "Image required" });
    let imageUrl = "";
    if (req.file) {
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "socialblog/posts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          stream.end(buffer);
        });
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const tagsArray = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim())
      : [];

    const post = await Post.create({
      title,
      description,
      city,
      tags: tagsArray,
      image: imageUrl,
      author: req.user._id,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, description, city, tags } = req.body;
    const post = req.post;
    if (title) post.title = title;
    if (description) post.description = description;
    if (city) post.city = city;
    if (tags)
      post.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim());

    if (req.file) {
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "socialblog/posts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          stream.end(buffer);
        });
      const result = await streamUpload(req.file.buffer);
      post.image = result.secure_url;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = req.post;
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    const liked = post.likes.some((id) => id.toString() === userId);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ liked: !liked, likesCount: post.likes.length });
  } catch (err) {
    next(err);
  }
};

export const searchByTitle = async (req, res, next) => {
  try {
    const { title } = req.query;
    if (!title) return res.json([]);
    const posts = await Post.find({ title: { $regex: title, $options: "i" } })
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const filterByCity = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) return res.json([]);
    const posts = await Post.find({
      city: { $regex: `^${city}$`, $options: "i" },
    })
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};
