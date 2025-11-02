"use server";
import { nanoid } from "nanoid";
import { createVideoArtifact, updateVideoArtifactStatus } from "@/lib/db/dbOps";
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
      await updateVideoArtifactStatus(artifactId, "pending");

      const res = await TriggerVideoGeneration(
        code,
        quality,
        scene_name,
        artifactId,
      );

      if (!res.ok) {
        await updateVideoArtifactStatus(artifactId, "failed");
        throw new Error(
          `Failed to trigger video generation for artifact ${artifactId} : ${res.error}`,
        );
      }

      await updateVideoArtifactStatus(artifactId, "processing");
    } catch (err) {
      await updateVideoArtifactStatus(artifactId, "failed");
      throw err;
    }
  })();
  return artifactId;
}

export async function cancelGeneration(artifactId: string) {}
