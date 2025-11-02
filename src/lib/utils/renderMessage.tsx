"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { renderWithLatex } from "../renderWithLatex";
import React, { useEffect, SetStateAction, Dispatch, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { UIMessage } from "ai";
import { Artifact } from "@/components/chat/Artifact";
import { useChatStore } from "@/app/stores/useChatStore";
import { Message } from "../types";

// Streaming-safe parser
export function parseStreamingManimResponse(content: string) {
  // Find <manim_breakdown>...</manim_breakdown> (may be partial)
  //
  if (!content || typeof content !== "string") {
    return { explanation: "", breakdown: null, code: null };
  }
  const breakdownStart = content.indexOf("<manim_breakdown>");
  const breakdownEnd = content.indexOf("</manim_breakdown>");
  let breakdown = null;
  if (breakdownStart !== -1) {
    if (breakdownEnd !== -1) {
      breakdown = content.slice(
        breakdownStart + "<manim_breakdown>".length,
        breakdownEnd,
      );
    } else {
      breakdown = content.slice(breakdownStart + "<manim_breakdown>".length);
    }
  }

  // Find <code>...</code> (may be partial)
  const codeStart = content.indexOf("<code>");
  const codeEnd = content.indexOf("</code>");
  let code = null;
  if (codeStart !== -1) {
    if (codeEnd !== -1) {
      code = content.slice(codeStart + "<code>".length, codeEnd);
    } else {
      code = content.slice(codeStart + "<code>".length);
    }
  }

  // Explanation is everything before <manim_breakdown>
  let explanation = "";
  if (breakdownStart !== -1) {
    explanation = content.slice(0, breakdownStart).trim();
  } else {
    explanation = content.trim();
  }

  return { explanation, breakdown, code };
}

// Simple breakdown parser (as before)
export function parseBreakdownXML(xml: string) {
  if (!xml)
    return { title: "", concept: "", steps: [], formula: "", visual_style: "" };
  const getTag = (tag: string) => {
    const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "m"));
    return match ? match[1].trim() : null;
  };

  const scene_info = getTag("scene_info");
  const animation_sequence = getTag("animation_sequence");
  const text_and_labels = getTag("text_and_labels");
  const visual_style = getTag("visual_style");

  // Parse steps
  const steps: {
    action: string;
    targets: string;
    description: string;
    purpose: string;
  }[] = [];
  if (animation_sequence) {
    const stepRegex = /<step[\s\S]*?>([\s\S]*?)<\/step>/g;
    let match;
    while ((match = stepRegex.exec(animation_sequence))) {
      const stepXML = match[1];
      const getStepTag = (tag: string) => {
        const m = stepXML.match(
          new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "m"),
        );
        return m ? m[1].trim() : null;
      };
      steps.push({
        action: getStepTag("action") || "",
        targets: getStepTag("targets") || "",
        description: getStepTag("description") || "",
        purpose: getStepTag("purpose") || "",
      });
    }
  }

  // Parse scene info
  let title = "";
  let concept = "";
  if (scene_info) {
    const t = scene_info.match(/<title>([\s\S]*?)<\/title>/);
    const c = scene_info.match(/<concept>([\s\S]*?)<\/concept>/);
    title = t ? t[1].trim() : "";
    concept = c ? c[1].trim() : "";
  }

  // Parse formula from text_and_labels
  let formula = "";
  if (text_and_labels) {
    const f = text_and_labels.match(/<content>([\s\S]*?)<\/content>/);
    formula = f ? f[1].trim() : "";
  }

  return { title, concept, steps, formula, visual_style };
}

// Helper function to extract content and reasoning from parts

// Helper function to extract content and reasoning from parts
function extractFromParts(parts: UIMessage["parts"]) {
  let content = "";
  let reasoning = "";

  if (!parts || parts.length === 0) {
    return { content, reasoning };
  }

  parts.forEach((part) => {
    if (part.type === "text" && "text" in part) {
      content += part.text;
    } else if (part.type === "reasoning") {
      // Handle both possible property names for reasoning
      reasoning += part.reasoning;
    }
  });

  return { content, reasoning };
}

export default function RenderMessage(
  message: Partial<UIMessage & Message>,
  setUiState?: Dispatch<SetStateAction<"code" | "video" | "chat">>,
  setCode?: Dispatch<SetStateAction<string | null>>,
): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { setEditorCode, setVideoArtifact } = useChatStore();

  // Extract content and reasoning from parts array
  const { content: extractedContent, reasoning: extractedReasoning } =
    extractFromParts(message.parts!);

  // Fallback to content and reasoning properties if parts are empty
  const content = extractedContent || message.content || "";
  const reasoning = extractedReasoning || message.reasoning || "";
  const role = message.role;

  const { explanation, breakdown, code } = parseStreamingManimResponse(content);
  const { title, concept, steps, formula } = parseBreakdownXML(
    breakdown as string,
  );

  const handleOpenInEditor = () => {
    if (code) {
      setEditorCode(code, title || "Manim Animation Code");
    }
  };

  const handleOpenVideo = () => {
    if (message.artifactId) {
      setVideoArtifact(message.artifactId, title || "Animation");
    }
  };

  function renderReasoning(reasoning: string) {
    return (
      <div className="mb-6 transition-all duration-500 ease-out">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-all duration-300 ease-out group w-full text-left">
            <div className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-zinc-800/50 transition-all duration-200 group-hover:shadow-sm">
              <div
                className={`transform transition-all duration-300 ease-out ${isOpen ? "rotate-0 text-blue-400" : "-rotate-90 text-zinc-500"}`}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium group-hover:text-zinc-100">
                Thinking
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-zinc-600 via-zinc-700 to-transparent ml-2 opacity-60 group-hover:opacity-80 transition-opacity duration-200"></div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="overflow-hidden transition-all duration-500 ease-out data-[state=closed]:animate-fade-out-slide data-[state=open]:animate-fade-in-slide">
            <div className="transform transition-all duration-500 ease-out">
              <div className="mt-3 mb-4 mx-3">
                <div className="p-4 bg-gradient-to-br from-zinc-900/90 to-zinc-800/70 border border-zinc-700/60 rounded-lg backdrop-blur-sm shadow-xl ring-1 ring-zinc-600/20">
                  <div className="border-l-3 border-gradient-to-b from-blue-400 to-blue-600 pl-4">
                    <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap overflow-wrap-anywhere">
                      {renderWithLatex(reasoning as string)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
  // For user messages, just render as before
  if (role === "user") {
    return (
      <div className="mb-4 p-3 rounded-lg break-words text-sm">
        <div className="font-bold mb-1">You</div>
        <div className="whitespace-pre-wrap overflow-wrap-anywhere">
          {renderWithLatex(content)}
        </div>
      </div>
    );
  }

  // If only <plainResponse>
  if (content.includes("<plainResponse>")) {
    const plain = content
      .replace(/<plainResponse>/, "")
      .replace(/<\/plainResponse>/, "")
      .trim();
    return (
      <>
        <div className="mb-4 p-3 rounded-lg break-words text-sm">
          <div className="font-bold mb-1">Manimorph</div>
          {reasoning && renderReasoning(reasoning)}
          <div className="whitespace-pre-wrap overflow-wrap-anywhere">
            {renderWithLatex(plain)}
          </div>
        </div>
      </>
    );
  }

  // Render streaming breakdown
  return (
    <div className="mb-4 p-3 rounded-lg break-words text-sm">
      <div className="font-bold mb-2 flex items-center">Manimorph</div>

      {reasoning && renderReasoning(reasoning)}

      {/* Initial explanation */}
      {explanation && (
        <div className="mb-4 leading-relaxed">
          {renderWithLatex(explanation)}
        </div>
      )}

      {/* Artifact: Breakdown visualization */}
      {breakdown && (
        <div className="bg-[#121214] border border-[#2A2A2C] rounded-lg p-4 shadow-lg animate-fadeIn mb-4">
          <h3 className="text-black dark:text-white font-bold mb-2 flex items-center">
            {title || "Animation Breakdown"}
          </h3>
          {concept && (
            <div className="mb-2 text-[#B0B0B0] italic">{concept}</div>
          )}

          <ol className="space-y-2 ml-1 mb-2">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start group pb-1">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-0.5 group-hover:bg-white transition-colors text-black">
                  <span className="text-xs font-medium">{i + 1}</span>
                </div>
                <span className="text-black dark:text-white group-hover:text-white transition-colors">
                  <b>{step.action}</b>: {renderWithLatex(step.description)}
                  {step.purpose && (
                    <span className="ml-2 text-xs text-[#A0FFA0]">
                      ({step.purpose})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>

          {formula && (
            <div className="mt-2 text-center text-lg font-bold text-[#FFD700]">
              {renderWithLatex(formula)}
            </div>
          )}
        </div>
      )}

      {/* Code Artifact */}
      {code && (
        <Artifact
          type="Code"
          title={title || "Manim Animation Code"}
          onOpenInSidePanelAction={handleOpenInEditor}
        />
      )}
      {message.artifactId && (
        <Artifact
          type="video"
          title={title || "Animation"}
          onOpenInSidePanelAction={handleOpenVideo}
        />
      )}
    </div>
  );
}
