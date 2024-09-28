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
  fileName: string;
  content: string;
  userId: string;
  filesData: filesDataTypes;
  getHtmls: string[];
  onCodeRun: (data: codeResult) => void;
}
