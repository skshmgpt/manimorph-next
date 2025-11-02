import { create } from "zustand";

interface ChatStore {
  pendingMsg: string;
  setPendingMsg: (msg: string) => void;

  // Editor state
  isEditorOpen: boolean;
  editorCode: string | null;
  editorTitle: string;
  setEditorOpen: (open: boolean) => void;
  setEditorCode: (code: string | null, title?: string) => void;

  // Video state
  isVideoOpen: boolean;
  videoArtifactId: string | null;
  videoTitle: string;
  setVideoOpen: (open: boolean) => void;
  setVideoArtifact: (artifactId: string | null, title?: string) => void;

  // Clear all panel state
  clearPanels: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  pendingMsg: "",
  setPendingMsg: (msg: string) => set({ pendingMsg: msg }),

  // Editor state
  isEditorOpen: false,
  editorCode: null,
  editorTitle: "Code Artifact",
  setEditorOpen: (open: boolean) => set({ isEditorOpen: open }),
  setEditorCode: (code: string | null, title = "Code Artifact") =>
    set({
      editorCode: code,
      editorTitle: title,
      isEditorOpen: code !== null,
      // Close video when opening code
      isVideoOpen: false,
    }),

  // Video state
  isVideoOpen: false,
  videoArtifactId: null,
  videoTitle: "Video Artifact",
  setVideoOpen: (open: boolean) => set({ isVideoOpen: open }),
  setVideoArtifact: (artifactId: string | null, title = "Video Artifact") =>
    set({
      videoArtifactId: artifactId,
      videoTitle: title,
      isVideoOpen: artifactId !== null,
      // Close code editor when opening video
      isEditorOpen: false,
    }),

  // Clear all panel state (call when navigating to new chat)
  clearPanels: () =>
    set({
      isEditorOpen: false,
      editorCode: null,
      isVideoOpen: false,
      videoArtifactId: null,
    }),
}));
