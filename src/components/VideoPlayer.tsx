"use client";

import { useVideoStatusPolling } from "@/app/hooks/useVideoStatusPolling";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Video, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVideoArtifact } from "@/lib/db/dbOps";
import { SidePanelHeader } from "./ui/sidepanelHeader";

interface VideoPlayerProps {
  artifactId: string;
  title?: string;
}

export function VideoPlayer({
  artifactId,
  title = "Video Artifact",
}: VideoPlayerProps) {
  const { data, error, isPolling } = useVideoStatusPolling(artifactId, 2000);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Fetch video artifact from DB on mount to get videoUrl if already completed
  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        const artifact = await getVideoArtifact(artifactId);
        console.log("artifact", JSON.stringify(artifact));
        if (artifact?.videoUrl) {
          setVideoUrl(artifact.videoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch video artifact:", error);
      }
    };
    fetchArtifact();
  }, [artifactId]);

  // Update videoUrl from polling data when available
  useEffect(() => {
    const url = data?.video_url || data?.videoUrl;
    if (url) {
      setVideoUrl(url);
    }
  }, [data]);

  const handleDownload = () => {
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

  return (
    <div className="bg-[#fafafa]  rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <SidePanelHeader
        title={title}
        artifactId={artifactId}
        videoUrl={videoUrl!}
        isVideo
      />

      {/* Video Content */}
      <div className="flex-1 flex items-center justify-center bg-black p-4">
        {videoUrl ? (
          <video
            controls
            className="w-full h-1/2 "
            src={videoUrl}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">{data?.message || "Waiting for video..."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
