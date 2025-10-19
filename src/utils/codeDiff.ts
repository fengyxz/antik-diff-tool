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
    // diffLines 返回的每个 change.value 是完整的文本块
    // 我们需要按换行符分割，但要保留空行
    const text = change.value;

    // 如果文本以换行结尾，split 会产生额外的空字符串，需要移除
    // 但如果文本中间有空行（如 "a\n\nb"），需要保留
    const lines = text.split("\n");

    // 如果最后一个是空字符串且是因为末尾换行产生的，移除它
    if (
      lines.length > 0 &&
      lines[lines.length - 1] === "" &&
      text.endsWith("\n")
    ) {
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
