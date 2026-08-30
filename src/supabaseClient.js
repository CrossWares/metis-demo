import { createClient } from "@supabase/supabase-js";

// Supabaseの URL / anon key はクライアント側に埋め込まれる前提の値。
// Anthropic APIキーとは違い、秘匿すべき値ではない(アクセス制御はDB側のRLSで行う)。
// Vercelの環境変数に VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY として設定すること。
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
