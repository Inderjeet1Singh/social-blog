import React from "react";
export default function PostCard({
  post,
  onLike,
  onEdit,
  onDelete,
  currentUserId,
  showActions = false,
}) {
  const isOwner =
    post.author &&
    (post.author._id === currentUserId || post.author === currentUserId);
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      {post.image && (
        <div className="overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-80 object-contain bg-gray-100"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 leading-tight">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {post.city} · by{" "}
            <span className="font-medium">
              {post.author?.name || "Unknown"}
            </span>
          </p>
        </div>
        {post.description && (
          <p className="text-sm text-gray-700 line-clamp-3 mb-3">
            {post.description}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 5).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 border px-2 py-1 rounded-full text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex-1" />
        <div className="flex items-center justify-between pt-3 border-t">
          <button
            onClick={() => onLike(post)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm transition"
          >
            ❤️ <span>{post.likes?.length || 0}</span>
          </button>
          {showActions && isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(post)}
                className="px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(post)}
                className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
