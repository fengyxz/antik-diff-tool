import hljs from "highlight.js/lib/core";

// 导入常用语言
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";

// 注册语言
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", html);
hljs.registerLanguage("xml", html);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("php", php);
hljs.registerLanguage("ruby", ruby);

/**
 * 根据文件扩展名检测语言
 */
export function detectLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "cpp",
    h: "cpp",
    hpp: "cpp",
    cs: "csharp",
    css: "css",
    scss: "css",
    html: "html",
    xml: "xml",
    json: "json",
    md: "markdown",
    sh: "bash",
    bash: "bash",
    sql: "sql",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
  };

  return languageMap[ext] || "plaintext";
}

/**
 * 高亮代码
 */
export function highlightCode(code: string, language: string): string {
  if (language === "plaintext" || language === "auto") {
    // 自动检测
    const result = hljs.highlightAuto(code);
    return result.value;
  }

  try {
    const result = hljs.highlight(code, { language });
    return result.value;
  } catch {
    // 如果语言不支持，返回原始文本
    return code;
  }
}

