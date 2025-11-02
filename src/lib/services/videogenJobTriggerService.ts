"use server";

// core flow call /generate-video - return response , move this function to api
// route, python backend handles everything

import { MANIM_API_URL } from "@/config";
import axios, { AxiosError } from "axios";

/*
 this function is called from a separate function
 that generates the job/artifact and put it in db
 this function just calls the manim endpoint and triggers
 the video generation process
*/
export async function TriggerVideoGeneration(
  code: string,
  quality: string,
  scene_name: string,
  artifactId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await axios.post(`${MANIM_API_URL}/generate-video`, {
      manim_code: code,
      job_id: artifactId,
      quality: quality,
      scene_name: scene_name,
    });
    if (response.status === 202) {
      return { ok: true };
    }
    return { ok: false, error: "unexpected status" };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "unknown error" };
  }
}

/*
optimal flow -
createJob(){
  job_id = nanoid()
  await db.create_job(job_id)

  await TriggerVideoGeneration(code, quality, job_id)

  await db.update_job(job_id, { status: "pending" });

  return job_id}
*/
