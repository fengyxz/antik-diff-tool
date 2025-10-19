// @ts-ignore - Monaco Editor 需要运行 pnpm install 安装
import { DiffEditor } from "@monaco-editor/react";

interface CodeDiffProps {
  oldCode: string;
  newCode: string;
  language?: string;
}

export default function CodeDiff({
  oldCode,
  newCode,
  language = "auto",
}: CodeDiffProps) {
  // 语言映射（Monaco 支持的语言名称）
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      auto: "plaintext",
      cpp: "cpp",
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      css: "css",
      html: "html",
      json: "json",
      markdown: "markdown",
      bash: "shell",
      sql: "sql",
      go: "go",
      rust: "rust",
      php: "php",
      ruby: "ruby",
    };

    return languageMap[lang] || "plaintext";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <DiffEditor
        original={oldCode || ""}
        modified={newCode || ""}
        language={getMonacoLanguage(language)}
        height="600px"
        theme="vs"
        options={{
          readOnly: true,
          renderSideBySide: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          renderWhitespace: "selection",
          folding: true,
          glyphMargin: false,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 4,
          enableSplitViewResizing: false,
          renderOverviewRuler: false,
          diffWordWrap: "on",
          ignoreTrimWhitespace: false,
          renderIndicators: true,
          originalEditable: false,
          modifiedEditable: false,
        }}
      />
    </div>
  );
}
