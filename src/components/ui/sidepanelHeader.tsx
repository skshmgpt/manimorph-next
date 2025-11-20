import { useState } from "react";
import { Button } from "./button";
import {
  CheckCircle2,
  Code,
  Copy,
  CopyCheck,
  Download,
  Loader2,
  Video,
  XCircle,
} from "lucide-react";
import { useVideoStatusPolling } from "@/app/hooks/useVideoStatusPolling";
import { useChatStore } from "@/app/stores/useChatStore";

type SidePanelHeaderProps = {
  title: string;
  isVideo: boolean;
  code?: string;
  videoUrl?: string;
  artifactId?: string;
};

export const SidePanelHeader = ({
  title,
  isVideo,
  code,
  videoUrl,
  artifactId,
}: SidePanelHeaderProps) => {
  const [copySuccess, setCopySuccess] = useState(0);
  const { data, error } = useVideoStatusPolling(artifactId!, 2000);
  const { setEditorOpen, setVideoOpen } = useChatStore();

  const toggleEditor = (type: "video" | "code") => {
    if (type === "code") {
      setEditorOpen(true);
      setVideoOpen(false);
    } else {
      setEditorOpen(false);
      setVideoOpen(true);
    }
  };

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getStatusDisplay = () => {
    if (error)
      return {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        text: "Error",
      };
    if (!data)
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: "Loading...",
      };

    switch (data.status) {
      case "pending":
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />,
          text: "Queued",
        };
      case "processing":
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin text-blue-500" />,
          text: "Processing",
        };
      case "completed":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
          text: "Completed",
        };
      case "failed":
        return {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          text: "Failed",
        };
      default:
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: data.status,
        };
    }
  };

  const status = getStatusDisplay();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code!);
      setCopySuccess(1);
    } catch {
      setCopySuccess(-1);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code!], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between p-3 text-black dark:text-white">
      <div className="w-16 h-8 bg-zinc-100 border border-border rounded-sm flex flex-row justify-center *:w-1/2 *:rounded-sm *:justify-center *:items-center *:flex">
        <div
          onClick={() => toggleEditor("code")}
          className={`${isVideo ? "bg-transparent text-zinc-500" : "bg-white text-black"}`}
        >
          <Code className="" />
        </div>
        <div
          onClick={() => toggleEditor("video")}
          className={`${!isVideo ? "bg-transparent text-zinc-500" : "bg-white text-black"}`}
        >
          <Video />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="ml-2 text-sm font-medium">{title}</span>
      </div>
      {isVideo == false ? (
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
      ) : (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs">
            {status.icon}
            <span>{status.text}</span>
          </div>
          {videoUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadVideo}
              className="hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
