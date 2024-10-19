export type FilesType = {
  message: string;
  filteredFiles: string[];
};

export type Files = {
  filesData: FilesType;
  fileName?: string;
  userId?: string;
  dependencies: Dependency;
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

// dependencies
export type Dependency = {
  name: string;
  version: string;
  dependencies: Dependency[];
};

export type DependenciesResponse = {
  dependencies: Dependency;
  userId: string;
};
