"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "../ui/button";
import { CodeEditorProps } from "@/utils/types/Files";
import { executeJSDomCode, getHtmlContent, updateCodeFiles } from "@/lib/fetch";
import { useEffect, useRef, useState } from "react";
import { Circle, Loader2, Play, X } from "lucide-react";
import NoFile from "./NoFile";
import { getFileIcon } from "../GetIcons";
import { getLanguageFromFileExtension } from "@/lib/helpers";

export default function CodeEditor({
  selectedFileName,
  selectedFileContent,
  userId,
  filesData,
  getHtmls,
  onCodeRun,
  onFileContentChange,
}: CodeEditorProps) {
  const [selectedFileEnd, setSelectedFileEnd] = useState("");
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  // store js and html file separately
  // chack if js or html content is saved
  const [unsavedFiles, setUnsavedFiles] = useState<{ [key: string]: boolean }>({
    html: false,
    javascript: false,
  });
  // Store contents of all files
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>(
    {}
  );
  // tabs
  const [openedTabs, setOpenedTabs] = useState<string[]>([]);
  const models = useRef<{ [key: string]: any }>({});

  const isUpdating = useRef(false);

  let hasScript: boolean = false;
  // store if any html file has script tag
  const filesList = filesData.filteredFiles;
  // console.log("file list:" + filesList);
  const entryFile = filesList.find((file) => file.endsWith(".js"));
  const htmlFile = filesList.find((file) => file.endsWith(".html"));

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditorInstance(editor); // Store the editor instance
    setMonacoInstance(monaco);
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
    // destructure filecontent into html and js
    const jsContent = (entryFile && fileContents[entryFile]) || "";
    const htmlContent = (htmlFile && fileContents[htmlFile]) || "";
    if (entryFile && htmlFile) {
      try {
        console.log(unsavedFiles);
        setIsLoading(true);
        if (unsavedFiles.html || unsavedFiles.javascript) {
          const updatedData = await updateCodeFiles(
            userId,
            filesList,
            htmlContent,
            jsContent
          );
          const data = await executeJSDomCode({ userId, entryFile, htmlFile });
          onCodeRun(data);
          setUnsavedFiles({ html: false, javascript: false });
          setIsLoading(false);
          console.log("file updated & run seccesfully");
        }

        // Run your jsdom logic
        const data = await executeJSDomCode({ userId, entryFile, htmlFile });
        console.log(data);
        onCodeRun(data);
        setUnsavedFiles({ html: false, javascript: false });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  }

  function handleEditorChange(value: string | undefined, event: any) {
    if (isUpdating.current) return;
    console.log(unsavedFiles);
    // Update fileContents with the new value
    setFileContents((prev) => ({
      ...prev,
      [selectedFileName]: value || "",
    }));

    // Map the file extension to a file type
    const fileExtension = getLanguageFromFileExtension(selectedFileName);
    // Mark the file as having unsaved changes
    const hasUnsavedChanges = value !== selectedFileContent;
    setUnsavedFiles((prev) => ({
      ...prev,
      [selectedFileName]: hasUnsavedChanges,
      [fileExtension]: hasUnsavedChanges,
    }));
    // Notify parent component of the change
    if (onFileContentChange) {
      onFileContentChange(selectedFileName, value || "");
    }
  }

  // Update fileContents when content prop changes
  useEffect(() => {
    if (selectedFileContent !== undefined) {
      setFileContents((prev) => ({
        ...prev,
        [selectedFileName]: selectedFileContent,
      }));
    }
  }, [selectedFileContent, selectedFileName]);

  useEffect(() => {
    if (selectedFileName) {
      setOpenedTabs((prevTabs) => {
        const updatedTabs = Array.from(
          new Set([selectedFileName, ...prevTabs])
        ).slice(0, 2);
        return updatedTabs;
      });
    }
  }, [selectedFileName]);

  useEffect(() => {
    if (editorInstance && monacoInstance && selectedFileName) {
      const fileExtension = selectedFileName.split(".").pop()?.toLowerCase();
      setSelectedFileEnd(
        fileExtension === "html"
          ? "html"
          : fileExtension === "js"
          ? "javascript"
          : "css"
      );

      const uri = monacoInstance.Uri.parse(`file:///${selectedFileName}`);
      let model = monacoInstance.editor.getModel(uri);

      const fileContent = fileContents[selectedFileName];

      if (!model) {
        const initialValue =
          fileContent !== undefined ? fileContent : selectedFileContent || "";
        model = monacoInstance.editor.createModel(
          initialValue,
          getLanguageFromFileExtension(selectedFileName),
          uri
        );
        models.current[selectedFileName] = model;
      } else {
        // Update the model's value if content prop has changed and there are no unsaved changes
        if (
          selectedFileContent !== undefined &&
          !unsavedFiles[selectedFileName] &&
          model.getValue() !== selectedFileContent
        ) {
          isUpdating.current = true;
          model.setValue(selectedFileContent);
          isUpdating.current = false;
          // Update fileContents with the new content
          setFileContents((prev) => ({
            ...prev,
            [selectedFileName]: selectedFileContent,
          }));
        }
      }

      isUpdating.current = true; // Start of programmatic update
      editorInstance.setModel(model);
      isUpdating.current = false; // End of programmatic update
    }
    console.log(selectedFileContent);
  }, [
    selectedFileName,
    selectedFileContent,
    editorInstance,
    monacoInstance,
    fileContents,
    unsavedFiles,
  ]);

  return (
    <div className="flex flex-col w-full justify-center items-start h-screen  bg-[#1E1E1E]">
      <div className="flex flex-col gap-4 p-2 w-full border-b border-gray-700">
        {openedTabs.length > 0 &&
          openedTabs.map((tabs) => {
            const isUnsaved = unsavedFiles[tabs];
            return (
              <div
                key={tabs}
                className="flex items-center bg-[#1E1E1E] text-gray-300 px-3 py-1w-40"
              >
                <div className="flex items-center space-x-2 flex-grow overflow-hidden">
                  <span className="flex items-center gap-1" title={tabs}>
                    {getFileIcon(tabs)} {tabs}
                  </span>
                </div>
                {isUnsaved && (
                  <div className="flex items-center">
                    <Circle
                      className="mr-2 w-2 h-2 fill-white text-white animate-pulse"
                      aria-label="Unsaved changes"
                    />
                    <p>Unsaved Content</p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="pb-6 pt-10 pl-2">
        <Button
          disabled={isLoading || !selectedFileName}
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
        {!selectedFileName ? (
          <NoFile />
        ) : (
          <Editor
            height="85vh"
            theme="vs-dark"
            path={selectedFileName}
            defaultLanguage={getLanguageFromFileExtension(selectedFileName)}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            saveViewState={true}
          />
        )}
      </div>

      {/* <Button onClick={handleFetchHtmlFiles}>Check HTML Files</Button> */}
    </div>
  );
}
