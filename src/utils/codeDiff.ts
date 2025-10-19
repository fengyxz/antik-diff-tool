import { diffLines } from "diff";

export interface CodeDiffLine {
  lineNumber: number | null; // 左侧行号
  newLineNumber: number | null; // 右侧行号
  content: string;
  type: "added" | "removed" | "unchanged";
}

/**
 * 代码行级别 diff 算法
 * 类似 GitHub 的代码对比功能
 */
export function codeDiff(oldCode: string, newCode: string): CodeDiffLine[] {
  const changes = diffLines(oldCode, newCode);
  const result: CodeDiffLine[] = [];
  
  let oldLineNum = 1;
  let newLineNum = 1;

  changes.forEach((change) => {
    const lines = change.value.split("\n");
    // 移除最后的空字符串（如果文本以换行结尾）
    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    lines.forEach((line) => {
      if (change.removed) {
        // 删除的行
        result.push({
          lineNumber: oldLineNum++,
          newLineNumber: null,
          content: line,
          type: "removed",
        });
      } else if (change.added) {
        // 新增的行
        result.push({
          lineNumber: null,
          newLineNumber: newLineNum++,
          content: line,
          type: "added",
        });
      } else {
        // 未修改的行
        result.push({
          lineNumber: oldLineNum++,
          newLineNumber: newLineNum++,
          content: line,
          type: "unchanged",
        });
      }
    });
  });

  return result;
}

