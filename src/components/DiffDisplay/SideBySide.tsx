import type { ReactNode } from "react";

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface SideBySideProps {
  parts: DiffPart[];
}

export default function SideBySide({ parts }: SideBySideProps) {
  const left: ReactNode[] = [];
  const right: ReactNode[] = [];

  // 合并连续的相同类型片段
  const mergedParts: Array<{
    type: "added" | "removed" | "normal";
    content: string[];
  }> = [];

  parts.forEach((part) => {
    const type = part.added ? "added" : part.removed ? "removed" : "normal";
    const lastPart = mergedParts[mergedParts.length - 1];

    if (lastPart && lastPart.type === type) {
      lastPart.content.push(part.value);
    } else {
      mergedParts.push({ type, content: [part.value] });
    }
  });

  mergedParts.forEach((p, i) => {
    const text = p.content.join("");

    // 统一的基础样式，确保所有文本高度一致
    const baseTextStyle = "leading-[1.75] align-baseline";

    if (p.type === "added") {
      left.push(
        <div key={`l-${i}`} className="flex items-center min-h-[1.75em]">
          <span className="text-slate-300 text-xs leading-[1.75]">·</span>
        </div>
      );
      right.push(
        <div key={`r-${i}`} className="flex items-center min-h-[1.75em]">
          <span
            className={`bg-emerald-100 text-emerald-900 rounded-md px-1.5 py-0.5 font-medium ${baseTextStyle}`}
          >
            {text}
          </span>
        </div>
      );
    } else if (p.type === "removed") {
      left.push(
        <div key={`l-${i}`} className="flex items-center min-h-[1.75em]">
          <span
            className={`bg-rose-100 text-rose-900 rounded-md px-1.5 py-0.5 font-medium relative ${baseTextStyle}`}
            style={{
              textDecoration: "line-through",
              textDecorationColor: "#e11d48",
              textDecorationThickness: "1.5px",
              textDecorationSkipInk: "none",
            }}
          >
            {text}
          </span>
        </div>
      );
      right.push(
        <div key={`r-${i}`} className="flex items-center min-h-[1.75em]">
          <span className="text-slate-300 text-xs leading-[1.75]">·</span>
        </div>
      );
    } else {
      left.push(
        <div key={`l-${i}`} className="flex items-center min-h-[1.75em]">
          <span className={`whitespace-pre-wrap ${baseTextStyle}`}>{text}</span>
        </div>
      );
      right.push(
        <div key={`r-${i}`} className="flex items-center min-h-[1.75em]">
          <span className={`whitespace-pre-wrap ${baseTextStyle}`}>{text}</span>
        </div>
      );
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DiffColumn title="原始文本" content={left} />
      <DiffColumn title="修改后文本" content={right} />
    </div>
  );
}

function DiffColumn({
  title,
  content,
}: {
  title: string;
  content: ReactNode[];
}) {
  return (
    <div className="text-[15px]">
      <div className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
        {title}
      </div>
      <div className="text-slate-900 bg-slate-50 rounded-xl p-6 min-h-[200px]">
        {content}
      </div>
    </div>
  );
}
