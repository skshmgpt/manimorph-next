interface VideoPreviewProps {
   status: string;
   videoUrl: string | null;
   error: string | null;
   isConnected: boolean;
   jobId: string;
}

export function VideoPreview({ status, videoUrl, error, isConnected, jobId }: VideoPreviewProps) {
   const getStatusMessage = () => {
      switch (status) {
         case 'idle':
            return 'Ready to generate video';
         case 'generating_video':
            return 'Generating video with Manim...';
         case 'uploading_video':
            return 'Uploading video to cloud...';
         case 'completed':
            return 'Video ready!';
         case 'failed':
            return 'Generation failed';
         default:
            return `Status: ${status}`;
      }
   };

   // Safe jobId display with proper type checking
   const displayJobId = () => {
      if (typeof jobId === 'string' && jobId.length > 0) {
         return jobId.length > 8 ? `${jobId.slice(0, 8)}...` : jobId;
      }
      return 'Unknown';
   };

   return (
      <div className="border rounded-lg p-4">
         <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${
               isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600">
               Job: {displayJobId()}
            </span>
         </div>
         
         <div className="mb-3">
            <p className="font-medium">{getStatusMessage()}</p>
            {status === 'generating_video' || status === 'uploading_video' ? (
               <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2" />
               </div>
            ) : null}
         </div>
         
         {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
               <p className="text-red-700 text-sm">{error}</p>
            </div>
         )}
         
         {videoUrl && (
            <video 
               controls 
               className="w-full rounded"
               src={videoUrl}
            >
               Your browser does not support the video tag.
            </video>
         )}
      </div>
   );
}