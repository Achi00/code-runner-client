export type FilesType = {
  message: string;
  filteredFiles: string[];
};

export type Files = {
  filesData: FilesType;
  fileName?: string;
};

interface filesDataTypes {
  filteredFiles: string[];
  message: string;
}

export interface CodeEditorProps {
  fileName: string;
  content: string;
  userId: string;
  filesData: filesDataTypes;
  getHtmls: string[];
}
