"use server";
import { nanoid } from "nanoid";
import { createVideoArtifact, updateVideoArtifact } from "@/lib/db/dbOps";
import { TriggerVideoGeneration } from "@/lib/services/videogenJobTriggerService";

export async function startGeneration(
  code: string,
  quality: string,
  scene_name: string,
  chatId: string,
  name: string,
): Promise<string> {
  const artifactId = nanoid(10);

  (async () => {
    try {
      const artifact = await createVideoArtifact(artifactId, name, chatId);
      await updateVideoArtifact(artifactId, { status: "processing" });

      const res = await TriggerVideoGeneration(
        code,
        quality,
        scene_name,
        artifactId,
      );

      if (!res.ok) {
        await updateVideoArtifact(artifactId, { status: "failed" });
        throw new Error(
          `Failed to trigger video generation for artifact ${artifactId} : ${res.error}`,
        );
      }

      await updateVideoArtifact(artifactId, { status: "processing" });
    } catch (err) {
      await updateVideoArtifact(artifactId, { status: "failed" });
      throw err;
    }
  })();
  return artifactId;
}

// TODO
export async function cancelGeneration(artifactId: string) {}
