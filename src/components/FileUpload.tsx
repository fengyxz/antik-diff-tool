import { useRef } from "react";
import Button from "./Button";

interface FileUploadProps {
  onFileRead: (content: string) => void;
  label?: string;
}

export default function FileUpload({ onFileRead, label }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      onFileRead(text);
      // 清空input，允许重复上传同一个文件
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

      // 尝试用UTF-8编码读取
      reader.readAsText(file, "UTF-8");
    });
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".txt,.md,.js,.jsx,.ts,.tsx,.json,.html,.css,.xml,.csv,.log"
        className="hidden"
        id={`file-upload-${label}`}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <svg
          className="w-4 h-4"
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
        上传文件
      </Button>
    </div>
  );
}
