/**
 * Get job status for a given job-id
 */

// {
//     "status": {
//         "job_id": "cjckbmdFBZ",
//         "status": "processing",
//         "message": "Job Processing triggered",
//         "timestamp": "2025-10-30T18:05:21.729106"
//     }
// }

import { redis } from "@/lib/redis";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job_status = await redis.get(`job:${id}`);

  return Response.json({ status: job_status });
}
