import { FaJsSquare, FaCss3, FaHtml5, FaFileAlt } from "react-icons/fa";

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
      return <FaJsSquare size={24} color="yellow" />;
    case "css":
      return <FaCss3 size={24} color="lightblue" />;
    case "html":
      return <FaHtml5 size={24} color="brown" />;
    default:
      return <FaFileAlt size={24} />;
  }
};
