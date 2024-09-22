"use client";

import { useState, useRef, useEffect } from "react";
import { FolderPlus, File, Trash2, AlertCircle } from "lucide-react";
import { getFileIcon } from "../GetIcons";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Files } from "@/utils/types/Files";

const SUPPORTED_EXTENSIONS = ["js", "css", "html"];

export default function Sidebar({
  filesData,
  onFileSelect,
}: Files & { onFileSelect: (fileName: string[]) => void }) {
  const [showInput, setShowInput] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileClick = (file: string[]) => {
    onFileSelect(file);
    console.log(file);
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const filesList = filesData && filesData.filteredFiles;

  const handlePlusClick = () => {
    setShowInput(true);
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError("");
  };

  const trimmedValue = inputValue.trim();
  const extension = trimmedValue.split(".").pop()?.toLowerCase();

  const createFile = async (fileName: string) => {
    try {
      if (!fileName) {
        setError("Please enter a file name.");
        return;
      }
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/v1/create-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "65", fileName }), // Replace '65' with dynamic userId as needed
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setIsLoading(false);
      } else {
        console.log("File created successfully");
        setFiles([...files, fileName]); // Update the local files state with the new file
        setInputValue("");
        setShowInput(false);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError("Error creating file. Please try again.");
    }
  };

  const handleInputBlur = () => {
    if (trimmedValue !== "") {
      if (extension && SUPPORTED_EXTENSIONS.includes(extension)) {
        console.log("New file created:", trimmedValue);
        // setFiles([...files, trimmedValue]);
        // setInputValue("");
        // setShowInput(false);
        createFile(trimmedValue);
        setError("");
      } else {
        setError(
          `Unsupported file extension '.${extension}'. Supported extensions are: ${SUPPORTED_EXTENSIONS.join(
            ", "
          )}.`
        );
      }
    } else {
      // If input is empty, close it
      setInputValue("");
      setShowInput(false);
      setError("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedValue = inputValue.trim();
      if (trimmedValue === "") {
        setInputValue("");
        setShowInput(false);
      } else {
        if (extension && SUPPORTED_EXTENSIONS.includes(extension)) {
          console.log("New file created:", trimmedValue);
          createFile(trimmedValue);
          setError("");
        } else {
          setError(
            `Unsupported file extension '.${extension}'. Supported extensions are: ${SUPPORTED_EXTENSIONS.join(
              ", "
            )}.`
          );
        }
      }
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="w-64 h-screen bg-[#181818] text-white p-4 border-r">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Explorer</h2>
        <button
          onClick={handlePlusClick}
          className="p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <FolderPlus size={20} />
        </button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-lg">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="py-4">
        {showInput && (
          <div className="mb-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue || ""}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              placeholder="Enter file name..."
              className="w-full bg-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
      <div className="space-y-1">
        {isLoading && "File creating"}
        {filesList &&
          filesList.map((file: string, index: number) => (
            <div
              key={index}
              onClick={() => handleFileClick([file])}
              className="group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-gray-700 h-11"
            >
              <div className="flex items-center">
                {getFileIcon(file)}
                <span className="pl-2 text-lg">{file}</span>
              </div>
              <Button
                className="outline-none hidden group-hover:flex items-center justify-center"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>
      <div className="space-y-1">
        {files.map((file, index) => (
          <div
            key={index}
            className="group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-gray-700 h-11"
          >
            <div className="flex items-center">
              {getFileIcon(file)}
              <span className="pl-2 text-lg">{file}</span>
            </div>
            <Button
              className="outline-none hidden group-hover:flex items-center justify-center"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
