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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
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
    try {
      setLoadingProfile(true);
      const res = await API.get("/users/profile");
      setProfile(res.data);
      setName(res.data.name);
      setBio(res.data.bio || "");
    } finally {
      setLoadingProfile(false);
    }
  };
  const fetchMyPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await API.get("/posts/my");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoadingPosts(false);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("bio", bio);
      if (imageFile) fd.append("image", imageFile);

      await API.put("/users/profile", fd);
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
  if (loadingProfile) {
    return (
      <div className="space-y-10">
        <div className="bg-white rounded-xl shadow p-6 animate-pulse">
          <div className="flex gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>

        <div>
          <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-4 animate-pulse"
              >
                <div className="h-40 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl shadow p-6 mt-8 sm:mt-0">
        <div className="flex flex-col md:flex-row gap-6">
          <label
            className={`relative w-32 h-32 rounded-full overflow-hidden border ${
              isEditing ? "cursor-pointer group" : ""
            }`}
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
              <>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                  Change
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </label>
          <form onSubmit={handleUpdate} className="flex-1 space-y-4">
            <input
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border rounded-lg ${
                !isEditing ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-500"
              }`}
            />
            <input
              disabled
              value={profile.email || ""}
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
            <textarea
              disabled={!isEditing}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={`w-full p-3 border rounded-lg ${
                !isEditing ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-500"
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
                  disabled={updating}
                  className={`px-5 py-2 rounded-lg text-white ${
                    updating ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {updating ? "Updating…" : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Posts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loadingPosts &&
            posts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full max-h-80 object-contain bg-gray-100"
                  />
                )}
                <div className="p-4 space-y-2">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-500">
                    {p.city} · {p.likes?.length || 0} likes
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {!loadingPosts && posts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">Create your first post to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
