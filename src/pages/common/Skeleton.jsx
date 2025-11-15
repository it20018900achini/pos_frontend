import React from "react";

const Skeleton = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 rounded bg-gray-300"></div>
        <div className="h-6 w-72 rounded bg-gray-300"></div>
        <div className="h-6 w-56 rounded bg-gray-300"></div>
      </div>
    </div>
  );
};

export default Skeleton;
