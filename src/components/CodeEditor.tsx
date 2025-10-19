// @ts-expect-error - Monaco Editor 需要运行 pnpm install 安装
import Editor from "@monaco-editor/react";
import FileUpload from "./FileUpload";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload?: (content: string, filename: string) => void;
  label?: string;
  language?: string;
}

export default function CodeEditor({
  value,
  onChange,
  onFileUpload,
  label,
  language = "auto",
}: CodeEditorProps) {
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

  const handleFileRead = (content: string, filename?: string) => {
    onChange(content);
    if (filename && onFileUpload) {
      onFileUpload(content, filename);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            {label}
          </label>
          <FileUpload onFileRead={handleFileRead} label={label} />
        </div>
      )}
      <div className="flex-1 border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-slate-900 focus-within:shadow-lg transition-all">
        <Editor
          value={value}
          onChange={(newValue) => onChange(newValue || "")}
          language={getMonacoLanguage(language)}
          theme="vs"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            renderWhitespace: "selection",
            folding: true,
            glyphMargin: false,
            lineDecorationsWidth: 5,
            lineNumbersMinChars: 3,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
