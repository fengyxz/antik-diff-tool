import { useMemo, useRef, useEffect, useState } from "react";

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface SideBySideProps {
  parts: DiffPart[];
}

interface LineHighlight {
  top: number;
  height: number;
}

export default function SideBySide({ parts }: SideBySideProps) {
  // 将 part 分解，按行处理
  const processedParts = useMemo(() => {
    const result: Array<{
      value: string;
      added?: boolean;
      removed?: boolean;
      isNewline?: boolean;
      lineCount?: number;
    }> = [];

    parts.forEach((part) => {
      // 对于 added/removed 的内容，需要按换行符拆分来对齐
      if ((part.added || part.removed) && part.value.includes("\n")) {
        const lines = part.value.split("\n");
        // 每一行（除了最后一个空字符串）都是一行内容
        lines.forEach((line, idx) => {
          // 跳过最后的空字符串（如果文本以\n结尾会产生）
          if (idx === lines.length - 1 && line === "") return;

          // 如果是纯换行符（空行）
          if (line === "") {
            result.push({
              value: "\n",
              added: part.added,
              removed: part.removed,
              isNewline: true,
              lineCount: 1,
            });
          } else {
            // 带内容的行
            result.push({
              value: line + (idx < lines.length - 1 ? "\n" : ""),
              added: part.added,
              removed: part.removed,
              isNewline: false,
              lineCount: 1,
            });
          }
        });
      } else {
        // 其他情况保持原样
        result.push({
          value: part.value,
          added: part.added,
          removed: part.removed,
          isNewline: false,
          lineCount: 0,
        });
      }
    });

    return result;
  }, [parts]);

  return (
    <div className="space-y-0">
      {/* 标题行 */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-2 border-b border-slate-200">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          原始文本
        </div>
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          修改后文本
        </div>
      </div>

      {/* 内容区域 - 左右两列，流式文本显示 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 左侧：原始文本 */}
        <DiffColumn parts={processedParts} side="left" />

        {/* 右侧：修改后文本 */}
        <DiffColumn parts={processedParts} side="right" />
      </div>
    </div>
  );
}

function DiffColumn({
  parts,
  side,
}: {
  parts: Array<{
    value: string;
    added?: boolean;
    removed?: boolean;
    isNewline?: boolean;
    lineCount?: number;
  }>;
  side: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | HTMLDivElement | null)[]>([]);
  const [lineHighlights, setLineHighlights] = useState<LineHighlight[]>([]);

  useEffect(() => {
    const computeLineHighlights = () => {
      if (!containerRef.current) return;

      const highlights: LineHighlight[] = [];
      const lineMap = new Map<
        number,
        {
          top: number;
          bottom: number;
          hasChange: boolean;
        }
      >();

      // 遍历所有元素，获取它们的视觉位置
      spanRefs.current.forEach((element, idx) => {
        if (!element) return;

        const part = parts[idx];
        if (!part) return;

        // 跳过不相关的部分
        if (side === "left" && part.added && !part.isNewline) return;
        if (side === "right" && part.removed && !part.isNewline) return;

        const range = document.createRange();
        range.selectNodeContents(element);
        const rects = range.getClientRects();

        // 判断是否是变更内容
        const isChange =
          (side === "left" && part.removed) || (side === "right" && part.added);

        // 遍历该元素的所有矩形（可能跨多行）
        for (let i = 0; i < rects.length; i++) {
          const rect = rects[i];
          // 使用 Math.round 将相近的 top 值归为同一行
          const lineKey = Math.round(rect.top);

          const existing = lineMap.get(lineKey);
          if (existing) {
            existing.bottom = Math.max(existing.bottom, rect.bottom);
            if (isChange) {
              existing.hasChange = true;
            }
          } else {
            lineMap.set(lineKey, {
              top: rect.top,
              bottom: rect.bottom,
              hasChange: isChange || false,
            });
          }
        }
      });

      // 转换为高亮区域
      const containerRect = containerRef.current.getBoundingClientRect();
      lineMap.forEach((line) => {
        if (line.hasChange) {
          highlights.push({
            top: line.top - containerRect.top,
            height: line.bottom - line.top,
          });
        }
      });

      setLineHighlights(highlights);
    };

    // 初始计算
    const timer = setTimeout(computeLineHighlights, 0);

    // 监听窗口大小变化
    const handleResize = () => {
      computeLineHighlights();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [parts, side]);

  const bgColor = side === "left" ? "bg-rose-50" : "bg-emerald-50";

  return (
    <div className="text-[15px] bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div
        ref={containerRef}
        className="p-4 md:p-6 min-h-[200px] leading-relaxed relative"
      >
        {/* 背景高亮层 */}
        {lineHighlights.map((highlight, idx) => (
          <div
            key={idx}
            className={`absolute left-0 right-0 pointer-events-none ${bgColor}`}
            style={{
              top: `${highlight.top}px`,
              height: `${highlight.height}px`,
            }}
          />
        ))}

        {/* 文本内容层 */}
        <div className="relative z-10">
          {parts.map((part, i) => {
            if (side === "left") {
              if (part.removed) {
                if (part.isNewline) {
                  // 删除的换行符：整行红色背景
                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        spanRefs.current[i] = el;
                      }}
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
                    ref={(el) => {
                      spanRefs.current[i] = el;
                    }}
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
                  // 新增的换行符（空行）：左侧整行灰色占位
                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        spanRefs.current[i] = el;
                      }}
                      className="bg-slate-100 -mx-6 px-6 min-h-[1.5em] flex items-center"
                    >
                      <span className="text-slate-500 select-none text-xs">
                        ···
                      </span>
                    </div>
                  );
                }
                // 如果新增的内容包含行（有换行符），左侧显示灰色占位行
                if (part.lineCount && part.lineCount > 0) {
                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        spanRefs.current[i] = el;
                      }}
                      className="bg-slate-100 -mx-6 px-6 min-h-[1.5em] flex items-center"
                    >
                      <span className="text-slate-500 select-none text-xs">
                        ···
                      </span>
                    </div>
                  );
                }
                // 行内新增：左侧不显示（保持空白对齐）
                return null;
              }
              // 未修改：纯文本
              return (
                <span
                  key={i}
                  ref={(el) => {
                    spanRefs.current[i] = el;
                  }}
                  className="text-slate-900 whitespace-pre-wrap"
                >
                  {part.value}
                </span>
              );
            } else {
              // side === "right"
              if (part.added) {
                if (part.isNewline) {
                  // 新增的换行符：整行绿色背景
                  return (
                    <span
                      key={i}
                      ref={(el) => {
                        spanRefs.current[i] = el;
                      }}
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
                    ref={(el) => {
                      spanRefs.current[i] = el;
                    }}
                    className="bg-emerald-200/50 text-emerald-500 font-medium whitespace-pre-wrap"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.removed) {
                if (part.isNewline) {
                  // 删除的换行符（空行）：右侧整行灰色占位
                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        spanRefs.current[i] = el;
                      }}
                      className="bg-slate-100 -mx-6 px-6 min-h-[1.5em] flex items-center"
                    >
                      <span className="text-slate-500 select-none text-xs">
                        ···
                      </span>
                    </div>
                  );
                }
                // 如果删除的内容包含行（有换行符），右侧显示灰色占位行
                if (part.lineCount && part.lineCount > 0) {
                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        spanRefs.current[i] = el;
                      }}
                      className="bg-slate-100 -mx-6 px-6 min-h-[1.5em] flex items-center"
                    >
                      <span className="text-slate-500 select-none text-xs">
                        ···
                      </span>
                    </div>
                  );
                }
                // 行内删除：右侧不显示（保持空白对齐）
                return null;
              }
              // 未修改：纯文本
              return (
                <span
                  key={i}
                  ref={(el) => {
                    spanRefs.current[i] = el;
                  }}
                  className="text-slate-900 whitespace-pre-wrap"
                >
                  {part.value}
                </span>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
