import promptConfig from "./config.json";
import { getSystemPrompt } from "@/lib/.server/llm/prompts";

// Only execute this on the server side
let ANALYSER_SYSTEM_PROMPT: string = "";
let CODER_SYSTEM_PROMPT: string = "";
let MANIM_API_URL: string = "";

try {
  // Only run this on the server
  if (typeof window === "undefined") {
    ANALYSER_SYSTEM_PROMPT = getSystemPrompt();
    CODER_SYSTEM_PROMPT = promptConfig.coder_system_prompt;
    MANIM_API_URL = process.env.MANIM_URL || "";
  }
} catch (error) {
  console.error("Failed to load config.json:", error);
}

export { ANALYSER_SYSTEM_PROMPT, CODER_SYSTEM_PROMPT, MANIM_API_URL };
