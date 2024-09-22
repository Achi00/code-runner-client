import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";

const Console = () => {
  return (
    <div className="flex h-full flex-col bg-[#181818]">
      <div className="flex-none border-b p-2 font-mono text-sm font-semibold">
        Console
      </div>
      <ScrollArea className="flex-grow">
        <pre className="p-4 text-sm">
          {`> console.log("Hello, World!")
                Hello, World!
                > const x = 5
                undefined
                > console.log(x * 2)
                10`}
        </pre>
      </ScrollArea>
    </div>
  );
};

export default Console;
