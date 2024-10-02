"use client";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import {
  FolderPlus,
  File,
  Trash2,
  AlertCircle,
  CircleAlert,
  Loader2,
} from "lucide-react";
import { getFileIcon } from "../GetIcons";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Files } from "@/utils/types/Files";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { createPortal } from "react-dom";
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
import { deleteFile } from "@/lib/fetch";
import { Skeleton } from "../ui/skeleton";

const SUPPORTED_EXTENSIONS = ["js", "css", "html"];

export default function Sidebar({
  filesData,
  onFileSelect,
  userId,
}: Files & { onFileSelect: (fileName: string[]) => void }) {
  const [showInput, setShowInput] = useState(false);
  const [files, setFiles] = useState<string[]>(filesData?.filteredFiles || []);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState([""]);

  const handleFileClick = (file: string[]) => {
    onFileSelect(file);
    setIsSelected(file);
    console.log(file);
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  useEffect(() => {
    setFiles(filesData?.filteredFiles || []);
  }, [filesData?.filteredFiles]);

  const handlePlusClick = () => {
    if (files.length >= 2) {
      toast("You can't have more than 2 files", {
        duration: 4000,
        position: "top-center",

        // Styling
        style: { backgroundColor: "#D0FB51", fontWeight: "700" },

        // Custom Icon
        icon: <CircleAlert />,

        // Change colors of success/error/loading icon
        iconTheme: {
          primary: "#000",
          secondary: "#000",
        },

        // Aria
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
      return;
    }
    setShowInput(true);
    setError("");
  };

  const handleDeleteClick = (file: string) => {
    setFileToDelete(file);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async (userId: string, fileName: string) => {
    if (fileName && userId) {
      try {
        await deleteFile(userId, fileName);
        // Update the file list after successful deletion
        setFiles(files.filter((f) => f !== fileName));
        console.log(`File deleted: ${fileName}`);
        toast.success(`File: ${fileName} deleted successfully`);
      } catch (error) {
        console.error("Failed to delete file:", error);
        setError("Failed to delete file. Please try again.");
      }
    }
    setIsAlertOpen(false);
    setFileToDelete(null);
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
        body: JSON.stringify({ userId, fileName }),
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

  if (isLoading) {
    return (
      <div className="w-64 bg-zinc-900 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-20 bg-zinc-800" />
          <Skeleton className="h-6 w-6 bg-zinc-800" />
        </div>
        <div className="space-y-4 pt-10">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-4 bg-red-800" />
            <Skeleton className="h-6 w-36 bg-zinc-800" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-4 bg-yellow-800" />
            <Skeleton className="h-6 w-36 bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
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
          {files.map((file, index) => (
            <div
              key={index}
              onClick={() => handleFileClick([file])}
              className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${
                file == isSelected[0] && "bg-gray-600"
              } hover:bg-gray-700 h-11`}
            >
              <div className="flex items-center">
                {getFileIcon(file)}
                <span className="pl-2 text-lg">{file}</span>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(file);
                }}
                className="outline-none hidden group-hover:flex items-center justify-center"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent className="bg-white text-black">
              <AlertDialogHeader className="text-black">
                <AlertDialogTitle className="text-2xl">
                  Confirm Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="text-md">
                  This action cannot be undone. This will permanently delete the
                  file{" "}
                  <span className="font-extrabold text-black font-sans">
                    "{fileToDelete}"
                  </span>{" "}
                  from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    fileToDelete &&
                    handleDeleteConfirm(userId as string, fileToDelete)
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>,
          document.body
        )}
    </div>
  );
}
