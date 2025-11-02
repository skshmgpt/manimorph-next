import { startGeneration } from "@/lib/services/videoService";
export async function POST(req: Request) {
  const { code, quality, scene_name, chatId, name } = await req.json();
  const artifactId = await startGeneration(
    code,
    quality,
    scene_name,
    chatId,
    name,
  );
  return Response.json({ artifactId: artifactId });
}
