export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-200">
        {/* Loading Spinner */}
        <div className="relative w-16 h-16">
          {/* 外圈 */}
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          {/* 旋转圈 */}
          <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* 加载文字 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-slate-900 font-semibold text-lg">加载中...</p>
          <p className="text-slate-500 text-sm">正在获取对比数据</p>
        </div>

        {/* 动画点点 */}
        <div className="flex gap-2">
          <div
            className="w-2 h-2 bg-slate-900 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-slate-900 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-slate-900 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
