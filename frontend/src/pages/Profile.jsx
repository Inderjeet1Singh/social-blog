import React, { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
export default function Profile() {
  const { refreshUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [postUpdating, setPostUpdating] = useState(false);
  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []);
  const fetchProfile = async () => {
    const res = await API.get("/users/profile");
    setProfile(res.data);
    setName(res.data.name);
    setBio(res.data.bio || "");
  };
  const fetchMyPosts = async () => {
    const res = await API.get("/posts/my");
    setPosts(res.data);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("bio", bio);
      if (imageFile) fd.append("image", imageFile);
      await API.put("/users/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshUser();
      await fetchProfile();
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setUpdating(false);
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setName(profile.name);
    setBio(profile.bio || "");
    setImageFile(null);
    setImagePreview(null);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };
  const handleDelete = async (p) => {
    if (!confirm("Delete post?")) return;
    await API.delete(`/posts/${p._id}`);
    fetchMyPosts();
  };
  const openEditModal = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditDescription(post.description || "");
    setShowEditModal(true);
  };
  const updatePost = async () => {
    try {
      setPostUpdating(true);
      await API.put(`/posts/${editingPost._id}`, {
        title: editTitle,
        description: editDescription,
      });
      setShowEditModal(false);
      setEditingPost(null);
      fetchMyPosts();
    } finally {
      setPostUpdating(false);
    }
  };
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <label
              className={`relative block w-32 h-32 rounded-full overflow-hidden border
                ${isEditing ? "cursor-pointer group" : ""}`}
            >
              <img
                src={
                  imagePreview ||
                  profile.image ||
                  "https://via.placeholder.com/120"
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center
                             justify-center text-white text-sm opacity-0
                             group-hover:opacity-100 transition"
                >
                  Change
                </div>
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              )}
            </label>
          </div>
          <div className="flex-1">
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  !isEditing
                    ? "bg-gray-100"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
              <input
                value={profile.email || ""}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100"
              />
              <textarea
                disabled={!isEditing}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={`w-full p-3 border rounded-lg ${
                  !isEditing
                    ? "bg-gray-100"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                placeholder="Bio"
              />
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className={`px-5 py-2 rounded-lg text-white ${
                      updating
                        ? "bg-gray-400"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {updating ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updating}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Posts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <div className="font-semibold text-gray-800">{p.title}</div>
                <div className="text-sm text-gray-500">
                  {p.city} · {p.likes?.length || 0} likes
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Post
            </h3>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={postUpdating}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={updatePost}
                disabled={postUpdating}
                className={`px-4 py-2 rounded-lg text-white ${
                  postUpdating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {postUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
