import React from "react";

const ContentLayout = ({ title,subTitle,right, children }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className=" bg-muted border-b flex justify-between w-full">      
        
        {title && (
        <div className="px-6 py-4">
          {typeof title === "string" ? (
            <h1 className="text-2xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {subTitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subTitle}
            </p>
          )}
        </div>
      )}
        {right && (
          <div className="px-6 py-4 border-b flex justify-end">
            {right}
          </div>
        )}
      
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ContentLayout;
