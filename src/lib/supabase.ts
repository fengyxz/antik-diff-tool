import { createClient } from "@supabase/supabase-js";

// 请替换为你的Supabase项目配置
// 1. 访问 https://supabase.com 创建项目
// 2. 在项目设置中获取这两个值
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DiffSession {
  id: string;
  session_id: string;
  original_text: string;
  modified_text: string;
  diff_mode: string;
  created_at: string;
}

// 生成唯一的session ID
export function generateSessionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// 保存diff会话
export async function saveDiffSession(
  originalText: string,
  modifiedText: string,
  diffMode: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const sessionId = generateSessionId();

    const { error } = await supabase.from("diff_sessions").insert([
      {
        session_id: sessionId,
        original_text: originalText,
        modified_text: modifiedText,
        diff_mode: diffMode,
      },
    ]);

    if (error) throw error;

    return { success: true, sessionId };
  } catch (error) {
    console.error("保存失败:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "保存失败",
    };
  }
}

// 加载diff会话
export async function loadDiffSession(
  sessionId: string
): Promise<{ success: boolean; data?: DiffSession; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("diff_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("加载失败:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "加载失败",
    };
  }
}
