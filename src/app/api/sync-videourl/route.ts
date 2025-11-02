import {
  setVideoArtifactVideoUrl,
  updateVideoArtifactStatus,
} from "@/lib/db/dbOps";
import { NextResponse } from "next/server";

/**
 * Syncs video status from polling data to Database
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { status, videoUrl } = body;

    console.log(`Syncing video status for job ${jobId}:`, { status, videoUrl });

    // Update database
    await updateVideoArtifactStatus(jobId, status);

    if (status === "completed" && videoUrl) {
      await setVideoArtifactVideoUrl(jobId, videoUrl);
      console.log(`Updated video URL in database: ${videoUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: "Video status synced to database",
    });
  } catch (error) {
    console.error("Error syncing video status:", error);
    return NextResponse.json(
      { error: "Failed to sync status" },
      { status: 500 },
    );
  }
}
