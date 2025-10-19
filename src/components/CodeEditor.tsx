import Editor from "@monaco-editor/react";
import FileUpload from "./FileUpload";
import type { ReactNode } from "react";
import { useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload?: (content: string, filename: string) => void;
  label?: string;
  language?: string;
  wrapEditor?: (editor: ReactNode) => ReactNode;
}

export default function CodeEditor({
  value,
  onChange,
  onFileUpload,
  label,
  language = "auto",
  wrapEditor,
}: CodeEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
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
      <div className="flex-1">
        {wrapEditor ? (
          wrapEditor(
            <div
              className="relative h-full border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-slate-900 focus-within:shadow-lg transition-all"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              {/* 空状态拖拽提示 */}
              {!value && !isFocused && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl">
                  <svg
                    className="w-12 h-12 text-slate-300 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-slate-400 font-medium text-sm">
                    拖拽代码文件到此处上传
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    或点击"上传文件"按钮
                  </p>
                </div>
              )}

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
          )
        ) : (
          <div
            className="relative h-full border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-slate-900 focus-within:shadow-lg transition-all"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* 空状态拖拽提示 */}
            {!value && !isFocused && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl">
                <svg
                  className="w-12 h-12 text-slate-300 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-slate-400 font-medium text-sm">
                  拖拽代码文件到此处上传
                </p>
                <p className="text-slate-300 text-xs mt-1">
                  或点击"上传文件"按钮
                </p>
              </div>
            )}

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
        )}
      </div>
    </div>
  );
}
