import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [myPosts, setMyPosts] = useState([]);
  useEffect(() => {
    fetchMyPosts();
  }, []);
  const fetchMyPosts = async () => {
    try {
      const res = await API.get("/posts/my");
      setMyPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const totalPosts = myPosts.length;
  const totalLikes = myPosts.reduce(
    (sum, post) => sum + (post.likes?.length || 0),
    0,
  );
  const top5Posts = [...myPosts]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Overview of your posts and engagement
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow">
          <div className="text-sm opacity-80">Total Posts</div>
          <div className="text-4xl font-bold mt-2">{totalPosts}</div>
          <div className="absolute -bottom-6 -right-6 text-white/20 text-8xl">
            📝
          </div>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-xl shadow">
          <div className="text-sm opacity-80">Total Likes Received</div>
          <div className="text-4xl font-bold mt-2">{totalLikes}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Top 5 Posts
        </h3>
        {top5Posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No posts yet</p>
            <p className="text-sm mt-1">
              Start creating posts to see insights here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top5Posts.map((post) => (
              <div
                key={post._id}
                className="group border rounded-xl p-4 hover:shadow-lg transition bg-gray-50"
              >
                {post.image && (
                  <div className="overflow-hidden rounded-lg mb-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <h4 className="text-lg font-semibold text-gray-800">
                  {post.title}
                </h4>

                <div className="flex items-center justify-between text-sm text-gray-500 mt-1 mb-2">
                  <span>{post.likes?.length || 0} likes</span>
                  {post.city && <span>{post.city}</span>}
                </div>

                {post.description && (
                  <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                    {post.description}
                  </p>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white border px-2 py-1 rounded-full text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
