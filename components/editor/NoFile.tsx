import { File, Plus } from "lucide-react";
import React from "react";

const NoFile = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="p-8 border border-[#D0FB51] rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[#D0FB51] rounded-full">
            <File className="w-12 h-12 text-gray-800" />
          </div>
          <h1 className="text-2xl font-bold text-gray-300">No file selected</h1>
          <p className="text-sm text-gray-400">
            Select or create new file to start editing
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoFile;
