export async function getFileContent(
  fileName: string,
  userId: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `http://localhost:8000/v1/create-files/file-content/65/${fileName}`
    );

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Error fetching file content: ${response.statusText}`);
    }

    // Assuming the content is text, return the file content
    return await response.text();
  } catch (error) {
    console.error("Failed to fetch file content:", error);
    return null; // Handle the error case appropriately
  }
}

function searchForScript(htmlContent: string) {
  const regex = /<script/i;
  return regex.test(htmlContent);
}

export async function getHtmlContent(fileNames: string[], userId: string) {
  try {
    const response = await fetch(
      `http://localhost:8000/v1/create-files/file-content/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileNames }), // Sending array of file names
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching html content: ${response.statusText}`);
    }

    const filesContent = await response.json();

    // Check if any of the HTML files contain a <script> tag using your searchForScript function
    const filesWithScriptTag = filesContent.files.some(
      (file: { fileContent: string }) => searchForScript(file.fileContent)
    );

    return {
      files: filesContent.files, // The file content array
      hasScriptTag: filesWithScriptTag, // True if any file contains <script>
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function executeCode({
  userId,
  entryFile,
  htmlFile,
}: {
  userId: string;
  entryFile: string;
  htmlFile: string;
}) {
  const id = String(userId);
  try {
    if (!userId || !entryFile || !htmlFile) {
      throw new Error("userId, entryFile and htmlFile is required");
    }
    const response = await fetch("http://localhost:8000/v1/run/jsdom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: id, entryFile, htmlFile }),
    });
    if (!response.ok) {
      throw new Error(`Error executing code: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to execute code:", error);
    throw error;
  }
}

export async function deleteFile(userId: string, fileName: string) {
  try {
    const res = await fetch("http://localhost:8000/v1/create-files", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, fileName }),
    });
    if (!res.ok) {
      throw new Error(`Error deleting file: ${res.statusText}`);
    }
    const data = await res.json();
    console.log("File deleted successfully");
    return data;
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}