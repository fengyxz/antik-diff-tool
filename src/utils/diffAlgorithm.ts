export interface DiffResult {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * 混合模式diff算法：智能识别中英文并分别处理
 */
export function mixedDiff(oldText: string, newText: string): DiffResult[] {
  const results: DiffResult[] = [];

  const tokenize = (text: string): string[] => {
    const tokens: string[] = [];
    let currentToken = "";
    let isEnglish = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const isCJK = /[\u4e00-\u9fff]/.test(char);
      const isSpace = /\s/.test(char);
      const isEngChar = /[a-zA-Z0-9]/.test(char);

      if (isCJK) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(char);
        isEnglish = false;
      } else if (isEngChar) {
        if (!isEnglish && currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        currentToken += char;
        isEnglish = true;
      } else if (isSpace) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(char);
        isEnglish = false;
      } else {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(char);
        isEnglish = false;
      }
    }

    if (currentToken) {
      tokens.push(currentToken);
    }

    return tokens;
  };

  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  // LCS (Longest Common Subsequence) 算法
  const m = oldTokens.length;
  const n = newTokens.length;
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldTokens[i - 1] === newTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 回溯构建diff结果
  let i = m,
    j = n;
  const changes: Array<{
    type: "equal" | "added" | "removed";
    value: string;
  }> = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      changes.unshift({ type: "equal", value: oldTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      changes.unshift({ type: "added", value: newTokens[j - 1] });
      j--;
    } else if (i > 0) {
      changes.unshift({ type: "removed", value: oldTokens[i - 1] });
      i--;
    }
  }

  // 合并相邻的相同类型变化
  for (const change of changes) {
    if (
      results.length > 0 &&
      results[results.length - 1].added === (change.type === "added") &&
      results[results.length - 1].removed === (change.type === "removed")
    ) {
      results[results.length - 1].value += change.value;
    } else {
      results.push({
        value: change.value,
        added: change.type === "added" ? true : undefined,
        removed: change.type === "removed" ? true : undefined,
      });
    }
  }

  return results;
}
