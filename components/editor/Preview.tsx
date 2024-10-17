import { previewProps } from "@/utils/types/Files";

const Preview = ({ htmlData }: previewProps) => {
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
        <div className="flex-none p-2 font-mono text-sm font-semibold text-white">
          No Preview
        </div>
      )}
    </div>
  );
};

export default Preview;
