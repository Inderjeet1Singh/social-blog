import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAdminData();
  }, []);
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [postsRes, usersRes] = await Promise.all([
        API.get("/admin/posts"),
        API.get("/admin/users"),
      ]);
      setPosts(postsRes.data);
      setUsersCount(usersRes.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const totalPosts = posts.length;
  const totalLikes = posts.reduce(
    (sum, post) => sum + (post.likes?.length || 0),
    0,
  );
  const top3Posts = [...posts]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3);
  const deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await API.delete(`/admin/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading admin dashboard...
      </div>
    );
  }
  return (
    <div className="space-y-10 mt-12 sm:mt-0">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Platform overview & post management
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-4xl font-bold mt-2">{usersCount}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500">Total Posts</div>
          <div className="text-4xl font-bold mt-2">{totalPosts}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-500">Total Likes</div>
          <div className="text-4xl font-bold mt-2">{totalLikes}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Top 3 Posts (Most Liked)</h3>
        {top3Posts.length === 0 ? (
          <p className="text-gray-500">No posts yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3Posts.map((post) => (
              <div key={post._id} className="border rounded-lg overflow-hidden">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-4 space-y-2">
                  <div className="font-semibold">{post.title}</div>
                  <div className="text-sm text-gray-500">
                     {post.likes?.length || 0} likes
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {post.description}
                  </p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 5).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">All Posts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <div className="font-semibold text-gray-800">{post.title}</div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.description}
                </p>
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 5).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500">
                    ❤️ {post.likes?.length || 0}
                  </span>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
