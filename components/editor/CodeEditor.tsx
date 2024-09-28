"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "../ui/button";
import { CodeEditorProps } from "@/utils/types/Files";
import { executeCode, getHtmlContent } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { Loader2, Play } from "lucide-react";

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

  // store if any html file has script tag
  let hasScript: boolean = false;
  const filesList = filesData.filteredFiles;
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
    if (entryFile && htmlFile) {
      try {
        setIsLoading(true);
        const data = await executeCode({ userId, entryFile, htmlFile });
        console.log(data);
        onCodeRun(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  }

  async function handleEditorChange(value: string | undefined, event: any) {
    setTimeout(() => {
      console.log(filesList);
    }, 1000);
  }

  // Update the file extension and editor language when fileName changes
  useEffect(() => {
    let fileExtencion = fileName.split(".").pop()?.toLowerCase();
    if (fileExtencion == "html") {
      setSelectedFileEnd("html");
    } else if (fileExtencion == "js") {
      setSelectedFileEnd("javascript");
    } else {
      setSelectedFileEnd("css");
    }
  }, [fileName]);

  // Reset undo stack and update editor content when fileName changes

  useEffect(() => {
    if (editorInstance && content) {
      editorInstance.setValue(content); // Update editor content
      editorInstance.getModel()?.pushStackElement(); // Clear the undo stack
    }
  }, [fileName, content, editorInstance]);

  return (
    <>
      <div className="flex flex-col w-full justify-center items-start h-screen px-2 py-2 bg-[#1E1E1E]">
        <div className="pb-6 pt-2 pl-2">
          <Button
            disabled={isLoading}
            className="flex items-center gap-1 bg-[#D0FB51] text-black hover:text-white"
            onClick={handleRunCode}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run
              </>
            )}
          </Button>
        </div>
        <div className="w-full h-screen">
          <Editor
            height="85vh"
            theme="vs-dark"
            language={selectedFileEnd}
            value={content || ""}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        </div>

        {/* <Button onClick={handleFetchHtmlFiles}>Check HTML Files</Button> */}
      </div>
    </>
  );
}
