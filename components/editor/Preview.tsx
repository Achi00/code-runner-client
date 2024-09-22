import React from "react";

const Preview = () => {
  return (
    <div className="flex h-full flex-col bg-[#181818]">
      <div className="flex-none border-b p-2 font-mono text-sm font-semibold"></div>
      <div className="flex-grow p-4">
        <div className="rounded border p-4 text-center">Preview Content</div>
      </div>
    </div>
  );
};

export default Preview;
