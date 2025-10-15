import { useState } from "react";
import Button from "./Button";

interface ShareDialogProps {
  sessionId: string;
  onClose: () => void;
}

export default function ShareDialog({ sessionId, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}?session=${sessionId}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">分享链接</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          你的对比结果已保存！使用以下链接分享给他人：
        </p>

        <div className="bg-slate-50 rounded-lg p-3 mb-4 border-2 border-slate-200">
          <code className="text-sm text-slate-900 break-all">{shareUrl}</code>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCopy} className="flex-1">
            {copied ? (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                已复制
              </>
            ) : (
              <>
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                复制链接
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            💡 提示：Session ID:{" "}
            <span className="font-mono font-semibold">{sessionId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
