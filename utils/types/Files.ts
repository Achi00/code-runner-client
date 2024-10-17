export type FilesType = {
  message: string;
  filteredFiles: string[];
};

export type Files = {
  filesData: FilesType;
  fileName?: string;
  userId?: string;
};

interface filesDataTypes {
  filteredFiles: string[];
  message: string;
}

export type codeResult = {
  output: string;
  error: string;
  logs: string[];
};

export interface CodeEditorProps {
  selectedFileName: string;
  selectedFileContent: string;
  userId: string;
  setHtmlData: (html: string) => void;
  filesData: filesDataTypes;
  getHtmls: string[];
  onCodeRun: (data: codeResult) => void;
  onFileContentChange: (fileName: string, content: string) => void;
}

export interface previewProps {
  htmlData: string;
}
