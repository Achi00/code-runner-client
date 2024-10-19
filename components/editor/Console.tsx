import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { codeResult } from "@/utils/types/Files";

interface ConsoleProps {
  codeOutput: codeResult | null;
  onClear: () => void;
}

const Console = ({ codeOutput, onClear }: ConsoleProps) => {
  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-50">
      <div className="flex items-center justify-between border-b border-zinc-800 p-2">
        <div className="flex items-center space-x-2">
          <Terminal size={18} />
          <span className="font-mono text-sm font-semibold">Console</span>
        </div>
        <Button onClick={onClear} variant="ghost" size="sm">
          Clear
        </Button>
      </div>
      {codeOutput ? (
        <Tabs defaultValue="output" className="flex flex-col items">
          <TabsList className="bg-zinc-900 border-b text-white border-zinc-800">
            <TabsTrigger
              value="output"
              className="data-[state=active]:bg-zinc-800 flex gap-1"
            >
              Output{" "}
              {codeOutput.output && codeOutput.output.length > 0 && (
                <span className="text-[#D0FB51] text-2xl font-bold">!</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="error"
              className="data-[state=active]:bg-zinc-800 flex gap-1"
            >
              Error{" "}
              {codeOutput.error && codeOutput.error.length > 0 && (
                <span className="text-[#D0FB51]">!</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-zinc-800 flex gap-1"
            >
              Logs{" "}
              {codeOutput.logs && codeOutput.logs.length > 0 && (
                <span className="text-[#D0FB51]">!</span>
              )}
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-grow">
            <TabsContent value="output" className="p-4 font-mono text-sm">
              <pre className="text-xl">{codeOutput.output}</pre>
            </TabsContent>
            <TabsContent value="error" className="p-4 font-mono text-sm">
              {codeOutput.error ? (
                <pre className="text-red-400 text-xl">{codeOutput.error}</pre>
              ) : (
                <p className="text-gray-400 flex items-center">
                  No errors
                  <span className="inline-block w-2 h-4 bg-white ml-1 animate-blink"></span>
                </p>
              )}
            </TabsContent>
            <TabsContent value="logs" className="p-4 font-mono text-sm">
              {Array.isArray(codeOutput.logs) && codeOutput.logs.length >= 1 ? (
                codeOutput.logs.map((log, index) => (
                  <pre className="text-xl" key={index}>
                    {log}
                  </pre>
                ))
              ) : (
                <p className="text-gray-400 flex items-center">
                  No logs
                  <span className="inline-block w-2 h-4 bg-white ml-1 animate-blink"></span>
                </p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-400">
          <p className="flex items-center">
            No output yet. Run your code to see the results
            <span className="inline-block w-2 h-4 bg-white ml-1 animate-blink"></span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Console;
