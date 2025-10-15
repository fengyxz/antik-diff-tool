# Supabase 设置指南

## 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账号（可以用 GitHub 登录）
3. 点击 "New Project"
4. 填写项目信息：
   - Name: my-diff-plus
   - Database Password: 设置一个强密码（保存好）
   - Region: 选择离你最近的区域（如 Singapore）
5. 点击 "Create new project"，等待 1-2 分钟

## 步骤 2: 创建数据表

1. 在左侧菜单选择 "Table Editor"
2. 点击 "Create a new table"
3. 配置表结构：

**表名**: `diff_sessions`

**字段**:

- `id` (bigint, primary key, auto-increment) - 自动生成
- `session_id` (text, unique, not null)
- `original_text` (text)
- `modified_text` (text)
- `diff_mode` (text)
- `created_at` (timestamptz, default: now()) - 自动生成

或者直接运行 SQL：

```sql
create table
  public.diff_sessions (
    id bigserial primary key,
    session_id text unique not null,
    original_text text,
    modified_text text,
    diff_mode text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

-- 添加索引提升查询性能
create index idx_session_id on public.diff_sessions (session_id);
```

## 步骤 3: 配置 RLS（行级安全）

1. 在 "Authentication" > "Policies" 中
2. 为 `diff_sessions` 表启用 RLS
3. 添加策略允许匿名读写：

```sql
-- 允许所有人插入
create policy "Enable insert for all users"
on public.diff_sessions
for insert
to anon
with check (true);

-- 允许所有人读取
create policy "Enable read access for all users"
on public.diff_sessions
for select
to anon
using (true);
```

## 步骤 4: 获取 API 密钥

1. 在左侧菜单选择 "Project Settings" > "API"
2. 复制以下值：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (很长的字符串)

## 步骤 5: 配置环境变量

1. 复制 `.env.example` 为 `.env`
2. 填入你的值：

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 步骤 6: 安装依赖

```bash
npm install @supabase/supabase-js
```

## 完成！

现在你可以使用保存和分享功能了。

## 可选：数据清理

为了避免数据库被填满，可以设置自动清理旧数据：

```sql
-- 删除30天前的记录
create extension if not exists pg_cron;

select cron.schedule(
  'delete-old-sessions',
  '0 0 * * *', -- 每天午夜运行
  $$delete from public.diff_sessions where created_at < now() - interval '30 days'$$
);
```

## 故障排查

- **错误: "relation does not exist"** → 检查表名是否正确
- **错误: "permission denied"** → 检查 RLS 策略是否设置
- **错误: "Invalid API key"** → 检查.env 文件中的密钥是否正确
