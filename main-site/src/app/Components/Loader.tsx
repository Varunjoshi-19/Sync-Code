import React from "react";

type LoaderProps = {
  size?: number;        // px
  fullScreen?: boolean; // center on full screen
};

const Loader: React.FC<LoaderProps> = ({ size = 40, fullScreen = false }) => {
  const spinner = (
    <div
      className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
      style={{ width: size, height: size }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default Loader;
