// "use client";

// import { Editor } from "@monaco-editor/react";
// import { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Copy,
//   CopyCheck,
//   CopyCheckIcon,
//   Download,
//   Play,
//   X,
// } from "lucide-react";

// interface CodeEditorProps {
//   code: string;
//   language?: string;
//   title?: string;
// }

// export function CodeEditor({
//   code,
//   language = "python",
//   title = "Code Artifact",
// }: CodeEditorProps) {
//   const [editorCode, setEditorCode] = useState(code);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const [copySuccess, setCopySuccess] = useState(0);

//   useEffect(() => {
//     if (copySuccess === 0) return;
//     const timer = setTimeout(() => setCopySuccess(0), 2000);
//     return () => clearTimeout(timer);
//   }, [copySuccess]);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(editorCode);
//       setCopySuccess(1);
//     } catch {
//       setCopySuccess(-1);
//     }
//   };
//   const handleDownload = () => {
//     const blob = new Blob([editorCode], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.py`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     // };

//     return (
//       <div
//         className={`bg-[#fafafa] border border-gray-700 rounded-lg overflow-hidden ${isFullscreen ? "fixed inset-4 z-50" : "h-full"}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-3 text-black dark:text-white">
//           <div className="flex items-center space-x-2">
//             <span className="ml-2 text-sm font-medium">{title}</span>
//           </div>

//           <div className="flex items-center space-x-2">
//             <span
//               className={`${copySuccess === 1 ? "text-green-600" : "text-red-600"}`}
//             >
//               {copySuccess === 1
//                 ? "Copied To clipboard !"
//                 : copySuccess === -1
//                   ? "Failed to copy to clipboard !"
//                   : ""}
//             </span>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleCopy}
//               className="hover:text-white hover:bg-gray-700"
//             >
//               {copySuccess === 1 ? (
//                 <CopyCheck className="w-4 h-4" />
//               ) : (
//                 <Copy className="w-4 h-4" />
//               )}
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleDownload}
//               className="text-gray-400 hover:text-white hover:bg-gray-700"
//             >
//               <Download className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Editor */}
//         <div
//           className={`${isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[calc(100%-3rem)]"}`}
//         >
//           <Editor
//             height="100%"
//             language={language}
//             value={editorCode}
//             theme="vs"
//             options={{
//               minimap: { enabled: false },
//               fontSize: 14,
//               lineNumbers: "off",
//               roundedSelection: false,
//               scrollBeyondLastLine: false,
//               automaticLayout: true,
//               tabSize: 1,
//               insertSpaces: false,
//               wordWrap: "on",
//               folding: true,
//               lineDecorationsWidth: 3,
//               lineNumbersMinChars: 3,
//               glyphMargin: false,
//               readOnly: true,
//             }}
//           />
//         </div>
//       </div>
//     );
//   };
// }

"use client";

import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CopyCheck, Download, Play, X } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onClose: () => void;
  language?: string;
  title?: string;
}

export function CodeEditor({
  code,
  onClose,
  language = "python",
  title = "Code Artifact",
}: CodeEditorProps) {
  const [editorCode, setEditorCode] = useState(code);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [copySuccess, setCopySuccess] = useState(0);

  useEffect(() => {
    if (copySuccess === 0) return;
    const timer = setTimeout(() => setCopySuccess(0), 2000);
    return () => clearTimeout(timer);
  }, [copySuccess]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorCode);
      setCopySuccess(1);
    } catch {
      setCopySuccess(-1);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editorCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    // Placeholder for run functionality
    console.log("Running code:", editorCode);
    // You could integrate with a code execution service here
  };

  return (
    <div
      className={`bg-[#fafafa] border border-gray-700 rounded-lg overflow-hidden ${isFullscreen ? "fixed inset-4 z-50" : "h-full"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 text-black dark:text-white">
        <div className="flex items-center space-x-2">
          <span className="ml-2 text-sm font-medium">{title}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`${copySuccess === 1 ? "text-green-600" : "text-red-600"}`}
          >
            {copySuccess === 1
              ? "Copied To clipboard !"
              : copySuccess === -1
                ? "Failed to copy to clipboard !"
                : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="hover:text-white hover:bg-gray-700"
          >
            {copySuccess === 1 ? (
              <CopyCheck className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        className={`${isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[calc(100%-3rem)]"}`}
      >
        <Editor
          height="100%"
          language={language}
          value={editorCode}
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
