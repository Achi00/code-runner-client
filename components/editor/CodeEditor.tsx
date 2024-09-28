"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "../ui/button";
import { CodeEditorProps } from "@/utils/types/Files";
import { executeCode, getHtmlContent } from "@/lib/fetch";
import { useEffect, useState } from "react";

export default function CodeEditor({
  fileName,
  content,
  userId,
  filesData,
  getHtmls,
}: CodeEditorProps) {
  const [selectedFileEnd, setSelectedFileEnd] = useState("");
  const [editorInstance, setEditorInstance] = useState<any>(null);

  // store if any html file has script tag
  let hasScript: boolean = false;
  const filesList = filesData.filteredFiles;
  const entryFile = filesList.find((file) => file.endsWith(".js"));
  const htmlFile = filesList.find((file) => file.endsWith(".html"));

  const handleSubmit = async () => {};

  const handleEditorDidMount: OnMount = (editor) => {
    setEditorInstance(editor); // Store the editor instance
  };

  const handleFetchHtmlFiles = async () => {
    try {
      const { files, hasScriptTag } = await getHtmlContent(getHtmls, userId);
      hasScript = hasScriptTag; // Update hasScript variable

      console.log("Contains <script> tag?", hasScriptTag);

      runCode(); // Call runCode after checking HTML files
    } catch (error) {
      console.error("Error fetching HTML files:", error);
    }
  };

  async function runCode() {
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
    console.log(entryFile, htmlFile, userId);
    if (entryFile && htmlFile) {
      const data = await executeCode({ userId, entryFile, htmlFile });
      console.log(data);
    }
  }

  async function handleEditorChange(value: string | undefined, event: any) {
    setTimeout(() => {
      runCode();
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
    <div className="flex w-full justify-center items-start h-screen px-2 py-6 bg-[#1E1E1E]">
      <Button onClick={handleFetchHtmlFiles}>Check HTML Files</Button>
      <Button>Run</Button>
      <div className="w-full h-screen">
        <form action="#" onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="comment" className="sr-only">
              Add your code
            </label>

            <Editor
              height="85vh"
              theme="vs-dark"
              language={selectedFileEnd}
              value={content || ""}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
