"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "../ui/button";
import { CodeEditorProps } from "@/utils/types/Files";
import { executeCode, getHtmlContent, updateCodeFiles } from "@/lib/fetch";
import { useEffect, useRef, useState } from "react";
import { Loader2, Play } from "lucide-react";
import NoFile from "./NoFile";

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

  const isUpdating = useRef(false);

  let hasScript: boolean = false;
  // store if any html file has script tag
  const filesList = filesData.filteredFiles;
  // console.log("file list:" + filesList);
  const entryFile = filesList.find((file) => file.endsWith(".js"));
  const htmlFile = filesList.find((file) => file.endsWith(".html"));

  const handleEditorDidMount: OnMount = (editor) => {
    setEditorInstance(editor); // Store the editor instance
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
    <div className="flex flex-col w-full justify-center items-start h-screen px-2 py-2 bg-[#1E1E1E]">
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
        {(unsavedFiles.html || unsavedFiles.javascript) && (
          <div className="text-red-500 mt-2">
            {unsavedFiles.html && <p>Warning: HTML file has unsaved changes</p>}
            {unsavedFiles.javascript && (
              <p>Warning: JS file has unsaved changes</p>
            )}
          </div>
        )}
      </div>
      <div className="w-full h-screen">
        {!fileName ? (
          <NoFile />
        ) : (
          <Editor
            height="85vh"
            theme="vs-dark"
            language={selectedFileEnd}
            // value={content || ""}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        )}
      </div>

      {/* <Button onClick={handleFetchHtmlFiles}>Check HTML Files</Button> */}
    </div>
  );
}
