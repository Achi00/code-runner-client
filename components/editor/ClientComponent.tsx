"use client";
import { useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import Console from "@/components/editor/Console";
import Preview from "@/components/editor/Preview";
import Sidebar from "@/components/editor/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { codeResult, Dependency, Files, FilesType } from "@/utils/types/Files";

interface ClientComponentProps {
  filesData: FilesType;
  userId: string;
  dependencies: Dependency;
}

export default function ClientComponent({
  filesData,
  userId,
  dependencies,
}: ClientComponentProps) {
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  // update state from CodeEditor component
  const [codeOutput, setCodeOutput] = useState<codeResult | null>(null);
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>(
    {}
  );
  const [htmlData, setHtmlData] = useState<string>("");

  // Handle file selection and fetch its content dynamically
  const handleFileSelect = async (fileNames: string[]) => {
    try {
      setSelectedFileName(fileNames.join(", ")); // Set selected file names (in case of array)

      // Fetch the selected file's content from the server
      const fileContentResponse = await fetch(
        `http://localhost:8000/v1/create-files/file-content/${userId}`, // POST endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileNames }), // Pass the filenames array in the body
        }
      );

      if (!fileContentResponse.ok) {
        throw new Error(
          `Error fetching file content: ${fileContentResponse.statusText}`
        );
      }

      const fileContentData = await fileContentResponse.json();

      // Assuming the response contains an array of files with `fileName` and `fileContent`
      if (fileContentData.files.length === 1) {
        // If only one file, set its content directly
        setSelectedFileContent(fileContentData.files[0].fileContent);
      } else {
        // If multiple files are fetched, handle accordingly
        const combinedFileContent = fileContentData.files
          .map(
            (file: { fileName: string; fileContent: string }) =>
              `${file.fileName}:\n${file.fileContent}`
          )
          .join("\n\n");

        setSelectedFileContent(combinedFileContent);
        // Update fileContents for each file
        const newFileContents = fileContentData.files.reduce(
          (acc: string[], file: any) => {
            acc[file.fileName] = file.fileContent;
            return acc;
          },
          {}
        );
        setFileContents((prev) => ({ ...prev, ...newFileContents }));
      }

      // console.log(fileContentData);
      // console.log(selectedFileContent);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // clears console data from Console.tsx
  const handleClear = () => {
    setCodeOutput(null);
  };

  // updated code after code run
  const handleFileContentChange = (fileName: string, content: string) => {
    setFileContents((prev) => ({
      ...prev,
      [fileName]: content,
    }));
    if (fileName === selectedFileName) {
      setSelectedFileContent(content);
    }
  };

  const files = filesData.filteredFiles || [];
  const getHtmls = files.filter((file) => file.endsWith(".html"));

  return (
    <div className="w-full h-screen flex">
      <Sidebar
        userId={userId}
        dependencies={dependencies}
        filesData={filesData}
        onFileSelect={handleFileSelect}
      />

      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full flex-col">
                <CodeEditor
                  userId={userId}
                  selectedFileName={selectedFileName}
                  selectedFileContent={selectedFileContent}
                  filesData={filesData}
                  getHtmls={getHtmls}
                  onCodeRun={(data) => {
                    setCodeOutput(data);
                  }}
                  setHtmlData={setHtmlData}
                  onFileContentChange={handleFileContentChange}
                />
                <ScrollArea className="flex-grow">
                  <pre className="p-4">{selectedFileContent}</pre>
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <Preview htmlData={htmlData} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <Console codeOutput={codeOutput} onClear={handleClear} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
