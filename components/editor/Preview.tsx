import { previewProps } from "@/utils/types/Files";
import DOMPurify from "isomorphic-dompurify";
import { FileWarning } from "lucide-react";

const Preview = ({ htmlData }: previewProps) => {
  let sanitizedHTML;
  // if (htmlData != null || undefined) {
  //   sanitizedHTML = DOMPurify.sanitize(htmlData, { ADD_TAGS: ["img"] });
  // }
  return (
    <div className="flex h-full flex-col bg-[#181818]">
      {htmlData ? (
        <iframe
          className="flex-grow"
          srcDoc={htmlData}
          sandbox="allow-scripts"
          title="Preview"
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <div className="text-center max-w-md">
            <FileWarning
              className="mx-auto h-12 w-12 text-muted-foreground mb-4"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold mb-2">No Preview Available</h1>
            <p className="text-muted-foreground mb-6 font-bold">
              We're sorry, but a preview is not available for this page at the
              moment.
            </p>
            <p className="text-muted-foreground mb-6 text-sm">
              Preview will be shown after program detects that you are using
              JSDOM
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
