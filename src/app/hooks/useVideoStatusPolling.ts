import { useEffect, useRef, useState } from "react";

type __job_status = {
  job_id: string;
  status: string;
  message: string;
  video_url?: string; // Note: using snake_case from backend
  videoUrl?: string; // Also support camelCase
  timestamp?: string;
};

type ApiResponse = {
  status: __job_status;
};

export const useVideoStatusPolling = (
  job_id: string,
  pollingInterval: number = 5000,
) => {
  const [data, setData] = useState<__job_status | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!job_id) return;

    let isMounted = true;

    const poll = async () => {
      try {
        const res = await fetch(`/api/job/${job_id}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch job status: ${res.statusText}`);
        }

        const responseData: ApiResponse = await res.json();

        if (isMounted) {
          setData(responseData.status);

          // Stop polling if job is completed or failed
          const status = responseData.status.status.toLowerCase();
          if (status === "completed" || status === "failed") {
            setIsPolling(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            // Sync to database via API route (not direct server action call)
            const videoUrl =
              responseData.status.video_url || responseData.status.videoUrl;

            if (videoUrl) {
              console.log(`Syncing video URL to database: ${videoUrl}`);
              try {
                await fetch(`/api/sync-video-status/${job_id}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    status: responseData.status.status,
                    videoUrl: videoUrl,
                  }),
                });
                console.log("Successfully synced to database");
              } catch (syncError) {
                console.error("Failed to sync to database:", syncError);
              }
            } else {
              console.warn("No video URL in response to sync");
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setIsPolling(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    };

    // Poll immediately on mount
    poll();

    // Set up interval for subsequent polls
    if (isPolling) {
      intervalRef.current = setInterval(poll, pollingInterval);
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [job_id, pollingInterval, isPolling]);

  // Manual stop function
  const stopPolling = () => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Manual restart function
  const restartPolling = () => {
    setIsPolling(true);
  };

  return {
    data,
    error,
    isPolling,
    stopPolling,
    restartPolling,
  };
};
