import { useMemo } from "react";

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface InlineDiffProps {
  parts: DiffPart[];
}

export default function InlineDiff({ parts }: InlineDiffProps) {
  // 将 part 分解，单独处理换行符
  const processedParts = useMemo(() => {
    const result: Array<{
      value: string;
      added?: boolean;
      removed?: boolean;
      isNewline?: boolean;
    }> = [];

    parts.forEach((part) => {
      // 只有纯换行符（且是 added/removed）才需要特殊处理
      if (part.value === "\n" && (part.added || part.removed)) {
        result.push({
          value: part.value,
          added: part.added,
          removed: part.removed,
          isNewline: true,
        });
      } else {
        // 其他所有情况保持原样
        result.push({
          value: part.value,
          added: part.added,
          removed: part.removed,
          isNewline: false,
        });
      }
    });

    return result;
  }, [parts]);

  return (
    <div className="text-[15px] leading-relaxed text-slate-900 bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 md:p-6 min-h-[200px]">
        {processedParts.map((part, i) => {
          if (part.removed) {
            if (part.isNewline) {
              // 删除的换行符：整行红色背景
              return (
                <div
                  key={i}
                  className="bg-rose-50 -mx-6 px-6 min-h-[1.5em] flex items-center"
                >
                  <span
                    className="text-rose-400 text-xs font-mono opacity-50"
                    title="删除的换行符"
                  >
                    ↵
                  </span>
                </div>
              );
            }
            // 删除：带删除线和背景
            return (
              <span
                key={i}
                className="bg-rose-200/50 text-rose-600 font-medium whitespace-pre-wrap"
                style={{
                  textDecoration: "line-through",
                  textDecorationColor: "#e11d48",
                  textDecorationThickness: "1.5px",
                }}
              >
                {part.value}
              </span>
            );
          }
          if (part.added) {
            if (part.isNewline) {
              // 新增的换行符：整行绿色背景
              return (
                <span
                  key={i}
                  className="bg-emerald-50 -mx-6 px-6 min-h-[1.5em] flex items-center"
                >
                  <span
                    className="text-emerald-400 text-xs font-mono opacity-50"
                    title="新增的换行符"
                  >
                    ↵
                  </span>
                </span>
              );
            }
            // 新增：带背景高亮
            return (
              <span
                key={i}
                className="bg-emerald-200/50 text-emerald-500 font-medium whitespace-pre-wrap"
              >
                {part.value}
              </span>
            );
          }
          // 未修改：纯文本
          return (
            <span key={i} className="text-slate-900 whitespace-pre-wrap">
              {part.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}
