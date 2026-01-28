import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: "socialblog/users" },
        (err, result) => {
          // This callback won't be used since we will use stream in Promise below
        },
      );
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "socialblog/users" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          stream.end(buffer);
        });

      const result = await streamUpload(req.file.buffer);
      updates.image = result.secure_url;
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
