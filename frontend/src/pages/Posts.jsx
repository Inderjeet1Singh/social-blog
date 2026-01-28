import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import { AuthContext } from "../context/AuthContext";
export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user, refreshUser } = useContext(AuthContext);
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const handleLike = async (post) => {
    await API.patch(`/posts/${post._id}/like`);
    fetchPosts();
    if (user) refreshUser();
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("city", formData.city);
      fd.append("tags", formData.tags);
      if (imageFile) fd.append("image", imageFile);
      await API.post("/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      fetchPosts();
    } finally {
      setUploading(false);
    }
  };
  const resetForm = () => {
    setFormData({ title: "", description: "", city: "", tags: "" });
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="mt-16 sm:mt-0">
          <h2 className="text-3xl font-bold">Posts</h2>
          <p className="text-gray-500">Explore posts shared by the community</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Create Post
          </button>
        )}
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-6">Create New Post</h3>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer relative h-80 bg-gray-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-medium">Upload Image</div>
                    <div className="text-sm mt-1">Click to choose image</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <div className="space-y-4">
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Title"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                  placeholder="City"
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value,
                    })
                  }
                  placeholder="Tags (comma separated)"
                  className="w-full p-3 border rounded-lg"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    disabled={uploading}
                    className={`px-6 py-2 rounded-lg text-white ${
                      uploading
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 rounded-lg bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))
          : posts.map((p) => (
              <PostCard
                key={p._id}
                post={p}
                onLike={handleLike}
                currentUserId={user?._id}
              />
            ))}
      </div>
      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Be the first one to create a post</p>
        </div>
      )}
    </div>
  );
}
