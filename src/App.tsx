import { useMemo, useState, useEffect } from "react";
import { diffWordsWithSpace, diffChars } from "diff";
import Button from "./components/Button";
import Textarea from "./components/Textarea";
import ToggleGroup from "./components/ToggleGroup";
import StatsBadge from "./components/StatsBadge";
import InlineDiff from "./components/DiffDisplay/InlineDiff";
import SideBySide from "./components/DiffDisplay/SideBySide";
import EmptyState from "./components/DiffDisplay/EmptyState";
import ShareDialog from "./components/ShareDialog";
import LoadingScreen from "./components/LoadingScreen";
import Tabs from "./components/Tabs";
import CodeDiff from "./components/CodeDiff";
import CodeEditor from "./components/CodeEditor";
import { mixedDiff, type DiffResult } from "./utils/diffAlgorithm";
import { detectLanguageFromFilename } from "./utils/languageDetector";
import { saveDiffSession, loadDiffSession } from "./lib/supabase";

type DiffMode = "char" | "word" | "auto";
type ViewMode = "inline" | "side";
type CompareMode = "text" | "code";

// 图标组件
const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function App() {
  const [base, setBase] = useState("");
  const [changed, setChanged] = useState("");
  const [compareMode, setCompareMode] = useState<CompareMode>("text");
  const [diffMode, setDiffMode] = useState<DiffMode>("auto");
  const [viewMode, setViewMode] = useState<ViewMode>("inline");
  const [codeLanguage, setCodeLanguage] = useState<string>("auto");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // 检查URL参数，加载分享的会话
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session");

    if (sessionId) {
      setInitialLoading(true);
      loadSession(sessionId);
    }
  }, []);

  // 加载会话
  const loadSession = async (sessionId: string) => {
    setLoading(true);
    const result = await loadDiffSession(sessionId);

    if (result.success && result.data) {
      setBase(result.data.original_text);
      setChanged(result.data.modified_text);
      setDiffMode(result.data.diff_mode as DiffMode);

      // 清除URL参数
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      alert("加载失败：" + (result.error || "未找到会话"));
    }
    setLoading(false);
    setInitialLoading(false);
  };

  // 计算diff结果
  const parts = useMemo(() => {
    if (!base && !changed) return [];

    if (diffMode === "char") {
      return diffChars(base, changed);
    } else if (diffMode === "word") {
      return diffWordsWithSpace(base, changed);
    } else {
      const hasCJK = /[\u4e00-\u9fff]/.test(base + changed);
      const hasEnglish = /[a-zA-Z]/.test(base + changed);

      if (hasCJK && hasEnglish) {
        return mixedDiff(base, changed);
      } else if (hasCJK) {
        return diffChars(base, changed);
      } else {
        return diffWordsWithSpace(base, changed);
      }
    }
  }, [base, changed, diffMode]) as DiffResult[];

  // 计算统计信息
  const stats = useMemo(() => {
    const added = parts
      .filter((p) => p.added)
      .reduce((acc, p) => acc + p.value.length, 0);
    const removed = parts
      .filter((p) => p.removed)
      .reduce((acc, p) => acc + p.value.length, 0);
    return { added, removed };
  }, [parts]);

  // 清空文本
  const handleClear = () => {
    setBase("");
    setChanged("");
    setCodeLanguage("auto");
  };

  // 文件上传回调 - 自动检测语言
  const handleFileUpload = (_content: string, filename: string) => {
    if (compareMode === "code") {
      const detectedLang = detectLanguageFromFilename(filename);
      setCodeLanguage(detectedLang);
    }
  };

  // 保存并分享
  const handleSave = async () => {
    if (!base && !changed) {
      alert("请先输入文本");
      return;
    }

    setLoading(true);
    const result = await saveDiffSession(base, changed, diffMode);

    if (result.success && result.sessionId) {
      setCurrentSessionId(result.sessionId);
      setShowShareDialog(true);
    } else {
      alert("保存失败：" + (result.error || "未知错误"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 lg:p-12 relative">
      {initialLoading && <LoadingScreen />}
      <div className="mx-auto space-y-8">
        {/* 顶部标题栏 */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b-2 border-slate-100">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              文本对比工具
            </h1>
            <p className="text-slate-600 text-base">
              智能识别中英文，实时对比文本差异
            </p>

            {/* Tabs 切换 */}
            <Tabs
              value={compareMode}
              onValueChange={(value) => setCompareMode(value as CompareMode)}
              tabs={[
                { value: "text", label: "📝 文本对比" },
                { value: "code", label: "💻 代码对比" },
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClear}>
              <TrashIcon />
              清空
            </Button>

            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  保存中...
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  保存并分享
                </>
              )}
            </Button>
          </div>
        </header>

        {/* 控制面板 */}
        <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-slate-100">
          <div className="flex flex-wrap items-start gap-4 md:gap-6 lg:gap-8">
            {compareMode === "text" ? (
              <>
                {/* 对比模式选择 */}
                <ToggleGroup
                  label="对比模式"
                  value={diffMode}
                  onChange={setDiffMode}
                  options={[
                    { value: "auto", label: "智能混合" },
                    { value: "char", label: "按字符" },
                    { value: "word", label: "按单词" },
                  ]}
                />

                {/* 显示模式选择 */}
                <ToggleGroup
                  label="显示模式"
                  value={viewMode}
                  onChange={setViewMode}
                  options={[
                    { value: "inline", label: "内联显示" },
                    { value: "side", label: "并排显示" },
                  ]}
                />
              </>
            ) : (
              <>
                {/* 代码语言选择 */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    编程语言
                  </label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  >
                    <option value="auto">自动检测</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C/C++</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                    <option value="markdown">Markdown</option>
                    <option value="bash">Bash</option>
                    <option value="sql">SQL</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                  </select>
                </div>

                {/* 显示模式选择 */}
                <ToggleGroup
                  label="显示模式"
                  value={viewMode}
                  onChange={setViewMode}
                  options={[
                    { value: "inline", label: "内联显示" },
                    { value: "side", label: "并排显示" },
                  ]}
                />
              </>
            )}

            {/* 统计信息 */}
            <div className="flex flex-col gap-3 ml-auto">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                变更统计
              </label>
              <div className="flex items-center gap-4">
                <StatsBadge type="added" count={stats.added} />
                <StatsBadge type="removed" count={stats.removed} />
              </div>
            </div>
          </div>
        </div>

        {/* 输入区域 */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          style={{ minHeight: "360px" }}
        >
          {compareMode === "code" ? (
            <>
              <CodeEditor
                value={base}
                onChange={setBase}
                onFileUpload={handleFileUpload}
                label="原始代码"
                language={codeLanguage}
              />
              <CodeEditor
                value={changed}
                onChange={setChanged}
                onFileUpload={handleFileUpload}
                label="修改后的代码"
                language={codeLanguage}
              />
            </>
          ) : (
            <>
              <Textarea
                value={base}
                onChange={setBase}
                onFileUpload={handleFileUpload}
                placeholder="在此粘贴、输入文本或上传文件..."
                label="原始文本"
                showFileUpload={true}
              />
              <Textarea
                value={changed}
                onChange={setChanged}
                onFileUpload={handleFileUpload}
                placeholder="在此粘贴、输入文本或上传文件..."
                label="修改后的文本"
                showFileUpload={true}
              />
            </>
          )}
        </div>

        {/* Diff结果展示 */}
        <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
          <div className="bg-slate-50 border-b-2 border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              差异对比结果
            </h2>
            {parts.length > 0 && (
              <p className="text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5 mr-4">
                  <span className="w-4 h-4 bg-emerald-100 rounded border-2 border-emerald-200"></span>
                  绿色表示新增
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-rose-100 rounded border-2 border-rose-200"></span>
                  红色表示删除
                </span>
              </p>
            )}
          </div>
          <div className="p-6">
            {parts.length === 0 ? (
              <EmptyState />
            ) : compareMode === "code" ? (
              <CodeDiff
                oldCode={base}
                newCode={changed}
                language={codeLanguage}
                renderSideBySide={viewMode === "side"}
              />
            ) : viewMode === "inline" ? (
              <InlineDiff parts={parts} />
            ) : (
              <SideBySide parts={parts} />
            )}
          </div>
        </div>
      </div>
      {/* 分享对话框 */}
      {showShareDialog && (
        <ShareDialog
          sessionId={currentSessionId}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}
