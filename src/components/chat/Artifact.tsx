"use client";

interface CodeArtifactProps {
  type: string;
  version?: string;
  onOpenInSidePanelAction: () => void;
  title: string;
}

export function Artifact({
  type,
  version = "v1",
  title,
  onOpenInSidePanelAction,
}: CodeArtifactProps) {
  return (
    <div
      className=" border border-border rounded-md overflow-hidden my-4 hover:bg-white hover:cursor-grab h-16"
      onClick={onOpenInSidePanelAction}
    >
      {/* Header */}
      <div className="flex justify-start flex-col justify-between p-3">
        <p>{title}</p>
        <div className="flex items-center space-x-2 [&>*]:text-sm  [&>*]:font-medium  [&>*]:text-zinc-400  ">
          <span>{type}</span>
          <span>·</span>
          <span>{version}</span>
        </div>
      </div>
    </div>
  );
}
