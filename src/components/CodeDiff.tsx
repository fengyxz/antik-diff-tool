import { codeDiff, type CodeDiffLine } from "../utils/codeDiff";
import { highlightCode } from "../utils/highlightCode";
import { useMemo } from "react";
import "highlight.js/styles/github.css";

interface CodeDiffProps {
  oldCode: string;
  newCode: string;
  language?: string;
}

export default function CodeDiff({ oldCode, newCode, language = "auto" }: CodeDiffProps) {
  const diffLines = useMemo(
    () => codeDiff(oldCode, newCode),
    [oldCode, newCode]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* 表头 */}
      <div className="grid grid-cols-[60px_1fr] bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 sticky top-0">
        <div className="px-3 py-2 text-right border-r border-slate-200">
          行号
        </div>
        <div className="px-4 py-2">内容</div>
      </div>

      {/* Diff 内容 */}
      <div className="font-mono text-[13px]">
        {diffLines.map((line, idx) => (
          <DiffLine key={idx} line={line} language={language} />
        ))}
      </div>
    </div>
  );
}

function DiffLine({ line, language }: { line: CodeDiffLine; language: string }) {
  const bgColor =
    line.type === "added"
      ? "bg-emerald-50"
      : line.type === "removed"
      ? "bg-rose-50"
      : "";

  const lineNumColor =
    line.type === "added"
      ? "text-emerald-600"
      : line.type === "removed"
      ? "text-rose-600"
      : "text-slate-400";

  const contentBg =
    line.type === "added"
      ? "bg-emerald-100/30"
      : line.type === "removed"
      ? "bg-rose-100/30"
      : "";

  const prefix =
    line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";

  const displayLineNum =
    line.type === "removed"
      ? line.lineNumber
      : line.type === "added"
      ? line.newLineNumber
      : line.lineNumber;

  return (
    <div
      className={`grid grid-cols-[60px_1fr] ${bgColor} border-b border-slate-100 last:border-b-0`}
    >
      {/* 行号 */}
      <div
        className={`px-3 py-1 text-right border-r border-slate-200 select-none ${lineNumColor} font-medium`}
      >
        {displayLineNum || ""}
      </div>

      {/* 内容 */}
      <div className={`px-4 py-1 flex items-center ${contentBg}`}>
        <span
          className={`inline-block w-4 ${
            line.type !== "unchanged" ? "font-bold" : ""
          } ${lineNumColor}`}
        >
          {prefix}
        </span>
        <code
          className={`flex-1 ${
            line.type === "removed"
              ? "text-rose-700"
              : line.type === "added"
              ? "text-emerald-700"
              : ""
          } whitespace-pre-wrap break-all`}
          dangerouslySetInnerHTML={{
            __html: line.content
              ? highlightCode(line.content, language)
              : " ",
          }}
        />
      </div>
    </div>
  );
}
