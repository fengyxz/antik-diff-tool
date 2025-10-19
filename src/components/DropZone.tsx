import { ReactNode, useState, DragEvent } from "react";

interface DropZoneProps {
  onFileRead: (content: string, filename: string) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function DropZone({
  onFileRead,
  children,
  className = "",
  disabled = false,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (!file) return;

    // 检查是否是文本文件
    if (!file.type.startsWith("text/") && !isTextFile(file.name)) {
      alert("请上传文本文件");
      return;
    }

    try {
      const text = await readFileAsText(file);
      onFileRead(text, file.name);
    } catch (error) {
      console.error("读取文件失败:", error);
      alert("读取文件失败，请确保文件是文本格式");
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("无法读取文件内容"));
        }
      };

      reader.onerror = () => {
        reject(new Error("文件读取错误"));
      };

      reader.readAsText(file, "UTF-8");
    });
  };

  const isTextFile = (filename: string): boolean => {
    const textExtensions = [
      "txt",
      "md",
      "js",
      "jsx",
      "ts",
      "tsx",
      "json",
      "html",
      "css",
      "scss",
      "xml",
      "csv",
      "log",
      "py",
      "java",
      "cpp",
      "c",
      "h",
      "go",
      "rs",
      "php",
      "rb",
      "sh",
      "sql",
      "yaml",
      "yml",
    ];
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return textExtensions.includes(ext);
  };

  return (
    <div
      className={`${className} ${
        isDragging ? "ring-2 ring-slate-900 ring-offset-2" : ""
      } transition-all relative rounded-xl`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 backdrop-blur-[2px] z-50 pointer-events-none rounded-xl border-2 border-slate-900">
          <div className="text-center bg-white/95 px-6 py-4 rounded-xl shadow-lg">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-slate-900 font-semibold">释放以上传文件</p>
          </div>
        </div>
      )}
    </div>
  );
}
