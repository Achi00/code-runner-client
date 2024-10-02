export function getLanguageFromFileExtension(fileName: string) {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  switch (fileExtension) {
    case "html":
      return "html";
    case "js":
    case "jsx":
      return "javascript";
    case "css":
      return "css";
    default:
      return "plaintext";
  }
}
