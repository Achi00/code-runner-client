"use client";
import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import { CodeEditorProps } from "@/utils/types/Files";
import { getHtmlContent } from "@/lib/fetch";
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

  let hasScript: boolean = false;
  const filesList = filesData.filteredFiles;

  const handleSubmit = async () => {};

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
    const hasJsFile = filesList.some(
      (file) => file.split(".").pop()?.toLowerCase() === "js"
    );
    const hasHtmlFile = filesList.some(
      (file) => file.split(".").pop()?.toLowerCase() === "html"
    );

    if (hasJsFile && hasHtmlFile && hasScript) {
      console.log("Includes both JS and HTML with a <script> tag");
      console.log(hasJsFile, hasHtmlFile, hasScript);
      // Run your jsdom logic here
    } else {
      console.log("Does not include the necessary files or <script> tag");
      console.log(hasJsFile, hasHtmlFile, hasScript);
    }
  }
  // if (fileContent.name.split(".").pop()?.toLowerCase()) {

  // console.log(filesData);
  // console.log(content);
  // }
  // console.log(getHtmls);
  async function handleEditorChange(value: string | undefined, event: any) {
    setTimeout(() => {
      runCode();
    }, 1000);
  }

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

  return (
    <div className="flex w-full justify-center items-start h-screen px-2 py-6 bg-[#1E1E1E]">
      <Button onClick={handleFetchHtmlFiles}>Check HTML Files</Button>
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
            />
          </div>

          <div className="flex justify-between pt-2">
            <div className="flex items-center space-x-5"></div>

            <div className="flex-shrink-0">
              <Button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Run
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
