"use client";

import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CopyCheck, Download, Play, X } from "lucide-react";
import { SidePanelHeader } from "./ui/sidepanelHeader";

interface CodeEditorProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeEditor({
  code,
  language = "python",
  title = "Code Artifact",
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [copySuccess, setCopySuccess] = useState(0);

  useEffect(() => {
    if (copySuccess === 0) return;
    const timer = setTimeout(() => setCopySuccess(0), 2000);
    return () => clearTimeout(timer);
  }, [copySuccess]);

  return (
    <div
      className={`bg-[#fafafa] border border-gray-700 rounded-lg overflow-hidden ${isFullscreen ? "fixed inset-4 z-50" : "h-full"}`}
    >
      {/* Header */}
      <SidePanelHeader title={title} code={code} isVideo={false} />
      {/* Editor */}
      <div
        className={`${isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[calc(100%-3rem)]"}`}
      >
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "off",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 1,
            insertSpaces: false,
            wordWrap: "on",
            folding: true,
            lineDecorationsWidth: 3,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            readOnly: true,
          }}
        />
      </div>
    </div>
  );
}
