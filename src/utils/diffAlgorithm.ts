import { diffArrays } from "diff";

export interface DiffResult {
  value: string;
  count?: number;
  added?: boolean;
  removed?: boolean;
}

/**
 * 智能分词器：识别中英文并分别处理
 * - 中文字符（CJK）：逐字分割
 * - 英文字母/数字：保持单词完整
 * - 空格和符号：单独作为 token
 */
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  let currentToken = "";
  let isEnglish = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isCJK = /[\u4e00-\u9fff]/.test(char);
    const isSpace = /\s/.test(char);
    const isEngChar = /[a-zA-Z0-9]/.test(char);

    if (isCJK) {
      // 中文字符：先保存当前 token，然后将中文字单独作为 token
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = "";
      }
      tokens.push(char);
      isEnglish = false;
    } else if (isEngChar) {
      // 英文字符：如果之前不是英文，先保存当前 token
      if (!isEnglish && currentToken) {
        tokens.push(currentToken);
        currentToken = "";
      }
      currentToken += char;
      isEnglish = true;
    } else if (isSpace) {
      // 空格：保存当前 token，空格单独作为 token
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = "";
      }
      tokens.push(char);
      isEnglish = false;
    } else {
      // 其他符号：保存当前 token，符号单独作为 token
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
}

/**
 * 混合模式 diff 算法：智能识别中英文并分别处理
 * 使用 jsdiff 库 + 自定义 tokenizer
 */
export function mixedDiff(oldText: string, newText: string): DiffResult[] {
  // 使用自定义分词器将文本转换为 token 数组
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  // 使用 jsdiff 的 diffArrays 进行比较，并合并 token 数组为字符串
  return diffArrays(oldTokens, newTokens).map((change) => ({
    value: change.value.join(""),
    count: change.count,
    added: change.added,
    removed: change.removed,
  }));
}
