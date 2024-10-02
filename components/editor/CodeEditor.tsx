"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "../ui/button";
import { CodeEditorProps } from "@/utils/types/Files";
import { executeCode, getHtmlContent, updateCodeFiles } from "@/lib/fetch";
import { useEffect, useRef, useState } from "react";
import { Circle, Loader2, Play, X } from "lucide-react";
import NoFile from "./NoFile";
import { getFileIcon } from "../GetIcons";

export default function CodeEditor({
  fileName,
  content,
  userId,
  filesData,
  getHtmls,
  onCodeRun,
}: CodeEditorProps) {
  const [selectedFileEnd, setSelectedFileEnd] = useState("");
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  // store js and html file separately
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [jsContent, setJsContent] = useState<string>("");
  // chack if js or html content is saved
  const [unsavedFiles, setUnsavedFiles] = useState<{ [key: string]: boolean }>({
    html: false,
    javascript: false,
  });
  // tabs
  const [openedTabs, setOpenedTabs] = useState<string[]>([]);

  const isUpdating = useRef(false);
  // editor instance models to keep undo/redo stack between file changes
  // const modelsRef = useRef<{ [key: string]: monaco.editor.ITextModel }>({});

  let hasScript: boolean = false;
  // store if any html file has script tag
  const filesList = filesData.filteredFiles;
  // console.log("file list:" + filesList);
  const entryFile = filesList.find((file) => file.endsWith(".js"));
  const htmlFile = filesList.find((file) => file.endsWith(".html"));

  const handleEditorDidMount: OnMount = (editor) => {
    setEditorInstance(editor); // Store the editor instance
  };

  const handleCloseTabs = (tab: string, fileExtension: string | undefined) => {
    setOpenedTabs((prevTabs) => prevTabs.filter((t) => t !== tab));
    // Remove content and unsaved status if needed
    if (fileExtension && fileExtension === ".html") {
      setHtmlContent("");
    } else if (fileExtension && fileExtension === ".js") {
      setHtmlContent("");
    }
    // setHtmlContent("");
    setUnsavedFiles((prev) => {
      const updated = { ...prev };
      delete updated[tab];
      return updated;
    });
  };

  const handleFetchHtmlFiles = async () => {
    try {
      const { files, hasScriptTag } = await getHtmlContent(getHtmls, userId);
      hasScript = hasScriptTag; // Update hasScript variable

      console.log("Contains <script> tag?", hasScriptTag);
    } catch (error) {
      console.error("Error fetching HTML files:", error);
    }
  };

  async function handleRunCode() {
    // const hasJsFile = filesList.some(
    //   (file) => file.split(".").pop()?.toLowerCase() === "js"
    // );
    // const hasHtmlFile = filesList.some(
    //   (file) => file.split(".").pop()?.toLowerCase() === "html"
    // );
    // if (hasJsFile && hasHtmlFile && hasScript) {
    //   console.log("Includes both JS and HTML with a <script> tag");
    //   console.log(hasJsFile, hasHtmlFile, hasScript);
    //   // const res = await executeCode({userId, })
    //   // Run your jsdom logic here
    // } else {
    //   console.log("Does not include the necessary files or <script> tag");
    //   console.log(hasJsFile, hasHtmlFile, hasScript);
    // }
    if (entryFile && htmlFile) {
      try {
        setIsLoading(true);
        if (unsavedFiles.html || unsavedFiles.javascript) {
          const updatedData = await updateCodeFiles(
            userId,
            filesList,
            htmlContent,
            jsContent
          );
          console.log("Updated data:", updatedData);
          // You can call your executeCode method here if necessary
        }

        // Run your jsdom logic
        // const data = await executeCode({ userId, entryFile, htmlFile });
        // console.log(data);
        // onCodeRun(data);
        setUnsavedFiles({ html: false, javascript: false });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  }

  async function handleEditorChange(value: string | undefined, event: any) {
    if (isUpdating.current) return;

    if (selectedFileEnd == "html") {
      setHtmlContent(value || "");
      // mark html file as unsaved after change
      // Compare value with original content to check for unsaved changes
      const hasUnsavedChanges = value !== content;
      setUnsavedFiles((prev) => ({ ...prev, html: hasUnsavedChanges }));
    } else if (selectedFileEnd == "javascript") {
      setJsContent(value || "");
      // mark js file as unsaved after change
      const hasUnsavedChanges = value !== content;
      setUnsavedFiles((prev) => ({ ...prev, javascript: hasUnsavedChanges }));
    }
    console.log("html:" + htmlContent);
    console.log("js:" + jsContent);
  }

  useEffect(() => {
    if (fileName) {
      setOpenedTabs((prevTabs) => {
        const updatedTabs = Array.from(new Set([fileName, ...prevTabs])).slice(
          0,
          2
        );
        return updatedTabs;
      });
    }
  }, [fileName]);

  // Update the file extension and editor language when fileName changes
  useEffect(() => {
    let fileExtension = fileName.split(".").pop()?.toLowerCase();
    setSelectedFileEnd(
      fileExtension === "html"
        ? "html"
        : fileExtension === "js"
        ? "javascript"
        : "css"
    );
    // When switching files, set editor content to previously stored unsaved content if it exists to avoid unneccessary data fetching
    if (editorInstance) {
      isUpdating.current = true; // Start of programmatic update

      if (fileExtension === "html") {
        if (unsavedFiles.html && htmlContent) {
          editorInstance.setValue(htmlContent);
        } else {
          setHtmlContent(content || "");
          editorInstance.setValue(content || "");
        }
      } else if (fileExtension === "js") {
        if (unsavedFiles.javascript && jsContent) {
          editorInstance.setValue(jsContent);
        } else {
          setJsContent(content || "");
          editorInstance.setValue(content || "");
        }
      } else {
        editorInstance.setValue(content || "");
      }

      isUpdating.current = false; // End of programmatic update
    }
  }, [fileName, content, editorInstance]);

  // Reset undo stack and update editor content when fileName changes

  // useEffect(() => {
  //   if (editorInstance && content) {
  //     // Update content based on file type
  //     // store newest content
  //     if (selectedFileEnd === "html") {
  //       setHtmlContent(content);
  //     } else if (selectedFileEnd === "javascript") {
  //       setJsContent(content);
  //     }
  //     editorInstance.setValue(content); // Update editor content
  //     editorInstance.getModel()?.pushStackElement(); // Clear the undo stack
  //   }
  // }, [fileName, content, editorInstance]);

  return (
    <div className="flex flex-col w-full justify-center items-start h-screen  bg-[#1E1E1E]">
      <div className="flex h-10 w-full border-b border-gray-700">
        {openedTabs.length > 0 &&
          openedTabs.map((tabs) => {
            const fileExtension = tabs.split(".").pop()?.toLowerCase();
            const fileKey =
              fileExtension === "html"
                ? "html"
                : fileExtension === "js"
                ? "javascript"
                : fileExtension;
            const isUnsaved = fileKey && unsavedFiles[fileKey];
            return (
              <div
                key={tabs}
                className="flex items-center bg-[#1E1E1E] text-gray-300 px-3 py-1 border border-gray-600 w-40"
              >
                <div className="flex items-center space-x-2 flex-grow overflow-hidden">
                  {isUnsaved && (
                    <Circle
                      className="w-2 h-2 fill-white text-white animate-pulse"
                      aria-label="Unsaved changes"
                    />
                  )}
                  <span className="flex items-center gap-1" title={tabs}>
                    {getFileIcon(tabs)} {tabs}
                  </span>
                </div>
                <button
                  onClick={() => handleCloseTabs(tabs, fileExtension)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  aria-label="Close file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
      </div>
      <div className="pb-6 pt-2 pl-2">
        <Button
          disabled={isLoading || !fileName}
          className="flex items-center gap-1 bg-[#D0FB51] text-black hover:text-white"
          onClick={handleRunCode}
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <Loader2 className="w-5 h-5 animate-spin" />
              Running...
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Play className="w-5 h-5" />
              Run
            </div>
          )}
        </Button>
      </div>
      <div className="w-full h-screen">
        {!fileName ? (
          <NoFile />
        ) : (
          <Editor
            height="85vh"
            theme="vs-dark"
            language={selectedFileEnd}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        )}
      </div>

      {/* <Button onClick={handleFetchHtmlFiles}>Check HTML Files</Button> */}
    </div>
  );
}
