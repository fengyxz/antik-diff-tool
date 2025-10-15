import { TextareaHTMLAttributes } from "react";
import FileUpload from "./FileUpload";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  showFileUpload?: boolean;
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
  showFileUpload = false,
  className = "",
  ...props
}: TextareaProps) {
  const charCount = value.length;
  const wordCount = countWords(value);

  return (
    <div className="flex flex-col h-full">
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            {label}
          </label>
          {showFileUpload && <FileUpload onFileRead={onChange} label={label} />}
        </div>
      )}
      <div className="relative flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-full px-4 py-4 pb-10 text-[15px] leading-relaxed rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:shadow-lg resize-none transition-all ${className}`}
          {...props}
        />
        <div className="absolute bottom-3 right-4 flex items-center gap-3 text-xs text-slate-400 font-medium pointer-events-none">
          <span>{charCount.toLocaleString()} 字符</span>
          <span className="text-slate-300">|</span>
          <span>{wordCount.toLocaleString()} 词</span>
        </div>
      </div>
    </div>
  );
}
