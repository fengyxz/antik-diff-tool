# 文本对比工具 (Text Diff Tool)

<div align="center">

一个现代化的在线文本对比工具，支持中英文智能识别，实时对比文本差异。

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06b6d4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.75-3ecf8e?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

## ✨ 功能特性

### 🎯 核心功能

- **智能对比模式** - 自动识别中英文，中文按字符、英文按单词对比
- **手动模式切换** - 支持按字符、按单词、智能混合三种模式
- **双视图展示** - 内联模式和并排模式任意切换
- **实时统计** - 显示字符数、词数、新增/删除统计

### 📤 增强功能

- **文件上传** - 支持上传 `.txt`、`.md`、`.js`、`.json` 等多种文本文件
- **保存与分享** - 生成唯一链接，一键分享对比结果
- **云端存储** - 基于 Supabase 的数据持久化
- **字符统计** - 实时显示字符数和词数

### 🎨 用户体验

- **现代化设计** - 遵循 shadcn/ui 设计规范
- **响应式布局** - 完美适配桌面和移动设备
- **流畅动画** - 精心设计的交互反馈
- **连续删除线** - 优化的视觉呈现

## 🛠️ 技术栈

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.75-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)
![jsdiff](https://img.shields.io/badge/jsdiff-5.1.0-orange?style=for-the-badge)

</div>

**核心特性**

- 🧮 **自定义 Diff 算法** - 基于 LCS 实现，智能识别中英文
- ☁️ **云端存储** - Supabase PostgreSQL + RLS 权限控制
- 🎨 **现代化 UI** - shadcn/ui 设计风格 + 完全响应式

## 📦 快速开始

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 配置环境变量

如果需要使用保存和分享功能，请配置 Supabase：

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 在 `.env` 文件中填入你的 Supabase 配置：

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 详细配置步骤请查看 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 启动开发服务器

```bash
pnpm dev
```

打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
pnpm build
```

## 📖 使用说明

### 基础使用

1. 在左侧文本框输入原始文本
2. 在右侧文本框输入修改后的文本
3. 底部自动显示对比结果

### 模式切换

- **智能混合**: 自动识别中英文，最佳对比效果
- **按字符**: 逐字符对比，适合精确比对
- **按单词**: 按单词对比，适合英文文本

### 文件上传

点击文本框右上角的"上传文件"按钮，支持多种文本格式。

### 保存与分享

1. 点击右上角"保存并分享"按钮
2. 生成唯一分享链接
3. 发送给他人查看对比结果

## 🎯 特色功能

### 智能中英文混合算法

基于 LCS (最长公共子序列) 算法，实现了智能的中英文混合对比：

- 中文字符按单字对比
- 英文单词按词对比
- 标点符号独立处理
- 保持文本结构完整性

### 连续删除线优化

优化了删除内容的显示效果：

- 合并连续的删除片段
- 统一的删除线样式
- 高度对齐优化

## 📂 项目结构

```
src/
├── components/          # React 组件
│   ├── Button.tsx       # shadcn 风格按钮
│   ├── Textarea.tsx     # 文本输入组件
│   ├── FileUpload.tsx   # 文件上传组件
│   ├── ShareDialog.tsx  # 分享对话框
│   ├── ToggleGroup.tsx  # 切换按钮组
│   ├── StatsBadge.tsx   # 统计徽章
│   └── DiffDisplay/     # Diff 显示组件
│       ├── InlineDiff.tsx
│       ├── SideBySide.tsx
│       └── EmptyState.tsx
├── lib/                 # 工具库
│   └── supabase.ts      # Supabase 客户端
├── utils/               # 工具函数
│   └── diffAlgorithm.ts # Diff 算法
└── App.tsx              # 主应用组件
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

## 🙏 致谢

- [jsdiff](https://github.com/kpdecker/jsdiff) - Diff 算法库
- [Supabase](https://supabase.com) - 开源的 Firebase 替代品
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com) - UI 设计灵感

---

<div align="center">
Made with ❤️ by Your Name
</div>
