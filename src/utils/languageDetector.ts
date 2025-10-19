/**
 * 根据文件扩展名检测编程语言
 */
export function detectLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    cc: "cpp",
    c: "cpp",
    h: "cpp",
    hpp: "cpp",
    cs: "csharp",
    css: "css",
    scss: "css",
    sass: "css",
    less: "css",
    html: "html",
    htm: "html",
    xml: "xml",
    json: "json",
    md: "markdown",
    markdown: "markdown",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    sql: "sql",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    vue: "html",
    svelte: "html",
    yaml: "yaml",
    yml: "yaml",
  };

  return languageMap[ext] || "auto";
}

