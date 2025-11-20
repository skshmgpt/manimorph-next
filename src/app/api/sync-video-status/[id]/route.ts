import { updateVideoArtifact } from "@/lib/db/dbOps";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ artifactId: string }> },
) {
  const { artifactId } = await params;
  const { status, url } = await req.json();

  const resp = await updateVideoArtifact(artifactId, {
    videoUrl: url,
    status: status,
  });

  return resp !== null ? Response.json({ artifact: resp }) : Response.error;
}
