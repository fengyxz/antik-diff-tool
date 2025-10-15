interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface InlineDiffProps {
  parts: DiffPart[];
}

export default function InlineDiff({ parts }: InlineDiffProps) {
  // 合并连续的相同类型片段以实现连续的删除线
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

  // 统一的基础样式，确保所有文本高度一致
  const baseTextStyle = "leading-[1.75] align-baseline";

  return (
    <div className="text-[15px] leading-relaxed text-slate-900 bg-slate-50 rounded-xl p-6 min-h-[200px]">
      {mergedParts.map((part, i) => {
        const text = part.content.join("");

        if (part.type === "added") {
          return (
            <span
              key={i}
              className={`bg-emerald-100 text-emerald-900 rounded-md px-1.5 py-0.5 font-medium ${baseTextStyle}`}
            >
              {text}
            </span>
          );
        }
        if (part.type === "removed") {
          return (
            <span
              key={i}
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
          );
        }
        return (
          <span key={i} className={`whitespace-pre-wrap ${baseTextStyle}`}>
            {text}
          </span>
        );
      })}
    </div>
  );
}
