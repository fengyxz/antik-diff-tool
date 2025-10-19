import type { TextareaHTMLAttributes, ReactNode } from "react";
import FileUpload from "./FileUpload";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onFileUpload?: (content: string, filename: string) => void;
  showFileUpload?: boolean;
  wrapTextarea?: (textarea: ReactNode) => ReactNode;
}

// 智能词数统计：中文按字符，英文按单词
function countWords(text: string): number {
  if (!text.trim()) return 0;

  let wordCount = 0;

  // 匹配中文字符
  const chineseChars = text.match(/[\u4e00-\u9fff]/g);
  wordCount += chineseChars ? chineseChars.length : 0;

  // 移除中文字符后统计英文单词
  const textWithoutChinese = text.replace(/[\u4e00-\u9fff]/g, " ");
  const englishWords = textWithoutChinese.match(/[a-zA-Z0-9]+/g);
  wordCount += englishWords ? englishWords.length : 0;

  return wordCount;
}

export default function Textarea({
  label,
  value,
  onChange,
  onFileUpload,
  showFileUpload = false,
  wrapTextarea,
  className = "",
  ...props
}: TextareaProps) {
  const charCount = value.length;
  const wordCount = countWords(value);

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
          {showFileUpload && <FileUpload onFileRead={handleFileRead} label={label} />}
        </div>
      )}
      {wrapTextarea ? (
        wrapTextarea(
          <div className="relative flex-1">
            {/* 空状态拖拽提示 */}
            {!value && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none rounded-xl bg-slate-50 border-2 border-dashed border-slate-300">
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
                <p className="text-slate-400 font-medium text-sm">拖拽文件到此处上传</p>
                <p className="text-slate-300 text-xs mt-1">或点击"上传文件"按钮</p>
              </div>
            )}
            
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full h-full px-4 py-4 pb-10 text-[15px] leading-relaxed rounded-xl border-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:shadow-lg resize-none transition-all ${className}`}
              {...props}
            />
            <div className="absolute bottom-3 right-4 flex items-center gap-3 text-xs text-slate-400 font-medium pointer-events-none">
              <span>{charCount.toLocaleString()} 字符</span>
              <span className="text-slate-300">|</span>
              <span>{wordCount.toLocaleString()} 词</span>
            </div>
          </div>
        )
      ) : (
        <div className="relative flex-1">
          {/* 空状态拖拽提示 */}
          {!value && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none rounded-xl bg-slate-50 border-2 border-dashed border-slate-300">
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
              <p className="text-slate-400 font-medium text-sm">拖拽文件到此处上传</p>
              <p className="text-slate-300 text-xs mt-1">或点击"上传文件"按钮</p>
            </div>
          )}
          
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-full px-4 py-4 pb-10 text-[15px] leading-relaxed rounded-xl border-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:shadow-lg resize-none transition-all ${className}`}
            {...props}
          />
          <div className="absolute bottom-3 right-4 flex items-center gap-3 text-xs text-slate-400 font-medium pointer-events-none">
            <span>{charCount.toLocaleString()} 字符</span>
            <span className="text-slate-300">|</span>
            <span>{wordCount.toLocaleString()} 词</span>
          </div>
        </div>
      )}
    </div>
  );
}
