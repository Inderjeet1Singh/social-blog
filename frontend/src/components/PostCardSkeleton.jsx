import React from "react";

export default function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow animate-pulse overflow-hidden flex flex-col">
      <div className="h-52 bg-gray-200" />

      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-14" />
        </div>

        <div className="flex-1" />

        <div className="h-8 bg-gray-200 rounded-full w-20" />
      </div>
    </div>
  );
}
