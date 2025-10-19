import { codeDiff, type CodeDiffLine } from "../utils/codeDiff";
import { useMemo } from "react";

interface CodeDiffProps {
  oldCode: string;
  newCode: string;
}

export default function CodeDiff({ oldCode, newCode }: CodeDiffProps) {
  const diffLines = useMemo(
    () => codeDiff(oldCode, newCode),
    [oldCode, newCode]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* 表头 */}
      <div className="grid grid-cols-[60px_60px_1fr] bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 sticky top-0">
        <div className="px-3 py-2 text-right border-r border-slate-200">
          原行
        </div>
        <div className="px-3 py-2 text-right border-r border-slate-200">
          新行
        </div>
        <div className="px-4 py-2">内容</div>
      </div>

      {/* Diff 内容 */}
      <div className="font-mono text-[13px]">
        {diffLines.map((line, idx) => (
          <DiffLine key={idx} line={line} />
        ))}
      </div>
    </div>
  );
}

function DiffLine({ line }: { line: CodeDiffLine }) {
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

  const prefix =
    line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";

  return (
    <div
      className={`grid grid-cols-[60px_60px_1fr] ${bgColor} border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50`}
    >
      {/* 原行号 */}
      <div
        className={`px-3 py-1 text-right border-r border-slate-200 select-none ${lineNumColor} text-xs`}
      >
        {line.lineNumber || ""}
      </div>

      {/* 新行号 */}
      <div
        className={`px-3 py-1 text-right border-r border-slate-200 select-none ${lineNumColor} text-xs`}
      >
        {line.newLineNumber || ""}
      </div>

      {/* 内容 */}
      <div className="px-4 py-1 flex items-center">
        <span className={`inline-block w-4 font-bold ${lineNumColor} mr-2`}>
          {prefix}
        </span>
        <span
          className={`flex-1 ${
            line.type === "removed"
              ? "text-rose-700 bg-rose-100/20"
              : line.type === "added"
              ? "text-emerald-700 bg-emerald-100/20"
              : "text-slate-700"
          } whitespace-pre-wrap break-all px-1 rounded`}
        >
          {line.content || " "}
        </span>
      </div>
    </div>
  );
}
