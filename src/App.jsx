import { useState, useEffect, useRef, useMemo } from "react";

const C = {
  strong:   "#534AB7",
  mid:      "#AFA9EC",
  weak:     "#C8EDE3",
  human:    "#7B74D4",
  thing:    "#5DB99A",
  critical: "#8B3A5A",
  bg:       "#EFEFF5",
  bgCard:   "#FFFFFF",
  border:   "#E8E6F4",
  text:     "#1A1833",
  textMid:  "#6B6897",
  textWeak: "#A8A5C4",
};
const scoreColor = (v) => v >= 70 ? C.thing : v >= 40 ? C.strong : C.critical;

const INITIAL_PROJECTS = [
  {
    id: 1, name: "基幹システム刷新 Phase2", code: "PRJ-001",
    score: 42, staticScore: 35, dynamicScore: 49, status: "critical",
    owner: "田中 誠", due: "2025-08-31", daysLeft: 113, progress: 38, team: 14,
    trend: [68, 65, 61, 58, 54, 50, 46, 42],
    tasks: [
      { id:"t1", name:"要件定義", assignee:"田中 誠",   start:"2025-02-01", end:"2025-03-31", progress:100, status:"done" },
      { id:"t2", name:"基本設計", assignee:"田中 誠",   start:"2025-03-15", end:"2025-04-30", progress:100, status:"done" },
      { id:"t3", name:"製造",     assignee:"ベンダーA", start:"2025-05-01", end:"2025-07-31", progress:42,  status:"delay" },
      { id:"t4", name:"テスト",   assignee:"田中 誠",   start:"2025-07-15", end:"2025-08-20", progress:0,   status:"pending" },
      { id:"t5", name:"リリース", assignee:"田中 誠",   start:"2025-08-31", end:"2025-08-31", progress:0,   status:"pending" },
    ],
    static:  { schedule: 35, tasks: 40, risk: 28 },
    dynamic: { stakeholder: 55, team: 50, decision: 42 },
    alerts: [
      { level: "critical", axis: "D", text: "意思決定者12日間不在・承認待ち7件滞留" },
      { level: "critical", axis: "S", text: "仕様変更4件が未承認のまま開発進行" },
      { level: "warn",     axis: "D", text: "キーエンジニア離脱リスク（稼働140%超）" },
    ],
    events: [
      { date: "05/08", type: "warn",     text: "ステアリングコミッティ 欠席3名" },
      { date: "05/06", type: "critical", text: "#CR-041 仕様変更受領（未査定）" },
      { date: "05/03", type: "normal",   text: "Sprint7 完了（達成率61%）" },
    ],
    glossary: [
      { term: "完了", orgDef: "コードマージ済み", projectDef: "UAT承認・本番デプロイ完了", divergence: 82 },
      { term: "承認", orgDef: "権限者による正式合意", projectDef: "IT部長のシステム上のApprove", divergence: 65 },
    ],
    stakeholders: [
      { name: "CTO", role: "スポンサー", status: "active" },
      { name: "IT部長", role: "承認者", status: "inactive", note: "12日間不在中" },
      { name: "ベンダーA", role: "開発", status: "warn" },
    ],
    gravity: {
      nodes: [
        { id:"プロジェクト", coupling:4.1, depStr:3.3, changeProb:55, commFreq:56, orbit:0, type:"concept" },
        { id:"PM", coupling:3.1, depStr:2.9, changeProb:31, commFreq:79, orbit:1, type:"human" },
        { id:"リスク管理", coupling:2.6, depStr:2.1, changeProb:49, commFreq:89, orbit:1, type:"concept" },
        { id:"フェーズ", coupling:4.0, depStr:3.6, changeProb:73, commFreq:53, orbit:1, type:"concept" },
        { id:"PMO", coupling:3.6, depStr:3.1, changeProb:20, commFreq:45, orbit:2, type:"human" },
        { id:"完了定義", coupling:4.2, depStr:3.6, changeProb:39, commFreq:52, orbit:2, type:"concept" },
        { id:"課題対応", coupling:4.9, depStr:4.2, changeProb:31, commFreq:73, orbit:2, type:"signal" },
        { id:"意味共有", coupling:2.7, depStr:2.6, changeProb:53, commFreq:30, orbit:2, type:"concept" },
        { id:"情報ハブ", coupling:4.3, depStr:3.9, changeProb:68, commFreq:35, orbit:3, type:"human" },
        { id:"ステークホルダー", coupling:3.9, depStr:3.8, changeProb:66, commFreq:49, orbit:3, type:"human" },
        { id:"暗黙知", coupling:4.3, depStr:3.5, changeProb:49, commFreq:62, orbit:3, type:"concept" },
        { id:"シグナル", coupling:5.0, depStr:4.9, changeProb:32, commFreq:73, orbit:3, type:"signal" },
        { id:"承認フロー", coupling:3.2, depStr:3.0, changeProb:66, commFreq:45, orbit:3, type:"proc" },
        { id:"キーマン", coupling:3.4, depStr:2.9, changeProb:54, commFreq:34, orbit:4, type:"human" },
        { id:"ベンダー", coupling:4.0, depStr:3.3, changeProb:51, commFreq:45, orbit:4, type:"org" },
        { id:"組織文化", coupling:3.7, depStr:3.2, changeProb:48, commFreq:66, orbit:4, type:"org" },
        { id:"WBS", coupling:4.6, depStr:4.4, changeProb:49, commFreq:29, orbit:4, type:"proc" },
        { id:"変更管理", coupling:4.5, depStr:4.0, changeProb:28, commFreq:52, orbit:4, type:"proc" },
        { id:"形式知", coupling:4.8, depStr:4.4, changeProb:60, commFreq:52, orbit:4, type:"concept" },
        { id:"外部知見", coupling:4.1, depStr:3.6, changeProb:78, commFreq:43, orbit:5, type:"human" },
        { id:"クライアント", coupling:3.2, depStr:2.7, changeProb:53, commFreq:79, orbit:5, type:"org" },
        { id:"ベンダ体制", coupling:4.7, depStr:4.1, changeProb:48, commFreq:42, orbit:5, type:"org" },
        { id:"エスカレーション", coupling:3.8, depStr:3.1, changeProb:26, commFreq:39, orbit:5, type:"proc" },
        { id:"報告", coupling:2.9, depStr:2.4, changeProb:74, commFreq:33, orbit:5, type:"proc" },
        { id:"会議", coupling:3.5, depStr:3.2, changeProb:79, commFreq:92, orbit:5, type:"proc" },
        { id:"レポートライン", coupling:3.1, depStr:2.8, changeProb:21, commFreq:39, orbit:5, type:"proc" },
        { id:"スコープクリープ", coupling:4.2, depStr:3.8, changeProb:54, commFreq:68, orbit:5, type:"signal" },
        { id:"工程未完了", coupling:2.8, depStr:2.5, changeProb:78, commFreq:25, orbit:5, type:"signal" },
      ],
      edges: [
        { s:0,t:1,w:3.1 },{ s:0,t:2,w:2.6 },{ s:0,t:3,w:4.0 },{ s:0,t:6,w:4.9 },
        { s:1,t:4,w:3.6 },{ s:1,t:8,w:4.3 },{ s:1,t:12,w:3.2 },
        { s:4,t:9,w:3.9 },{ s:6,t:11,w:5.0 },{ s:6,t:25,w:2.9 },
        { s:11,t:23,w:2.9 },{ s:11,t:24,w:3.5 },{ s:16,t:17,w:4.5 },{ s:18,t:7,w:2.7 },
      ],
      drift: {
        labels: ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10"],
        plan:   [100,90,80,70,60,50,40,30,20,10],
        actual: [100,91,83,75,68,63,58,55,52,50],
      }
    },
  },
  {
    id: 2, name: "顧客データ統合PF", code: "PRJ-002",
    score: 71, staticScore: 72, dynamicScore: 70, status: "warn",
    owner: "佐藤 麻衣", due: "2025-11-30", daysLeft: 204, progress: 52, team: 8,
    trend: [68, 70, 69, 72, 71, 73, 71, 71],
    tasks: [
      { id:"t1", name:"要件定義", assignee:"佐藤 麻衣", start:"2025-03-01", end:"2025-04-30", progress:100, status:"done" },
      { id:"t2", name:"基本設計", assignee:"佐藤 麻衣", start:"2025-04-15", end:"2025-05-31", progress:100, status:"done" },
      { id:"t3", name:"製造",     assignee:"ベンダーC", start:"2025-06-01", end:"2025-09-30", progress:25,  status:"active" },
      { id:"t4", name:"テスト",   assignee:"佐藤 麻衣", start:"2025-09-01", end:"2025-10-31", progress:0,   status:"pending" },
      { id:"t5", name:"リリース", assignee:"佐藤 麻衣", start:"2025-11-30", end:"2025-11-30", progress:0,   status:"pending" },
    ],
    static:  { schedule: 72, tasks: 75, risk: 65 },
    dynamic: { stakeholder: 80, team: 68, decision: 62 },
    alerts: [
      { level: "warn", axis: "S", text: "外部API仕様確定2週間遅延・依存タスク5件影響" },
      { level: "info", axis: "D", text: "次フェーズリソース未確定（3名不足）" },
    ],
    events: [
      { date: "05/09", type: "warn",   text: "外部API仕様変更通知受領" },
      { date: "05/07", type: "normal", text: "フェーズ2 キックオフ完了" },
      { date: "05/05", type: "normal", text: "週次定例 異常なし" },
    ],
    glossary: [], stakeholders: [
      { name: "CDO", role: "スポンサー", status: "active" },
      { name: "営業部長", role: "オーナー", status: "active" },
    ],
    gravity: {
      nodes: [
        { id:"プロジェクト", coupling:2.4, depStr:2.2, changeProb:21, commFreq:58, orbit:0, type:"concept" },
        { id:"PM", coupling:3.8, depStr:3.7, changeProb:45, commFreq:58, orbit:1, type:"human" },
        { id:"リスク管理", coupling:2.0, depStr:1.8, changeProb:44, commFreq:89, orbit:1, type:"concept" },
        { id:"フェーズ", coupling:1.8, depStr:1.7, changeProb:66, commFreq:83, orbit:1, type:"concept" },
        { id:"PMO", coupling:3.3, depStr:2.9, changeProb:41, commFreq:29, orbit:2, type:"human" },
        { id:"完了定義", coupling:2.5, depStr:2.0, changeProb:44, commFreq:44, orbit:2, type:"concept" },
        { id:"課題対応", coupling:2.4, depStr:2.3, changeProb:77, commFreq:37, orbit:2, type:"signal" },
        { id:"意味共有", coupling:3.8, depStr:3.5, changeProb:51, commFreq:43, orbit:2, type:"concept" },
        { id:"情報ハブ", coupling:2.1, depStr:2.0, changeProb:85, commFreq:70, orbit:3, type:"human" },
        { id:"ステークホルダー", coupling:2.4, depStr:1.9, changeProb:64, commFreq:51, orbit:3, type:"human" },
        { id:"暗黙知", coupling:2.6, depStr:2.1, changeProb:51, commFreq:37, orbit:3, type:"concept" },
        { id:"シグナル", coupling:2.4, depStr:2.1, changeProb:83, commFreq:70, orbit:3, type:"signal" },
        { id:"承認フロー", coupling:2.4, depStr:2.0, changeProb:58, commFreq:52, orbit:3, type:"proc" },
        { id:"キーマン", coupling:2.1, depStr:1.9, changeProb:61, commFreq:58, orbit:4, type:"human" },
        { id:"ベンダー", coupling:2.0, depStr:1.9, changeProb:53, commFreq:28, orbit:4, type:"org" },
        { id:"組織文化", coupling:1.9, depStr:1.6, changeProb:80, commFreq:66, orbit:4, type:"org" },
        { id:"WBS", coupling:3.2, depStr:2.9, changeProb:84, commFreq:64, orbit:4, type:"proc" },
        { id:"変更管理", coupling:3.7, depStr:3.2, changeProb:38, commFreq:31, orbit:4, type:"proc" },
        { id:"形式知", coupling:2.8, depStr:2.5, changeProb:36, commFreq:36, orbit:4, type:"concept" },
        { id:"外部知見", coupling:2.2, depStr:2.0, changeProb:55, commFreq:84, orbit:5, type:"human" },
        { id:"クライアント", coupling:2.7, depStr:2.3, changeProb:68, commFreq:93, orbit:5, type:"org" },
        { id:"ベンダ体制", coupling:3.2, depStr:3.0, changeProb:83, commFreq:25, orbit:5, type:"org" },
        { id:"エスカレーション", coupling:3.7, depStr:3.3, changeProb:78, commFreq:63, orbit:5, type:"proc" },
        { id:"報告", coupling:3.1, depStr:2.8, changeProb:57, commFreq:26, orbit:5, type:"proc" },
        { id:"会議", coupling:1.9, depStr:1.7, changeProb:61, commFreq:56, orbit:5, type:"proc" },
        { id:"レポートライン", coupling:2.5, depStr:2.4, changeProb:39, commFreq:82, orbit:5, type:"proc" },
        { id:"スコープクリープ", coupling:3.2, depStr:2.9, changeProb:64, commFreq:86, orbit:5, type:"signal" },
        { id:"工程未完了", coupling:1.9, depStr:1.7, changeProb:56, commFreq:64, orbit:5, type:"signal" },
      ],
      edges: [
        { s:0,t:1,w:3.8 },{ s:0,t:2,w:2.0 },{ s:1,t:4,w:3.3 },{ s:1,t:12,w:2.4 },
        { s:4,t:9,w:2.4 },{ s:6,t:11,w:2.4 },{ s:7,t:10,w:2.6 },
        { s:16,t:17,w:3.7 },{ s:17,t:21,w:3.2 },{ s:22,t:23,w:3.1 },
      ],
      drift: {
        labels: ["W1","W2","W3","W4","W5","W6","W7","W8"],
        plan:   [100,88,76,64,52,40,28,16],
        actual: [100,89,78,67,56,45,35,26],
      }
    },
  },
  {
    id: 3, name: "AIアシスタント導入", code: "PRJ-003",
    score: 88, staticScore: 90, dynamicScore: 86, status: "healthy",
    owner: "木村 隆", due: "2025-07-15", daysLeft: 66, progress: 78, team: 5,
    trend: [78, 80, 82, 83, 85, 86, 88, 88],
    tasks: [
      { id:"t1", name:"要件定義", assignee:"木村 隆", start:"2025-01-15", end:"2025-02-28", progress:100, status:"done" },
      { id:"t2", name:"基本設計", assignee:"木村 隆", start:"2025-03-01", end:"2025-03-31", progress:100, status:"done" },
      { id:"t3", name:"製造",     assignee:"木村 隆", start:"2025-04-01", end:"2025-06-15", progress:97,  status:"active" },
      { id:"t4", name:"テスト",   assignee:"HR部長",  start:"2025-06-15", end:"2025-07-05", progress:20,  status:"active" },
      { id:"t5", name:"リリース", assignee:"木村 隆", start:"2025-07-15", end:"2025-07-15", progress:0,   status:"pending" },
    ],
    static:  { schedule: 90, tasks: 92, risk: 88 },
    dynamic: { stakeholder: 92, team: 86, decision: 80 },
    alerts: [{ level: "info", axis: "S", text: "UAT開始まで10日・テストシナリオ最終確認推奨" }],
    events: [
      { date: "05/09", type: "normal", text: "本番環境構築 完了" },
      { date: "05/07", type: "normal", text: "セキュリティレビュー 承認" },
      { date: "05/05", type: "normal", text: "パイロットテスト 合格" },
    ],
    glossary: [], stakeholders: [
      { name: "CISO", role: "承認者", status: "active" },
      { name: "HR部長", role: "オーナー", status: "active" },
    ],
    gravity: {
      nodes: [
        { id:"プロジェクト", coupling:1.7, depStr:1.4, changeProb:43, commFreq:26, orbit:0, type:"concept" },
        { id:"PM", coupling:1.9, depStr:1.8, changeProb:63, commFreq:84, orbit:1, type:"human" },
        { id:"リスク管理", coupling:1.2, depStr:1.2, changeProb:35, commFreq:42, orbit:1, type:"concept" },
        { id:"フェーズ", coupling:2.1, depStr:1.9, changeProb:61, commFreq:80, orbit:1, type:"concept" },
        { id:"PMO", coupling:1.3, depStr:1.1, changeProb:79, commFreq:68, orbit:2, type:"human" },
        { id:"完了定義", coupling:1.1, depStr:1.1, changeProb:51, commFreq:81, orbit:2, type:"concept" },
        { id:"課題対応", coupling:2.6, depStr:2.2, changeProb:21, commFreq:55, orbit:2, type:"signal" },
        { id:"意味共有", coupling:2.8, depStr:2.6, changeProb:78, commFreq:92, orbit:2, type:"concept" },
        { id:"情報ハブ", coupling:1.0, depStr:0.9, changeProb:68, commFreq:90, orbit:3, type:"human" },
        { id:"ステークホルダー", coupling:1.7, depStr:1.5, changeProb:82, commFreq:43, orbit:3, type:"human" },
        { id:"暗黙知", coupling:1.7, depStr:1.4, changeProb:74, commFreq:64, orbit:3, type:"concept" },
        { id:"シグナル", coupling:2.3, depStr:2.1, changeProb:37, commFreq:38, orbit:3, type:"signal" },
        { id:"承認フロー", coupling:2.0, depStr:1.6, changeProb:56, commFreq:68, orbit:3, type:"proc" },
        { id:"キーマン", coupling:2.3, depStr:2.3, changeProb:66, commFreq:90, orbit:4, type:"human" },
        { id:"ベンダー", coupling:1.0, depStr:0.9, changeProb:65, commFreq:66, orbit:4, type:"org" },
        { id:"組織文化", coupling:2.1, depStr:1.9, changeProb:40, commFreq:69, orbit:4, type:"org" },
        { id:"WBS", coupling:1.6, depStr:1.4, changeProb:62, commFreq:77, orbit:4, type:"proc" },
        { id:"変更管理", coupling:1.9, depStr:1.8, changeProb:75, commFreq:53, orbit:4, type:"proc" },
        { id:"形式知", coupling:2.7, depStr:2.6, changeProb:24, commFreq:31, orbit:4, type:"concept" },
        { id:"外部知見", coupling:1.6, depStr:1.4, changeProb:77, commFreq:61, orbit:5, type:"human" },
        { id:"クライアント", coupling:1.1, depStr:0.9, changeProb:59, commFreq:43, orbit:5, type:"org" },
        { id:"ベンダ体制", coupling:1.1, depStr:1.0, changeProb:45, commFreq:53, orbit:5, type:"org" },
        { id:"エスカレーション", coupling:2.3, depStr:2.0, changeProb:80, commFreq:42, orbit:5, type:"proc" },
        { id:"報告", coupling:2.2, depStr:1.8, changeProb:85, commFreq:42, orbit:5, type:"proc" },
        { id:"会議", coupling:2.3, depStr:2.2, changeProb:81, commFreq:63, orbit:5, type:"proc" },
        { id:"レポートライン", coupling:2.2, depStr:2.0, changeProb:31, commFreq:61, orbit:5, type:"proc" },
        { id:"スコープクリープ", coupling:2.0, depStr:1.8, changeProb:76, commFreq:49, orbit:5, type:"signal" },
        { id:"工程未完了", coupling:1.5, depStr:1.2, changeProb:61, commFreq:46, orbit:5, type:"signal" },
      ],
      edges: [
        { s:0,t:1,w:1.9 },{ s:0,t:3,w:2.1 },{ s:1,t:4,w:1.3 },{ s:1,t:12,w:2.0 },
        { s:6,t:11,w:2.3 },{ s:7,t:10,w:1.7 },{ s:12,t:5,w:1.1 },
        { s:16,t:17,w:1.9 },{ s:18,t:7,w:2.8 },
      ],
      drift: {
        labels: ["W1","W2","W3","W4","W5","W6","W7","W8"],
        plan:   [100,86,72,58,44,30,16,5],
        actual: [100,85,71,57,43,29,15,4],
      }
    },
  },
];

const STATUS = {
  critical: { label: "要対応", color: C.critical, bg: "#F9EEF3", border: "#DDB8CA" },
  warn:     { label: "注意",   color: C.strong,   bg: "#EEEDFB", border: C.mid },
  healthy:  { label: "健全",   color: C.thing,    bg: "#EAF8F3", border: "#A8DECE" },
};
const AXIS = {
  S: { label: "Static",  color: C.thing, bg: "#EAF8F3" },
  D: { label: "Dynamic", color: C.human, bg: "#EEEDFB" },
};

function Sparkline({ data, color, w = 80, h = 28 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`
  ).join(" ");
  const [lx, ly] = pts.split(" ").pop().split(",");
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <circle cx={lx} cy={ly} r={2.5} fill={color} />
    </svg>
  );
}

function ScoreRing({ value, size = 60, color, sublabel }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.27, fontWeight: 700, color, lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>{value}</span>
        {sublabel && <span style={{ fontSize: 7.5, color: C.textWeak, marginTop: 1 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

function Bar({ value, color, height = 4 }) {
  return (
    <div style={{ height, background: C.border, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99, transition: "width 0.8s ease" }} />
    </div>
  );
}

function AxisBlock({ axis, scores, items }) {
  const ax = AXIS[axis];
  const avg = Math.round(Object.values(scores).reduce((a, v) => a + v, 0) / Object.values(scores).length);
  return (
    <div style={{ flex: 1, background: C.bgCard, border: `1.5px solid ${ax.color}30`, borderTop: `3px solid ${ax.color}`, borderRadius: "0 0 10px 10px", padding: "14px 16px", boxShadow: "0 1px 5px rgba(83,74,183,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <div style={{ width: 3, height: 14, background: ax.color, borderRadius: 2 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: ax.color, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
              {axis === "S" ? "STATIC AXIS" : "DYNAMIC AXIS"}
            </span>
          </div>
          <div style={{ fontSize: 11, color: C.textMid }}>{axis === "S" ? "構造・計画の世界" : "人・関係性の世界"}</div>
        </div>
        <ScoreRing value={avg} size={48} color={scoreColor(avg)} sublabel="avg" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => {
          const v = scores[item.key], c = scoreColor(v);
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: "'DM Mono', monospace" }}>{v}</span>
              </div>
              <Bar value={v} color={c} height={4} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── オントロジーグラフ（同心円軌道） ──
const ONT_CATS = [
  { id:"human",  label:"人・役割",       color:"#534AB7" },
  { id:"org",    label:"組織・文化",     color:"#4A90C4" },
  { id:"proc",   label:"プロセス",       color:"#5DB99A" },
  { id:"signal", label:"状態・シグナル", color:"#8B3A5A" },
  { id:"concept",label:"概念・定義",     color:"#C09040" },
];
const ONT_NODES = [
  { id:"core",    label:"プロジェクト",    cat:"concept", orbit:0 },
  { id:"pm",      label:"PM",              cat:"human",   orbit:1 },
  { id:"risk",    label:"リスク管理",      cat:"concept", orbit:1 },
  { id:"phase",   label:"フェーズ",        cat:"concept", orbit:1 },
  { id:"pmo",     label:"PMO",             cat:"human",   orbit:2 },
  { id:"done",    label:"完了定義",        cat:"concept", orbit:2 },
  { id:"issue",   label:"課題対応",        cat:"signal",  orbit:2 },
  { id:"meaning", label:"意味共有",        cat:"concept", orbit:2 },
  { id:"hub",     label:"情報ハブ",        cat:"human",   orbit:3 },
  { id:"sponsor", label:"ステークホルダー",cat:"human",   orbit:3 },
  { id:"tacit",   label:"暗黙知",          cat:"concept", orbit:3 },
  { id:"signal",  label:"シグナル",        cat:"signal",  orbit:3 },
  { id:"approval",label:"承認フロー",      cat:"proc",    orbit:3 },
  { id:"keyman",  label:"キーマン",        cat:"human",   orbit:4 },
  { id:"vendor",  label:"ベンダー",        cat:"org",     orbit:4 },
  { id:"culture", label:"組織文化",        cat:"org",     orbit:4 },
  { id:"wbs",     label:"WBS",             cat:"proc",    orbit:4 },
  { id:"change",  label:"変更管理",        cat:"proc",    orbit:4 },
  { id:"formal",  label:"形式知",          cat:"concept", orbit:4 },
  { id:"extern",  label:"外部知見",        cat:"human",   orbit:5 },
  { id:"client",  label:"クライアント",    cat:"org",     orbit:5 },
  { id:"vendorg", label:"ベンダ体制",      cat:"org",     orbit:5 },
  { id:"escal",   label:"エスカレーション",cat:"proc",    orbit:5 },
  { id:"report",  label:"報告",            cat:"proc",    orbit:5 },
  { id:"meeting", label:"会議",            cat:"proc",    orbit:5 },
  { id:"repline", label:"レポートライン",  cat:"proc",    orbit:5 },
  { id:"scope",   label:"スコープクリープ",cat:"signal",  orbit:5 },
  { id:"exit",    label:"工程未完了",      cat:"signal",  orbit:5 },
];
const ONT_EDGES = [
  ["core","phase"],["core","done"],["core","risk"],["core","meaning"],
  ["pm","pmo"],["pm","hub"],["pm","sponsor"],["pm","approval"],
  ["pmo","approval"],["pmo","report"],
  ["hub","pm"],["hub","keyman"],
  ["vendor","vendorg"],["vendor","wbs"],
  ["extern","pm"],
  ["client","culture"],["client","vendorg"],
  ["approval","done"],["approval","escal"],
  ["wbs","change"],["change","escal"],
  ["report","meeting"],
  ["issue","signal"],["issue","repline"],["issue","scope"],["issue","exit"],
  ["signal","report"],["signal","meeting"],
  ["tacit","formal"],["tacit","meaning"],["formal","meaning"],
  ["risk","issue"],["risk","signal"],
  ["meaning","done"],["meaning","tacit"],
  ["phase","done"],
];
const ONT_CAT_COLOR = Object.fromEntries(ONT_CATS.map(c=>[c.id,c.color]));
const ONT_ORBIT_R = [0, 0.10, 0.19, 0.28, 0.37, 0.46];

function OntologyGraph() {
  const canvasRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const posRef = useRef({});

  function buildLayout(W) {
    const cx=W/2, cy=W/2;
    const byOrbit={};
    for(let i=0;i<=5;i++) byOrbit[i]=[];
    ONT_NODES.forEach(n=>byOrbit[n.orbit].push(n));
    const pos={};
    ONT_NODES.forEach(n=>{
      if(n.orbit===0){ pos[n.id]={x:cx,y:cy}; return; }
      const r=ONT_ORBIT_R[n.orbit]*W;
      const group=byOrbit[n.orbit];
      const idx=group.findIndex(g=>g.id===n.id);
      const offset=[0,0.5,1.0,1.6,0.3,0.8][n.orbit]||0;
      const angle=(idx/group.length)*Math.PI*2+offset;
      pos[n.id]={x:cx+Math.cos(angle)*r, y:cy+Math.sin(angle)*r};
    });
    return pos;
  }

  function nodeR(n){ return n.orbit===0?18:14; }
  function edgePt(ax,ay,ra,bx,by){
    const dx=bx-ax,dy=by-ay,d=Math.hypot(dx,dy)||1;
    return {x:ax+dx/d*ra, y:ay+dy/d*ra};
  }

  function draw(W, pos, filter, hov) {
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,W,W);
    const cx=W/2, cy=W/2;
    const orbitCol="rgba(0,0,0,0.16)";
    for(let i=1;i<=5;i++){
      const r=ONT_ORBIT_R[i]*W;
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle=orbitCol; ctx.lineWidth=0.8;
      ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
    }
    ONT_EDGES.forEach(([a,b])=>{
      const na=ONT_NODES.find(n=>n.id===a), nb=ONT_NODES.find(n=>n.id===b);
      if(!na||!nb) return;
      const showA=filter==="all"||na.cat===filter||na.orbit===0;
      const showB=filter==="all"||nb.cat===filter||nb.orbit===0;
      if(!showA||!showB) return;
      const pa=pos[a], pb=pos[b];
      if(!pa||!pb) return;
      const s=edgePt(pa.x,pa.y,nodeR(na)+1,pb.x,pb.y);
      const e=edgePt(pb.x,pb.y,nodeR(nb)+2,pa.x,pa.y);
      const col=nb.orbit===0?"#534AB7":(ONT_CAT_COLOR[nb.cat]||"#888");
      ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(e.x,e.y);
      ctx.strokeStyle=col+"55"; ctx.lineWidth=1.0; ctx.stroke();
      const ang=Math.atan2(e.y-s.y,e.x-s.x), hs=6;
      ctx.beginPath();
      ctx.moveTo(e.x,e.y);
      ctx.lineTo(e.x-hs*Math.cos(ang-0.38),e.y-hs*Math.sin(ang-0.38));
      ctx.lineTo(e.x-hs*Math.cos(ang+0.38),e.y-hs*Math.sin(ang+0.38));
      ctx.closePath(); ctx.fillStyle=col+"55"; ctx.fill();
    });
    ONT_NODES.forEach(n=>{
      const show=filter==="all"||n.cat===filter||n.orbit===0;
      if(!show) return;
      const p=pos[n.id]; if(!p) return;
      const isHov=hov===n.id;
      const color=n.orbit===0?"#534AB7":(ONT_CAT_COLOR[n.cat]||"#888");
      const r=nodeR(n)+(isHov?2:0);
      ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2);
      ctx.fillStyle=color+"22"; ctx.fill();
      ctx.strokeStyle=color; ctx.lineWidth=n.orbit===0?2.0:(isHov?1.8:0.9); ctx.stroke();
      ctx.fillStyle=n.orbit===0?"#26215C":"#1a1833";
      ctx.textAlign="center"; ctx.textBaseline="middle";
      const label=n.label;
      if(label.length>5){
        const mid=Math.ceil(label.length/2);
        ctx.font=`${n.orbit===0?600:500} ${n.orbit===0?9:8}px Noto Sans JP,sans-serif`;
        ctx.fillText(label.slice(0,mid),p.x,p.y-4.5);
        ctx.fillText(label.slice(mid),p.x,p.y+4.5);
      } else {
        ctx.font=`${n.orbit===0?600:500} ${n.orbit===0?10:9}px Noto Sans JP,sans-serif`;
        ctx.fillText(label,p.x,p.y);
      }
    });
  }

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const dpr=window.devicePixelRatio||1;
    const W=canvas.parentElement.clientWidth||300;
    canvas.style.width=W+"px";
    canvas.style.height=W+"px";
    canvas.width=Math.round(W*dpr);
    canvas.height=Math.round(W*dpr);
    const ctx=canvas.getContext("2d");
    ctx.scale(dpr,dpr);
    const pos=buildLayout(W);
    posRef.current={pos,W,dpr};
    draw(W,pos,activeFilter,hovered);
    const ro=new ResizeObserver(()=>{
      const nW=canvas.parentElement.clientWidth||300;
      canvas.style.width=nW+"px";
      canvas.style.height=nW+"px";
      canvas.width=Math.round(nW*dpr);
      canvas.height=Math.round(nW*dpr);
      const c2=canvas.getContext("2d");
      c2.scale(dpr,dpr);
      const nPos=buildLayout(nW);
      posRef.current={pos:nPos,W:nW,dpr};
      draw(nW,nPos,activeFilter,hovered);
    });
    ro.observe(canvas.parentElement);
    return ()=>ro.disconnect();
  },[activeFilter,hovered]);

  function handleMouseMove(e){
    const canvas=canvasRef.current; if(!canvas) return;
    const rect=canvas.getBoundingClientRect();
    const {W}=posRef.current||{W:rect.width};
    const sc=W/rect.width;
    const mx=(e.clientX-rect.left)*sc;
    const my=(e.clientY-rect.top)*sc;
    let found=null;
    ONT_NODES.forEach(n=>{
      if(activeFilter!=="all"&&n.cat!==activeFilter&&n.orbit!==0) return;
      const p=(posRef.current?.pos||posRef.current||{})[n.id];
      if(p&&Math.hypot(mx-p.x,my-p.y)<nodeR(n)+4) found=n.id;
    });
    setHovered(found);
    if(found){
      const node=ONT_NODES.find(n=>n.id===found);
      const cat=ONT_CATS.find(c=>c.id===node.cat);
      setTooltip({label:node.label, cat:cat?.label||"", x:e.clientX-rect.left+10, y:e.clientY-rect.top-10});
    } else setTooltip(null);
  }

  return (
    <div>
      {/* カテゴリフィルター */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:8 }}>
        {[{id:"all",label:"すべて",color:"#888780"},...ONT_CATS].map(c=>(
          <button key={c.id} onClick={()=>setActiveFilter(c.id)} style={{
            fontSize:9, fontWeight:600, padding:"2px 8px", borderRadius:10,
            border:`1px solid ${c.color}`,
            background:activeFilter===c.id?c.color:"transparent",
            color:activeFilter===c.id?"#fff":c.color,
            cursor:"pointer",
          }}>{c.label}</button>
        ))}
      </div>
      <div style={{ position:"relative" }}>
        <canvas ref={canvasRef} style={{ display:"block", width:"100%", cursor:"default" }}
          onMouseMove={handleMouseMove} onMouseLeave={()=>{ setHovered(null); setTooltip(null); }} />
        {tooltip && (
          <div style={{
            position:"absolute", left:tooltip.x, top:tooltip.y,
            background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:6,
            padding:"5px 9px", fontSize:11, pointerEvents:"none", zIndex:10,
            boxShadow:"0 2px 8px rgba(83,74,183,0.12)",
          }}>
            <div style={{ fontWeight:700, color:C.text, marginBottom:2 }}>{tooltip.label}</div>
            <div style={{ color:C.textWeak, fontSize:10 }}>{tooltip.cat}</div>
          </div>
        )}
      </div>
      {/* 凡例 */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
        {ONT_CATS.map(c=>(
          <div key={c.id} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, color:C.textWeak }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:c.color+"22", border:`1px solid ${c.color}` }} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}


// ── Stakeholder View（体制図） ──
const DEFAULT_CHART = {
  nodes: [
    { id:"n1",  label:"プロジェクト\nオーナー",    row:0, col:4 },
    { id:"n2",  label:"プロジェクト\nマネージャー",row:1, col:4 },
    { id:"n3",  label:"フロントエンド\nプロジェクト\nリーダー", row:2, col:2 },
    { id:"n4",  label:"バックエンド\nプロジェクト\nリーダー",  row:2, col:6 },
    { id:"n5",  label:"UI開発\nチームリーダー",    row:3, col:1 },
    { id:"n6",  label:"サイトデザイン\nチームリーダー", row:3, col:2 },
    { id:"n7",  label:"SEO対策コンテンツ\nチームリーダー", row:3, col:3 },
    { id:"n8",  label:"サーバー開発\nチームリーダー", row:3, col:5 },
    { id:"n9",  label:"データベース\nチームリーダー", row:3, col:6 },
    { id:"n10", label:"クラウド開発\nチームリーダー", row:3, col:7 },
    { id:"n11", label:"SE",      row:4, col:1 },
    { id:"n12", label:"エディター",row:4, col:3 },
    { id:"n13", label:"SE",      row:4, col:5 },
    { id:"n14", label:"SE",      row:4, col:6 },
    { id:"n15", label:"SE",      row:4, col:7 },
    { id:"n16", label:"PG",      row:5, col:1 },
    { id:"n17", label:"Webデザイナー", row:5, col:2 },
    { id:"n18", label:"ライター", row:5, col:3 },
    { id:"n19", label:"PG",      row:5, col:5 },
    { id:"n20", label:"PG",      row:5, col:6 },
    { id:"n21", label:"PG",      row:5, col:7 },
  ],
  edges: [
    ["n1","n2"],
    ["n2","n3"],["n2","n4"],
    ["n3","n5"],["n3","n6"],["n3","n7"],
    ["n4","n8"],["n4","n9"],["n4","n10"],
    ["n5","n11"],["n6","n17"],["n7","n12"],["n7","n18"],
    ["n8","n13"],["n9","n14"],["n10","n15"],
    ["n11","n16"],["n13","n19"],["n14","n20"],["n15","n21"],
  ]
};

function StakeholderView() {
  // ── 初期データ ──
  const initNodes = () => [
    { id:"n1",  label:"プロジェクト\nオーナー",              row:0, col:4,  name:"", scope:"", note:"" },
    { id:"n2",  label:"PM",                                   row:1, col:3,  name:"", scope:"", note:"" },
    { id:"n3",  label:"PMO",                                  row:1, col:5,  name:"", scope:"", note:"" },
    { id:"n4",  label:"フロントエンド\nリーダー",             row:2, col:2,  name:"", scope:"", note:"" },
    { id:"n5",  label:"バックエンド\nリーダー",               row:2, col:6,  name:"", scope:"", note:"" },
    { id:"n6",  label:"UI開発\nチームリーダー",               row:3, col:1,  name:"", scope:"", note:"" },
    { id:"n7",  label:"サイトデザイン\nチームリーダー",       row:3, col:2,  name:"", scope:"", note:"" },
    { id:"n8",  label:"SEO対策コンテンツ\nチームリーダー",    row:3, col:3,  name:"", scope:"", note:"" },
    { id:"n9",  label:"サーバー開発\nチームリーダー",         row:3, col:5,  name:"", scope:"", note:"" },
    { id:"n10", label:"データベース\nチームリーダー",         row:3, col:6,  name:"", scope:"", note:"" },
    { id:"n11", label:"クラウド開発\nチームリーダー",         row:3, col:7,  name:"", scope:"", note:"" },
    { id:"n12", label:"SE",            row:4, col:1,  name:"", scope:"", note:"" },
    { id:"n13", label:"ディレクター",  row:4, col:2,  name:"", scope:"", note:"" },
    { id:"n14", label:"エディター",    row:4, col:3,  name:"", scope:"", note:"" },
    { id:"n15", label:"SE",            row:4, col:5,  name:"", scope:"", note:"" },
    { id:"n16", label:"SE",            row:4, col:6,  name:"", scope:"", note:"" },
    { id:"n17", label:"SE",            row:4, col:7,  name:"", scope:"", note:"" },
    { id:"n18", label:"PG",            row:5, col:1,  name:"", scope:"", note:"" },
    { id:"n19", label:"Webデザイナー", row:5, col:2,  name:"", scope:"", note:"" },
    { id:"n20", label:"ライター",      row:5, col:3,  name:"", scope:"", note:"" },
    { id:"n21", label:"PG",            row:5, col:5,  name:"", scope:"", note:"" },
    { id:"n22", label:"PG",            row:5, col:6,  name:"", scope:"", note:"" },
    { id:"n23", label:"PG",            row:5, col:7,  name:"", scope:"", note:"" },
  ];
  const initEdges = () => [
    ["n1","n2"],["n1","n3"],
    ["n2","n4"],["n2","n5"],
    ["n4","n6"],["n4","n7"],["n4","n8"],
    ["n5","n9"],["n5","n10"],["n5","n11"],
    ["n6","n12"],["n7","n13"],["n8","n14"],
    ["n9","n15"],["n10","n16"],["n11","n17"],
    ["n12","n18"],["n13","n19"],["n14","n20"],
    ["n15","n21"],["n16","n22"],["n17","n23"],
  ];

  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);
  const [selectedId, setSelectedId] = useState(null);
  const [saved, setSaved] = useState({});
  // 編集モード: null | "move" | "connect"
  const [editMode, setEditMode] = useState(null);
  const [connectFrom, setConnectFrom] = useState(null);
  const [dragInfo, setDragInfo] = useState(null);

  const COL_W=110, ROW_H=88, PAD_X=20, PAD_Y=24, BOX_W=94, BOX_H=60;
  const maxCol = Math.max(...nodes.map(n=>n.col), 0);
  const maxRow = Math.max(...nodes.map(n=>n.row), 0);
  const SVG_W = (maxCol+2)*COL_W + PAD_X*2;
  const SVG_H = (maxRow+2)*ROW_H + PAD_Y*2;

  // 複雑性スコア
  const layerCount = maxRow + 1;
  const nodeCount  = nodes.length;
  const complexity = Math.round((layerCount * 1.5 + nodeCount * 0.5) * 10) / 10;

  function nodePos(n){ return { x: PAD_X+n.col*COL_W+COL_W/2, y: PAD_Y+n.row*ROW_H+ROW_H/2 }; }
  function genId(){ return "n"+Date.now()+Math.floor(Math.random()*1000); }

  const selectedNode = nodes.find(n=>n.id===selectedId);

  // ── ノード操作 ──
  function addNode() {
    const newId = genId();
    setNodes(ns=>[...ns, { id:newId, label:"新しいロール", row:maxRow+1, col:Math.floor((maxCol+1)/2), name:"", scope:"", note:"" }]);
    setSelectedId(newId);
  }
  function deleteNode(id) {
    setNodes(ns=>ns.filter(n=>n.id!==id));
    setEdges(es=>es.filter(([a,b])=>a!==id&&b!==id));
    setSelectedId(null);
  }
  function updateNode(id, field, val) {
    setNodes(ns=>ns.map(n=>n.id===id?{...n,[field]:val}:n));
  }
  function moveNode(id, drow, dcol) {
    setNodes(ns=>ns.map(n=>n.id===id?{...n, row:Math.max(0,n.row+drow), col:Math.max(0,n.col+dcol)}:n));
  }
  function saveDet(id) {
    setSaved(s=>({...s,[id]:true}));
    setTimeout(()=>setSaved(s=>({...s,[id]:false})),1800);
  }

  // ── エッジ操作 ──
  function toggleEdge(fromId, toId) {
    if(fromId===toId) return;
    const exists = edges.some(([a,b])=>a===fromId&&b===toId);
    if(exists) setEdges(es=>es.filter(([a,b])=>!(a===fromId&&b===toId)));
    else setEdges(es=>[...es,[fromId,toId]]);
  }

  // ── CSVインポート ──
  function handleCSV(e) {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const lines = ev.target.result.split("\n").map(l=>l.trim()).filter(Boolean);
      const header = lines[0].split(",").map(s=>s.trim());
      const ri=header.indexOf("role"), ni=header.indexOf("name"), pi=header.indexOf("parent");
      if(ri<0||pi<0){ alert("CSVに role, parent 列が必要です"); return; }
      const rows = lines.slice(1).map(l=>{ const c=l.split(","); return { role:c[ri]?.trim()||"", name:c[ni]?.trim()||"", parent:c[pi]?.trim()||"" }; });
      // 木構造から row/col を計算
      const nodeMap={};
      const newNodes=[], newEdges=[];
      const colCount={};
      rows.forEach((r,i)=>{ nodeMap[r.role]={id:"csv"+i, label:r.role.replace(/\\s+/g,"\n"), name:r.name, row:0, col:0, scope:"", note:""}; });
      // BFSで層を決定
      const roots = rows.filter(r=>!r.parent||!nodeMap[r.parent]);
      const queue=[...roots.map(r=>({role:r.role,row:0}))];
      const visited={};
      while(queue.length){
        const {role,row}=queue.shift();
        if(visited[role]) continue;
        visited[role]=true;
        if(!nodeMap[role]) continue;
        colCount[row]=(colCount[row]||0);
        nodeMap[role].row=row;
        nodeMap[role].col=colCount[row];
        colCount[row]++;
        rows.filter(r=>r.parent===role).forEach(child=>queue.push({role:child.role,row:row+1}));
      }
      Object.values(nodeMap).forEach(n=>newNodes.push(n));
      rows.forEach(r=>{ if(r.parent&&nodeMap[r.parent]&&nodeMap[r.role]) newEdges.push([nodeMap[r.parent].id, nodeMap[r.role].id]); });
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedId(null);
    };
    reader.readAsText(file);
    e.target.value="";
  }

  // ── CSVエクスポート ──
  function exportCSV() {
    const lines=["role,name,parent"];
    const parentMap={};
    edges.forEach(([a,b])=>{ parentMap[b]=a; });
    nodes.forEach(n=>{
      const parentNode=parentMap[n.id]?nodes.find(x=>x.id===parentMap[n.id]):null;
      lines.push(`${n.label.replace(/\n/g," ")},${n.name||""},${parentNode?parentNode.label.replace(/\n/g," "):""}`);
    });
    const blob=new Blob([lines.join("\n")],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="stakeholders.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // ── ノードクリック処理 ──
  function handleNodeClick(n) {
    if(editMode==="connect") {
      if(!connectFrom) { setConnectFrom(n.id); return; }
      if(connectFrom!==n.id) toggleEdge(connectFrom, n.id);
      setConnectFrom(null);
    } else {
      setSelectedId(selectedId===n.id?null:n.id);
    }
  }

  return (
    <div style={{display:"flex",flex:1,overflow:"hidden",background:C.bg}}>

      {/* 体制図エリア */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minWidth:0}}>

        {/* ヘッダー */}
        <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.border}`,background:C.bgCard,display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:C.human,flexShrink:0}}/>
          <span style={{fontSize:11,fontWeight:700,color:C.human,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>STAKEHOLDERS</span>

          {/* 複雑性スコア */}
          <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:8,padding:"2px 10px",background:C.bg,borderRadius:5,border:`1px solid ${C.border}`}}>
            <span style={{fontSize:9,color:C.textWeak,fontFamily:"'DM Mono',monospace"}}>層数</span>
            <span style={{fontSize:12,fontWeight:700,color:layerCount>=7?C.critical:layerCount>=5?C.strong:C.thing}}>{layerCount}</span>
            <span style={{fontSize:9,color:C.border}}>|</span>
            <span style={{fontSize:9,color:C.textWeak,fontFamily:"'DM Mono',monospace"}}>ノード</span>
            <span style={{fontSize:12,fontWeight:700,color:C.text}}>{nodeCount}</span>
            <span style={{fontSize:9,color:C.border}}>|</span>
            <span style={{fontSize:9,color:C.textWeak,fontFamily:"'DM Mono',monospace"}}>複雑性</span>
            <span style={{fontSize:12,fontWeight:700,color:complexity>=20?C.critical:complexity>=12?C.strong:C.thing}}>{complexity}</span>
          </div>

          <div style={{flex:1}}/>

          {/* 編集モードトグル */}
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>{setEditMode(editMode==="connect"?null:"connect");setConnectFrom(null);}}
              style={{fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,
                background:editMode==="connect"?C.human:"transparent",
                color:editMode==="connect"?"#fff":C.textMid,cursor:"pointer"}}>
              {editMode==="connect"?`接続中 ${connectFrom?"→ クリックして接続先を選択":"→ 起点を選択"}`:  "線を編集"}
            </button>
            <button onClick={addNode}
              style={{fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.human}`,background:"transparent",color:C.human,cursor:"pointer"}}>
              ＋ ロール追加
            </button>
          </div>

          {/* CSV操作 */}
          <label style={{fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:"transparent",color:C.textMid,cursor:"pointer"}}>
            📁 CSVインポート
            <input type="file" accept=".csv" onChange={handleCSV} style={{display:"none"}}/>
          </label>
          <button onClick={exportCSV}
            style={{fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:"transparent",color:C.textMid,cursor:"pointer"}}>
            ↓ エクスポート
          </button>
        </div>

        {/* SVG体制図 */}
        <div style={{flex:1,overflow:"auto",padding:"16px 20px",background:C.bgCard}}>
          <svg width={SVG_W} height={SVG_H} style={{display:"block",minWidth:SVG_W}}>

            {/* グリッドガイド（薄く） */}
            {Array.from({length:maxRow+2}).map((_,r)=>(
              <line key={"r"+r} x1={0} y1={PAD_Y+r*ROW_H} x2={SVG_W} y2={PAD_Y+r*ROW_H}
                stroke={C.border} strokeWidth={0.5} strokeDasharray="3 4" opacity={0.4}/>
            ))}
            {/* 層ラベル */}
            {Array.from({length:maxRow+1}).map((_,r)=>(
              <text key={"rl"+r} x={8} y={PAD_Y+r*ROW_H+ROW_H/2}
                fontSize={8} fill={C.textWeak} fontFamily="'DM Mono',monospace"
                dominantBaseline="middle">L{r}</text>
            ))}

            {/* エッジ（ノードより先に描画してボックスが上レイヤーになる） */}
            <g>
            {edges.map(([aId,bId],i)=>{
              const a=nodes.find(n=>n.id===aId), b=nodes.find(n=>n.id===bId);
              if(!a||!b) return null;
              const pa=nodePos(a), pb=nodePos(b);
              const midY=(pa.y+BOX_H/2+pb.y-BOX_H/2)/2;
              return (
                <g key={i} style={{cursor:"pointer"}} onClick={()=>editMode==="connect"&&toggleEdge(aId,bId)}>
                  <path d={`M${pa.x},${pa.y+BOX_H/2} L${pa.x},${midY} L${pb.x},${midY} L${pb.x},${pb.y-BOX_H/2}`}
                    fill="none" stroke="#D8D5EE" strokeWidth={1} strokeLinecap="round"/>
                  {/* 削除ハンドル（接続編集モード時） */}
                  {editMode==="connect" && (
                    <g onClick={e=>{e.stopPropagation();toggleEdge(aId,bId);}}>
                      <circle cx={(pa.x+pb.x)/2} cy={midY} r={8} fill={C.bgCard} stroke={C.critical} strokeWidth={1}/>
                      <text x={(pa.x+pb.x)/2} y={midY} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.critical}>✕</text>
                    </g>
                  )}
                </g>
              );
            })}
            </g>

            {/* connectFrom プレビュー */}
            {connectFrom && editMode==="connect" && (()=>{
              const fn=nodes.find(n=>n.id===connectFrom);
              if(!fn) return null;
              const p=nodePos(fn);
              return <circle cx={p.x} cy={p.y} r={BOX_W/2+4} fill="none" stroke={C.human} strokeWidth={2} strokeDasharray="4 2" opacity={0.7}/>;
            })()}

            {/* ノード（エッジより後に描画して常に上レイヤー） */}
            <g>
            {nodes.map(n=>{
              const {x,y}=nodePos(n);
              const bx=x-BOX_W/2, by=y-BOX_H/2;
              const isSelected=selectedId===n.id;
              const isConnectFrom=connectFrom===n.id;
              const hasDetail=n.name||n.scope||n.note;
              const lines=n.label.split("\n");
              const lineH=15, totalH=lines.length*lineH;
              const startY=y-totalH/2+lineH*0.5;
              return (
                <g key={n.id} style={{cursor:"pointer"}} onClick={()=>handleNodeClick(n)}>
                  {(isSelected||isConnectFrom) && <rect x={bx-3} y={by-3} width={BOX_W+6} height={BOX_H+6} rx={9} fill="none" stroke={isConnectFrom?C.thing:C.human} strokeWidth={1.5} strokeDasharray="4 2" opacity={0.8}/>}
                  <rect x={bx} y={by} width={BOX_W} height={BOX_H} rx={6}
                    fill={isSelected?C.human+"30":"#F4F3FB"}
                    stroke={isSelected?C.human:isConnectFrom?C.thing:"#C8C4E8"}
                    strokeWidth={isSelected||isConnectFrom?1.5:0.8}/>
                  {hasDetail && <circle cx={bx+BOX_W-5} cy={by+5} r={4} fill={C.thing}/>}
                  {lines.map((line,li)=>(
                    <text key={li} x={x} y={startY+li*lineH}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={10} fontFamily="Noto Sans JP,sans-serif"
                      fontWeight={isSelected?600:400}
                      fill={isSelected?C.human:"#9B97C4"}>{line}</text>
                  ))}
                  {/* 移動ボタン（選択時） */}
                  {isSelected && !editMode && [
                    {dr:-1,dc:0,label:"↑",dx:0,dy:-BOX_H/2-14},
                    {dr:1, dc:0,label:"↓",dx:0,dy:BOX_H/2+14},
                    {dr:0, dc:-1,label:"←",dx:-BOX_W/2-14,dy:0},
                    {dr:0, dc:1, label:"→",dx:BOX_W/2+14,dy:0},
                  ].map(({dr,dc,label,dx,dy})=>(
                    <g key={label} onClick={e=>{e.stopPropagation();moveNode(n.id,dr,dc);}}>
                      <circle cx={x+dx} cy={y+dy} r={10} fill={C.bgCard} stroke={C.human} strokeWidth={1}/>
                      <text x={x+dx} y={y+dy} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.human}>{label}</text>
                    </g>
                  ))}
                </g>
              );
            })}
            </g>
          </svg>
        </div>
      </div>

      {/* 右パネル */}
      <div style={{width:selectedNode?300:0,minWidth:selectedNode?300:0,overflow:"hidden",borderLeft:`1px solid ${C.border}`,background:C.bgCard,display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.2s ease,min-width 0.2s ease"}}>
        {selectedNode && (
          <div style={{width:300,display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
            {/* パネルヘッダー */}
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:C.textWeak,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:3}}>ROLE DEFINITION</div>
                <div style={{fontSize:13,fontWeight:700,color:C.human,lineHeight:1.3}}>{selectedNode.label.replace(/\n/g," ")}</div>
              </div>
              <button onClick={()=>setSelectedId(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.textWeak,fontSize:14,padding:3}}>✕</button>
            </div>

            <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>

              {/* ロール名 */}
              <div>
                <label style={{fontSize:9,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:5}}>ロール名</label>
                <input value={selectedNode.label.replace(/\n/g," ")}
                  onChange={e=>updateNode(selectedNode.id,"label",e.target.value)}
                  style={{width:"100%",padding:"7px 9px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bg,outline:"none",boxSizing:"border-box"}}/>
              </div>

              {/* 担当者名 */}
              <div>
                <label style={{fontSize:9,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:5}}>担当者名</label>
                <input value={selectedNode.name||""}
                  onChange={e=>updateNode(selectedNode.id,"name",e.target.value)}
                  placeholder="例：山田 太郎"
                  style={{width:"100%",padding:"7px 9px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bg,outline:"none",boxSizing:"border-box"}}/>
              </div>

              {/* 層・列位置 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={{fontSize:9,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:5}}>層（行）</label>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <button onClick={()=>moveNode(selectedNode.id,-1,0)} style={{padding:"3px 8px",border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",cursor:"pointer",color:C.textMid,fontSize:12}}>↑</button>
                    <span style={{fontSize:13,fontWeight:600,color:C.text,minWidth:20,textAlign:"center"}}>{selectedNode.row}</span>
                    <button onClick={()=>moveNode(selectedNode.id,1,0)} style={{padding:"3px 8px",border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",cursor:"pointer",color:C.textMid,fontSize:12}}>↓</button>
                  </div>
                </div>
                <div>
                  <label style={{fontSize:9,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:5}}>列</label>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <button onClick={()=>moveNode(selectedNode.id,0,-1)} style={{padding:"3px 8px",border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",cursor:"pointer",color:C.textMid,fontSize:12}}>←</button>
                    <span style={{fontSize:13,fontWeight:600,color:C.text,minWidth:20,textAlign:"center"}}>{selectedNode.col}</span>
                    <button onClick={()=>moveNode(selectedNode.id,0,1)} style={{padding:"3px 8px",border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",cursor:"pointer",color:C.textMid,fontSize:12}}>→</button>
                  </div>
                </div>
              </div>

              {/* 業務スコープ */}
              <div>
                <label style={{fontSize:9,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:5}}>業務スコープ</label>
                <textarea value={selectedNode.scope||""}
                  onChange={e=>updateNode(selectedNode.id,"scope",e.target.value)}
                  placeholder={"・担当範囲\n・責任境界\n・権限レベル"}
                  rows={5}
                  style={{width:"100%",padding:"7px 9px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bg,outline:"none",resize:"vertical",fontFamily:"Noto Sans JP,sans-serif",lineHeight:1.7,boxSizing:"border-box"}}/>
              </div>

              {/* 備考 */}
              <div>
                <label style={{fontSize:9,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:5}}>備考</label>
                <textarea value={selectedNode.note||""}
                  onChange={e=>updateNode(selectedNode.id,"note",e.target.value)}
                  placeholder="承認権限・例外・注意事項など"
                  rows={3}
                  style={{width:"100%",padding:"7px 9px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bg,outline:"none",resize:"vertical",fontFamily:"Noto Sans JP,sans-serif",lineHeight:1.7,boxSizing:"border-box"}}/>
              </div>

              {/* 削除 */}
              <button onClick={()=>deleteNode(selectedNode.id)}
                style={{padding:"7px 0",background:"transparent",color:C.textWeak,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11,cursor:"pointer",marginTop:4}}>
                このロールを削除
              </button>
            </div>

            {/* 保存 */}
            <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,flexShrink:0}}>
              <button onClick={()=>saveDet(selectedNode.id)}
                style={{width:"100%",padding:"8px 0",background:saved[selectedNode.id]?C.thing:C.human,color:"#fff",border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",transition:"background 0.3s"}}>
                {saved[selectedNode.id]?"✓ 保存しました":"定義を保存"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Glossary View ──
const GLOSSARY_DATA = {
  "スコープ管理": [
    { term:"プロジェクト", def:"独自の製品、サービス、または所産を創出するために実施される有期的な業務。" },
    { term:"プロジェクト憲章", def:"プロジェクトの存在を公式に認可し、プロジェクト・マネジャーにプロジェクト活動に組織の資源を適用する権限を与える文書。" },
    { term:"プロジェクトマネジメント計画書", def:"プロジェクトを実行し、監視し、コントロールし、終結する方法を記述した文書。" },
    { term:"WBS（ワーク・ブレークダウン・ストラクチャー）", def:"プロジェクト目標を達成し、必要な成果物を作成するために、プロジェクトチームが実行する全作業範囲を階層的に分解したもの。" },
    { term:"WBS辞書", def:"WBSの各コンポーネントに関する詳細な成果物、アクティビティ、およびスケジュール情報を記載した文書。" },
    { term:"ワーク・パッケージ", def:"ワーク・ブレークダウン・ストラクチャーの最下位のレベルに定義される作業。" },
    { term:"プロジェクト・スコープ", def:"特定の特性やフィーチャーを持つプロダクト、サービス、所産を生み出すために実行する作業。" },
    { term:"プロジェクト・スコープ記述書", def:"プロジェクトのスコープ、主要な成果物、除外事項を記述した文書。" },
    { term:"スコープ・クリープ", def:"プロジェクトのスコープが計画外に拡大していく現象。" },
    { term:"アウトプット", def:"プロセスによって生成されるプロダクト、所産、サービス。後続プロセスへのインプットとなることがある。" },
    { term:"所産", def:"プロジェクトマネジメントのプロセスとアクティビティを実行して得られるアウトプット。" },
    { term:"プロダクト", def:"生産され、定量化可能で、それ自体が最終生産物やその構成要素となる作成物。" },
    { term:"成果物", def:"プロジェクトの完了時に提供される製品、サービス、または所産。" },
    { term:"受入れ", def:"スポンサーや顧客が、成果物の完了を認めること。" },
    { term:"受入基準", def:"成果物が受け入れられる前に満たしておく必要がある条件。" },
    { term:"要求", def:"ビジネス・ニーズを満たすために、プロダクト、サービス、所産が備える必要がある条件や能力。" },
    { term:"要求事項トレーサビリティ・マトリックス", def:"プロダクトの要求事項を、その発生元からそれを満たす成果物にまで結び付けて格子状に示した図。" },
    { term:"要求事項文書", def:"個々の要求事項がプロジェクトのビジネス・ニーズをどのように満たすかについて記述した文書。" },
    { term:"要求事項マネジメント計画書", def:"要求事項の分析、文書化、マネジメントの方法を文書化したもの。" },
    { term:"要素分解", def:"プロジェクト・スコープやプロジェクト成果物を、より小さくマネジメントしやすい部分に分解し、さらに細分化する技法。" },
    { term:"エピック", def:"一群の要求事項を階層的に整理し、特定のビジネス成果を実現することを目的とした、大規模かつ関連する一連の作業。" },
    { term:"ユーザー・ストーリー", def:"特定のユーザーにとっての成果を簡潔に記述したもの。詳細を明確化するために会話をする約束である。" },
    { term:"プロダクト・バックログ", def:"プロダクトの改善に必要なすべての事項の優先順位付きリスト。スクラムにおいてプロダクト・オーナーが管理する。" },
    { term:"バックログ", def:"あるプロダクトのためにチームが維持する、ユーザー中心の要求事項を優先順位付けしたリスト。" },
    { term:"ビジネス・アナリシス", def:"ビジネス目標と一致し、継続的な価値を組織にもたらすようなソリューションの実現を支援するために実施される一群の活動。" },
    { term:"ビジネス・アナリスト", def:"ビジネス・アナリシスの作業を行う人。" },
  ],
  "スケジュール管理": [
    { term:"プロジェクト・ライフサイクル", def:"プロジェクトがたどる開始から完了に至る一連のフェーズ。" },
    { term:"プロジェクト・フェーズ", def:"論理的に関連のあるプロジェクト活動の集合。1つ以上の成果物の完了によって終了する。" },
    { term:"フェーズ", def:"プロジェクトライフサイクルを構成する、関連するプロジェクト活動の論理的なグループ。" },
    { term:"フェーズ・ゲート", def:"フェーズの終わりに実施されるレビュー。次フェーズへ進むか、継続するか、終了するかを決定する。" },
    { term:"立上げ", def:"プロジェクトの開始または次のフェーズへの移行を組織にコミットする活動。" },
    { term:"スケジュール・ベースライン", def:"プロジェクトの進捗管理をするための基準となる承認済みのスケジュール。" },
    { term:"プロジェクト・スケジュール", def:"スケジュール・モデルのアウトプットの1つ。関連性のあるアクティビティを、予定日、所要期間、マイルストーン、資源と共に示す。" },
    { term:"プロジェクト・スケジュール・ネットワーク図", def:"プロジェクトのスケジュール・アクティビティ間の論理的順序関係を示す図。" },
    { term:"アクティビティ", def:"プロジェクトの過程において実施されるべくスケジュールに組み込まれた個々の作業。" },
    { term:"アクティビティ所要期間", def:"あるスケジュール・アクティビティの開始から終了までの期間をカレンダーでの単位で示したもの。" },
    { term:"アクティビティ所要期間見積り", def:"アクティビティの完了に必要と想定される期間を定量的に評価すること。" },
    { term:"アクティビティ属性", def:"アクティビティ・リストに含まれる、各スケジュール・アクティビティに関連する複数の属性。" },
    { term:"マイルストーン", def:"プロジェクトプログラム、ポートフォリオにおいて重要な意味を持つ時点やイベント。" },
    { term:"マイルストーン・チャート", def:"予定日とマイルストーンを示すスケジュールのタイプ。" },
    { term:"クリティカルパス", def:"プロジェクトの最短完了日を決定する、最も長い作業経路。" },
    { term:"所要期間", def:"アクティビティまたはWBSコンポーネントを完了するために必要な総作業期間。" },
    { term:"先行関係", def:"プレシデンスダイアグラム法で使用する論理的依存関係。" },
    { term:"リード", def:"関係する先行アクティビティに対して、後続アクティビティの開始を前倒しできる時間。" },
    { term:"開始日", def:"スケジュール・アクティビティを開始した日付。計画開始日、最早開始日、最遅開始日など複数の種類がある。" },
    { term:"終了日", def:"スケジュール・アクティビティの完了に関連した日付。計画終了日、最早終了日、最遅終了日など複数の種類がある。" },
    { term:"スケジュール効率指数", def:"プランドバリュー（PV）に対する、アーンド・バリュー（EV）との比率として表すスケジュール効率の尺度。" },
    { term:"スケジュール差異", def:"スケジュールの進捗状況を測る尺度。アーンド・バリュー（EV）とプランド・バリュー（PV）の差。" },
    { term:"スケジュール短縮", def:"プロジェクト・スコープを縮小することなく、スケジュールの所要期間を短縮する技法。" },
    { term:"タイムボックス", def:"その間に作業を完了すべき短い固定の期間。" },
    { term:"タイムボックス・スケジューリング", def:"作業を固定された期間（タイムボックス）に制限し、その時間枠内で完了できる作業を計画する時間管理テクニック。" },
    { term:"オンデマンド・スケジューリング", def:"資源が必要とされる瞬間にリアルタイムで調整や割り当てを行う時間管理テクニック。" },
    { term:"ロードマップ", def:"マイルストーン、重要なイベント、レビュー、意思決定の時期などのスケジュールの大枠を示すもの。" },
    { term:"リリース", def:"同時に本稼働することが意図されたプロダクトの構成要素。" },
    { term:"リリース計画書", def:"一連の複数のイテレーションを通じて実現が期待される日付、フィーチャー、成果を明確化する計画書。" },
    { term:"イテレーション", def:"価値を実現するために必要なすべての作業が実行されるプロダクトまたは成果物の開発のためにタイムボックス化されたサイクル。" },
    { term:"スプリント", def:"タイムボックス化された短い開発サイクル。通常1〜4週間。" },
  ],
  "コスト管理": [
    { term:"EVM（アーンド・バリュー・マネジメント）", def:"プロジェクトのパフォーマンスと進捗を評価するために、スコープ、スケジュール、コスト、資源の測定値を結び付ける方法論。" },
    { term:"アーンド・バリュー", def:"実行した作業の測定値。実行した作業に対する承認済み予算額で表す。" },
    { term:"アーンド・バリュー分析", def:"プロジェクトのコストとスケジュールのパフォーマンスを判断するために、範囲、スケジュール、コストに関連付けられた一群の尺度を使用する分析方法。" },
    { term:"コスト・ベースライン", def:"時間軸ベースのプロジェクト予算の承認済み版で、マネジメント予備を除いたもの。" },
    { term:"コスト・マネジメント計画書", def:"コストをどのように計画し、構成し、コントロールするかを記述する。プロジェクトマネジメント計画書の構成要素の1つ。" },
    { term:"コスト見積り", def:"プロジェクトを完了するために必要な概算見積りを作成すること。" },
    { term:"コスト効率指数", def:"予算化された資源のコスト効率の尺度で、アーンド・バリュー（EV）の実コスト（AC）に対する比率で表した値。" },
    { term:"コスト差異", def:"ある時点での予算の黒字額や赤字額。アーンド・バリュー（EV）と実コスト（AC）の差で表す。" },
    { term:"実コスト", def:"所定の期間で実行した作業実行時に費やしたコスト。" },
    { term:"アクティビティ・コスト", def:"プロジェクトの過程において実施されるべくスケジュールに組み込まれた個々の作業を完了するために必要なコスト。" },
    { term:"コンティンジェンシー予備", def:"既知のリスクに備え、能動的な対応戦略によってスケジュールまたはコストのベースラインに割り当てられた時間または資金。" },
    { term:"マネジメント予備／マネジメント予備費", def:"マネジメント面のコントロールを目的として設定したプロジェクト予算またはスケジュール。" },
    { term:"パフォーマンス測定ベースライン", def:"スコープ、スケジュール、コストを統合したベースライン。" },
    { term:"見積りの根拠", def:"前提条件、制約条件、詳細度、見積幅、信頼度といった、プロジェクトの見積りを立てる際に使った詳細情報の概要を述べた裏付け文書。" },
    { term:"類推見積り", def:"類似のアクティビティやプロジェクトにおける過去のデータを使って、所要期間やコストを見積もる技法。" },
    { term:"ボトムアップ見積り", def:"WBSの下位レベルのコンポーネント単位の見積りを集計してプロジェクトの所要期間やコストを見積もる技法。" },
    { term:"予備設定分析", def:"プロジェクトのスケジュール所要期間、予算、コスト見積り、または資金についての予備を設定するために使われる分析技法の1つ。" },
    { term:"費用便益分析", def:"プロジェクトのコストに対して、プロジェクトによって得られるベネフィットを明らかにするために用いる財務分析ツール。" },
    { term:"価値工学", def:"製品やサービスの価値を、機能とそのコストの関係性をもとに提え、必要な機能を最低のコストで実現するための体系的な手法。" },
  ],
  "品質管理": [
    { term:"品質管理", def:"品質基準を満たし品質改善のための教訓を得るためにプロジェクトを監視すること。" },
    { term:"品質報告書", def:"品質マネジメントの課題、是正処置の提言、品質コントロール活動で発見した事項の要約を含むプロジェクト文書。" },
    { term:"品質方針", def:"組織が品質マネジメントに組織の方向性を示す方針。" },
    { term:"検査", def:"作業プロダクトを精査して、文書化された標準に適合しているかどうかを確認すること。" },
    { term:"検証", def:"プロダクト、サービス、または所産が、規制、要求事項、仕様指定された条件などに適合しているかどうかの評価。" },
    { term:"妥当性確認", def:"プロダクト、サービス、または所産が、顧客や特定のステークホルダーのニーズを満たしていることを確認すること。" },
    { term:"欠陥修正", def:"不適合プロダクトまたは不適合プロダクト構成要素を修正するための意図的な活動。" },
    { term:"是正処置", def:"プロジェクト作業をプロジェクトマネジメント計画書に沿うような再調整を意図する活動。" },
    { term:"予防処置", def:"プロジェクト作業の将来のパフォーマンスがプロジェクトマネジメント計画書に沿うようにするための意図的な活動。" },
    { term:"継続的改善", def:"組織のプロセス、サービス、製品の品質を段階的かつ恒常的に向上させるためのアプローチ。" },
    { term:"実行プロセス群", def:"プロジェクトの要求事項を満たすことを目的として、プロジェクトマネジメント計画書に定義された作業を完了するために実施するプロセス群。" },
    { term:"プロセス", def:"1つ以上のインプットから1つ以上のアウトプットを生むような、最終的な結果に向けて系統的に実行する一連の活動。" },
    { term:"プロセス・アプローチ", def:"目的達成に向けて活動を実行する際に、相互に関連するプロセスを適切に理解し、マネジメントするアプローチ。" },
    { term:"信頼性", def:"成果物やサービスが普通の状態で問題なく期待どおりに動作すること。" },
    { term:"親和図", def:"多くのアイデアをレビューや分析のためにグループ分けできる技法。" },
    { term:"レビュー", def:"製品、サービス、プロセス、文書、情報、またはパフォーマンスなどを評価し、フィードバックを提供するためのシステム的なプロセス。" },
    { term:"仕様書", def:"満たされなければならないニーズおよび求められる必須特性の正確な記述。" },
    { term:"PDCAサイクル", def:"計画（Plan）、実行（Do）、評価（Check）、行動（Act）の4つのフェーズから成り立ち、継続的改善を促すために設計されている。" },
    { term:"PDSAサイクル", def:"PDCAサイクルとよく似た、プロセス改善に用いられる反復的な手法。計画（Plan）、実行（Do）、学習（Study）、行動（Act）の4つのフェーズから成り立つ。" },
  ],
  "資源管理": [
    { term:"プロジェクト・チーム", def:"プロジェクト作業を実行して、プロジェクト・マネジャーがプロジェクト目標を達成できるように支援する人たちの集団。" },
    { term:"プロジェクト組織図", def:"特定のプロジェクトについてプロジェクトチームメンバーと、メンバー間の相互関係を図示した文書。" },
    { term:"RACIチャート", def:"責任分担マトリックスの一般的な形式。実行責任（R）、説明責任（A）、相談先（C）、報告先（I）という区分でステークホルダーの関わりを定義する。" },
    { term:"責任分担マトリックス", def:"ワーク・パッケージとそれに割り当てたプロジェクト資源を格子状に示す表。" },
    { term:"チーム憲章", def:"チームの意義、合意、運用指針を記録した文書。プロジェクトチームメンバーに受け入れられる振る舞いへの明確な期待を確立するもの。" },
    { term:"行動規範", def:"プロジェクトチームメンバーとして容認できる振る舞いについての期待。" },
    { term:"スクラム・チーム", def:"スクラムにおいて、1つの目的（プロダクトゴール）に集中している専門家が集まったチーム。" },
    { term:"スクラム・マスター", def:"スクラム・チームの中で進行や調整の役割を担う人。" },
    { term:"開発チーム", def:"スクラム・チームの一員であり、各スプリントにおいて、利用可能な漸増活動（インクリメント）を行う。" },
    { term:"バーチャル・チーム", def:"異なる場所で作業し、基本的に電話や電子コミュニケーションツールを通じて互いに関わり合い、ゴールを共有している人々のグループ。" },
    { term:"対人関係スキル", def:"他人との関係を構築し維持するために使われるスキル。" },
    { term:"コーチング", def:"個人やチームがその潜在能力を最大限に引き出し、具体的な目標達成を支援するプロセス。" },
    { term:"メンタリング", def:"経験豊富な個人（メンター）が、キャリアや個人的な成長を目指すメンティー（被指導者）に対して指導、アドバイス、サポートを提供するプロセス。" },
    { term:"継続的学習", def:"個人や組織が知識、スキル、能力を絶えず更新し、改善するプロセス。" },
    { term:"センター・オブ・エクセレンス", def:"特定の専門分野や重要なビジネス領域において、知識、技能、リーダーシップ、ベストプラクティスを集約・共有し、組織全体の能力を向上させるための内部グループまたは部門。" },
    { term:"モデル", def:"システム、現象、プロセス、または概念を表す抽象的な表現や単純化された表現。" },
  ],
  "調達管理": [
    { term:"実費償還契約", def:"事業やプロジェクトに関連する実際の経費をもとに支払いを行う契約形式。" },
    { term:"タイム・アンド・マテリアル契約", def:"定額契約と実費償還契約との折衷案。" },
    { term:"実務慣行", def:"プロセスの実行に寄与し、場合によってはいくつかの技法やツールを使って行われる、ある種の専門的活動やマネジメント活動。" },
    { term:"スポンサー", def:"プロジェクトに対して資源と支援を提供し、プロジェクトの成功に責任を持つ個人またはグループ。" },
    { term:"プロダクト・オーナー", def:"プロダクトの価値を最大化し、最終プロダクトの責任を負う人。" },
    { term:"プロダクト・ロードマップ", def:"プロダクトのビジョンと方向性を示す概略的な計画。" },
    { term:"母体組織", def:"プロジェクトを主催や支援したり、または資源や資金を提供する組織。" },
    { term:"ビジネス・ケース文書", def:"経済的な実現可能性調査結果をまとめた文書。" },
    { term:"ジャスト・イン・タイム", def:"生産プロセスにおいて、必要な部品や素材を必要なときに、必要な量だけ供給するシステムや管理手法。" },
    { term:"リーン生産方式", def:"トヨタ生産方式を起源とする開発手法であり、無駄を排除し、効率を最大化することを目的とした生産管理手法。" },
  ],
  "リスク管理": [
    { term:"リスク登録簿", def:"リスクマネジメントプロセスのアウトプットが記録されたリポジトリ。" },
    { term:"リスク・ログ", def:"リスクを特定、評価、監視し、その対応を追跡するために使用される文書またはツール。" },
    { term:"リスク・マネジメント計画書", def:"リスク・マネジメント活動を構造化し実行する方法を記述する。プロジェクトマネジメント計画書の構成要素の1つ。" },
    { term:"リスクの識別", def:"プロジェクトに影響しそうなリスクを洗い出し、それぞれのリスクの特性を文書化する。" },
    { term:"リスクの特定", def:"個別リスクと全体リスクの要因を特定し、それぞれの特性を文書化するプロセス。" },
    { term:"リスク対応計画", def:"プロジェクト目標を達成するうえでの脅威を減らし、好機の可能性を増やすための計画。" },
    { term:"リスク選好", def:"組織や個人が見返りを期待して不確かさを積極的に受け入れる度合い。" },
    { term:"リスク・ブレークダウン・ストラクチャー", def:"潜在的リスク要因の階層表示。" },
    { term:"発生確率影響度マトリックス", def:"発生するリスクの相対確率を一方の軸に表し、リスクの相対的影響度をもう一方の軸に表現したマトリクスあるいはチャート図。" },
    { term:"コンティンジェンシー", def:"プロジェクトの実行に影響を及ぼすイベントまたは出来事。予備でまかなうことがある。" },
    { term:"前提条件", def:"計画を立てるにあたって、証拠や実証なしに真実、現実、あるいは確実であると見なす要因。" },
    { term:"制約条件", def:"プロジェクトの実行に影響する制限要因。" },
  ],
  "コミュニケーション管理": [
    { term:"コミュニケーション・マネジメント計画書", def:"いつ、誰が、どのようにプロジェクトの情報を管理し、発信するかを記述したもの。" },
    { term:"コミュニケーション方法", def:"プロジェクト・ステークホルダーの間で情報を伝達するための系統的な手続き、技法、またはプロセス。" },
    { term:"情報ラジエーター", def:"組織の他の人々に提供し、タイミングよく知識を共有できるように、情報を視覚的・物理的に表すもの。" },
    { term:"進捗報告", def:"一定期間に実施した作業報告。" },
    { term:"ダッシュボード", def:"プロジェクトの重要な尺度に対する進捗状況またはパフォーマンスを示す一群のチャートやグラフ。" },
    { term:"タスク・ボード", def:"全員が各タスクの状態を確認できる、計画された作業の進捗状況を視覚的に表現したもの。" },
    { term:"積極的傾聴", def:"相手が話している内容を注意深く聞き、理解し、その理解を相手にフィードバックするプロセス。" },
    { term:"課題ログ", def:"課題についての情報が記録され監視されるプロジェクト文書。" },
    { term:"暗黙知", def:"信条、経験、洞察など、明示または共有が困難な個人の知識。" },
    { term:"プロジェクト文書", def:"プロジェクトの計画、実行、監視、および終結に関連するすべての情報の文書、記録。" },
    { term:"プロジェクトマネジメント情報システム", def:"プロジェクトマネジメントのプロセスから生み出されるアウトプットを収集し、統合し、配付するために使われるツールと技法からなる情報システム。" },
    { term:"レトロスペクティブ会議", def:"品質と効果を高める方法を計画することを目的に、活動の有効性を議論する振り返りの会議。" },
    { term:"チェンジ", def:"組織の目標、プロセス、技術の変革、変更のこと。" },
    { term:"コンフィギュレーション・マネジメント計画書", def:"コンフィギュレーション・コントロールの対象となるプロジェクト生成物の特定方法、説明責任の果たし方、変更の記録・報告方法を記述する文書。" },
  ],
  "ステークホルダー管理": [
    { term:"ステークホルダー", def:"プロジェクトに影響を与えるか、または影響を受ける可能性のある個人、グループ、または組織。" },
    { term:"ステークホルダー・エンゲージメント", def:"ステークホルダーのニーズと期待を満たし、課題に対処し、適切なステークホルダーの参加を促進するためのプロセス。" },
    { term:"ステークホルダー登録簿", def:"ステークホルダーに関する情報を記録し、監視するプロジェクト文書。" },
    { term:"プロジェクト・スポンサー", def:"プロジェクト、プログラム、またはポートフォリオに資源を提供し支援する個人またはグループ。" },
    { term:"プロジェクトマネジメント・オフィス（PMO）", def:"プロジェクトマネジメントに関連するガバナンスプロセスを標準化し、資源、方法論、ツール、および技法の共有を促進する組織構造。" },
    { term:"プロジェクト・マネジャー", def:"プロジェクト目標の達成に責任を持つチームを統率するために、母体組織が任命する人。" },
    { term:"プロジェクト・リーダー", def:"主にプロジェクトの作業を調整することによって、プロジェクト・チームがプロジェクトの目標を達成するのを支援する人。" },
    { term:"公式な権威", def:"組織から与えられる権限を利用して他人の行動を変えさせる力。" },
    { term:"専門家の権威", def:"個人の知識や専門分野を利用して他人の行動を変えさせる力。" },
    { term:"コンフリクト", def:"個人やグループ間の意見、目的、価値観の相違によって生じる緊張や不一致の状態。" },
    { term:"ADKARモデル", def:"組織変革に際して個人がたどる「認知・欲求・知識・能力・定着」の5つの連続したステップに焦点を当て設計されたチェンジマネジメントのフレームワーク。" },
    { term:"チェンジマネジメント", def:"組織の目標、プロセス、技術の変革、変更を効果的に管理し、導入するための体系的なアプローチ。" },
    { term:"戦略計画書", def:"組織のビジョンとミッション、さらにこのミッションとビジョンを達成するために採用されるアプローチを説明した高次の文書。" },
    { term:"組織体の環境要因", def:"チームの直接のコントロールは及ばないが、プロジェクト、プログラム、またはポートフォリオに影響を及ぼす、制約を与える、または方向性を示す状況。" },
    { term:"組織のプロセス資産", def:"母体組織が使う、同組織に特有の計画書、プロセス、文書、知識リポジトリ。" },
    { term:"プロジェクトマネジメント知識体系", def:"プロジェクトマネジメントという専門職における知識を指す用語。" },
    { term:"プロジェクトマネジメント", def:"プロジェクトの要求事項を満たすために、知識、スキル、ツールと技法をプロジェクトの諸活動へ適用すること。" },
  ],
  "開発管理": [
    { term:"アジャイル", def:"アジャイル宣言で表明されている価値と原則のマインドセットを説明するために使用される用語。" },
    { term:"開発アプローチ", def:"プロジェクトのライフサイクル期間において、プロダクト、サービス、または所産を創り発展させるために使う手法。予測型、反復型、漸進型、アジャイル型、ハイブリッドなどがある。" },
    { term:"予測型開発アプローチ", def:"時間軸に沿って直線的なアプローチを取る。代表的な例として、ウォーターフォール型がある。" },
    { term:"漸進型開発アプローチ", def:"徐々に段階を追って成果物を構築し、進化させていくアプローチ。" },
    { term:"ハイブリッド・アプローチ", def:"アジャイル要素と非アジャイル要素の2つ以上の組み合わせによる開発アプローチ。" },
    { term:"スクラム", def:"短期間で作業と検証を繰り返し行うことでアウトプットを生み出すソフトウェア開発を中心に使われているフレームワーク。" },
    { term:"インクリメント", def:"プロダクトゴールに向けた漸増的な活動およびそれらを合わせた作成物。" },
    { term:"イテレーション計画会議", def:"各イテレーションの開始時に、イテレーションで実行する作業の計画を立てる会議。" },
    { term:"イテレーション・バックログ", def:"開発チームによる、開発者のための計画。スプリント・ゴールを達成するために開発者がスプリントで行う作業がリアルタイムに反映される。" },
    { term:"イテレーション・レトロスペクティブ会議", def:"品質と効果を高める方法を計画することを目的に、各スプリントの終了時に、アジャイル・チームがスプリントの有効性を議論する振り返りの会議。" },
    { term:"イテレーション・レビュー会議", def:"イテレーションの成果を検査し、今後の適応を決定することを目的に行われる会議。" },
    { term:"スプリント・バックログ", def:"スプリントゴール、スプリントで選択したプロダクトバックログのアイテム、およびインクリメントを届けるための実行計画。" },
    { term:"バーンアップ・チャート", def:"必要な機能を作り終えるための作業量と時間の2つの軸を使って進捗状況を視覚化する図。完了した作業量は「完了ストーリー・ポイント」と呼ばれる。" },
    { term:"バーンダウン・チャート", def:"必要な機能を作り終えるための作業量と時間の2つの軸を使って進捗状況を視覚化する図。残作業量は「残ストーリー・ポイント」と呼ばれる。" },
    { term:"バーン・チャート", def:"タイムボックス内の残りの作業、またはプロダクトやプロジェクトの成果物のリリースに向けて完了した作業を図示したもの。" },
  ],
};
const GLOSSARY_CATS = Object.keys(GLOSSARY_DATA);
const GL_ACCENT = "#5DB99A";

function genId() { return Math.random().toString(36).slice(2,9); }
function initGlossary() {
  const d={};
  GLOSSARY_CATS.forEach(cat=>{ d[cat]=GLOSSARY_DATA[cat].map(t=>({...t,id:genId()})); });
  return d;
}

function GlossaryView() {
  const [glossary, setGlossary] = useState(initGlossary);
  const [activeCategory, setActiveCategory] = useState(GLOSSARY_CATS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editBuf, setEditBuf] = useState({term:"",def:""});
  const [addingNew, setAddingNew] = useState(false);
  const [newBuf, setNewBuf] = useState({term:"",def:""});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.trim().toLowerCase();
  const totalCount = GLOSSARY_CATS.reduce((s,c)=>s+(glossary[c]?.length||0),0);

  const searchResults = useMemo(()=>{
    if(!isSearching) return [];
    const hits=[];
    GLOSSARY_CATS.forEach(cat=>{
      (glossary[cat]||[]).forEach(t=>{
        if(t.term.toLowerCase().includes(q)||t.def.toLowerCase().includes(q)) hits.push({...t,category:cat});
      });
    });
    return hits;
  },[glossary,q,isSearching]);

  function saveEdit(cat,id){
    if(!editBuf.term.trim()) return;
    setGlossary(g=>({...g,[cat]:g[cat].map(t=>t.id===id?{...t,...editBuf}:t)}));
    setEditingId(null);
  }
  function saveAdd(){
    if(!newBuf.term.trim()) return;
    setGlossary(g=>({...g,[activeCategory]:[...g[activeCategory],{...newBuf,id:genId()}]}));
    setAddingNew(false); setNewBuf({term:"",def:""});
  }
  function doDelete(){
    if(!deleteConfirm) return;
    setGlossary(g=>({...g,[deleteConfirm.cat]:g[deleteConfirm.cat].filter(t=>t.id!==deleteConfirm.id)}));
    setDeleteConfirm(null);
  }

  const currentTerms = isSearching?[]:(glossary[activeCategory]||[]);

  function TermRow({t,cat}){
    const isEditing=editingId===t.id;
    const rowBase={display:"grid",gridTemplateColumns:"200px 1fr 64px",alignItems:"start",gap:12,padding:"9px 0",borderBottom:`1px solid ${C.border}`};
    if(isEditing) return (
      <div style={{...rowBase,background:C.bg,padding:"9px 8px",borderRadius:6,marginBottom:4}}>
        <input value={editBuf.term} onChange={e=>setEditBuf(b=>({...b,term:e.target.value}))} autoFocus
          style={{padding:"5px 8px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bgCard,outline:"none",width:"100%"}}/>
        <textarea value={editBuf.def} onChange={e=>setEditBuf(b=>({...b,def:e.target.value}))} rows={3}
          style={{padding:"5px 8px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bgCard,outline:"none",resize:"vertical",width:"100%",fontFamily:"inherit",lineHeight:1.6}}/>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <button onClick={()=>saveEdit(cat,t.id)} style={{padding:"4px 10px",background:GL_ACCENT,color:"#fff",border:"none",borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer"}}>保存</button>
          <button onClick={()=>setEditingId(null)} style={{padding:"4px 8px",background:"none",color:C.textMid,border:`1px solid ${C.border}`,borderRadius:5,fontSize:11,cursor:"pointer"}}>取消</button>
        </div>
      </div>
    );
    return (
      <div style={rowBase}>
        <div style={{fontSize:14,fontWeight:600,color:C.text,lineHeight:1.5,paddingTop:1}}>{t.term}</div>
        <div style={{fontSize:13,color:C.textMid,lineHeight:1.7}}>{t.def}</div>
        <div style={{display:"flex",gap:6,justifyContent:"flex-end",paddingTop:2}}>
          <button onClick={()=>{setEditingId(t.id);setEditBuf({term:t.term,def:t.def});setAddingNew(false);}}
            style={{background:"none",border:"none",cursor:"pointer",color:C.textWeak,fontSize:13,padding:3}}>✎</button>
          <button onClick={()=>setDeleteConfirm({cat,id:t.id})}
            style={{background:"none",border:"none",cursor:"pointer",color:C.textWeak,fontSize:13,padding:3}}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{display:"flex",height:"100%",fontFamily:"'Noto Sans JP',sans-serif",background:C.bg,overflow:"hidden"}}>
      {/* サイドバー */}
      <div style={{width:200,minWidth:200,background:C.bgCard,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
        <div style={{padding:"14px 14px 10px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,fontWeight:700,color:C.textWeak,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'DM Mono',monospace"}}>Glossary</div>
          <div style={{fontSize:10,color:C.textWeak,marginTop:2}}>全{totalCount}語</div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
          {GLOSSARY_CATS.map((cat,i)=>(
            <div key={cat} onClick={()=>{setActiveCategory(cat);setSearchQuery("");setAddingNew(false);setEditingId(null);}}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 14px",cursor:"pointer",
                background:!isSearching&&activeCategory===cat?"#EAF8F3":"transparent",
                borderLeft:!isSearching&&activeCategory===cat?`3px solid ${GL_ACCENT}`:"3px solid transparent"}}>
              <span style={{fontSize:12,fontWeight:!isSearching&&activeCategory===cat?600:400,
                color:!isSearching&&activeCategory===cat?GL_ACCENT:C.textMid,
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:120}}>
                {i+1}. {cat}
              </span>
              <span style={{fontSize:10,color:!isSearching&&activeCategory===cat?GL_ACCENT:C.textWeak,
                background:!isSearching&&activeCategory===cat?"#5DB99A22":C.bg,
                borderRadius:8,padding:"1px 6px",fontWeight:500,flexShrink:0}}>
                {glossary[cat]?.length||0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* メイン */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* トップバー */}
        <div style={{padding:"12px 18px 10px",background:C.bgCard,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{position:"relative",flex:1,maxWidth:320}}>
            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.textWeak,fontSize:12,pointerEvents:"none"}}>🔍</span>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="用語を検索…"
              style={{width:"100%",padding:"6px 10px 6px 28px",border:`1px solid ${C.border}`,borderRadius:7,fontSize:12,color:C.text,background:C.bg,outline:"none",boxSizing:"border-box"}}/>
          </div>
          {!isSearching && (
            <button onClick={()=>{setAddingNew(true);setEditingId(null);}}
              style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",background:GL_ACCENT,color:"#fff",border:"none",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
              ＋ 用語を追加
            </button>
          )}
        </div>

        {/* コンテンツ */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 18px"}}>
          {isSearching ? (
            searchResults.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:C.textWeak,fontSize:13}}>「{searchQuery}」に一致する用語はありません</div>
            ) : (
              <>
                <div style={{fontSize:12,color:C.textMid,marginBottom:12}}>
                  <span style={{fontWeight:600,color:C.text}}>{searchResults.length}件</span>　の用語が見つかりました
                </div>
                {GLOSSARY_CATS.map(cat=>{
                  const hits=searchResults.filter(t=>t.category===cat);
                  if(hits.length===0) return null;
                  return (
                    <div key={cat}>
                      <div style={{fontSize:10,color:GL_ACCENT,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginTop:16,marginBottom:6}}>
                        ● {cat}（{hits.length}）
                      </div>
                      {hits.map(t=><TermRow key={t.id} t={t} cat={cat}/>)}
                    </div>
                  );
                })}
              </>
            )
          ) : (
            <>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:GL_ACCENT}}/>
                <div style={{fontSize:15,fontWeight:700,color:C.text}}>{activeCategory}</div>
                <div style={{fontSize:12,color:C.textWeak,marginLeft:"auto"}}>{currentTerms.length}語</div>
              </div>
              {addingNew && (
                <div style={{display:"grid",gridTemplateColumns:"200px 1fr 64px",alignItems:"start",gap:12,padding:"9px 8px",borderRadius:6,background:C.bg,marginBottom:8,border:`1px solid ${GL_ACCENT}40`}}>
                  <input value={newBuf.term} onChange={e=>setNewBuf(b=>({...b,term:e.target.value}))} autoFocus placeholder="用語を入力"
                    style={{padding:"5px 8px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bgCard,outline:"none",width:"100%"}}/>
                  <textarea value={newBuf.def} onChange={e=>setNewBuf(b=>({...b,def:e.target.value}))} rows={3} placeholder="意味を入力"
                    style={{padding:"5px 8px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12,color:C.text,background:C.bgCard,outline:"none",resize:"vertical",width:"100%",fontFamily:"inherit",lineHeight:1.6}}/>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    <button onClick={saveAdd} style={{padding:"4px 10px",background:GL_ACCENT,color:"#fff",border:"none",borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer"}}>追加</button>
                    <button onClick={()=>setAddingNew(false)} style={{padding:"4px 8px",background:"none",color:C.textMid,border:`1px solid ${C.border}`,borderRadius:5,fontSize:11,cursor:"pointer"}}>取消</button>
                  </div>
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"200px 1fr 64px",gap:12,padding:"6px 0",borderBottom:`2px solid ${C.border}`,marginBottom:2}}>
                <div style={{fontSize:10,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase"}}>用語</div>
                <div style={{fontSize:10,fontWeight:700,color:C.textWeak,letterSpacing:"0.06em",textTransform:"uppercase"}}>意味</div>
                <div/>
              </div>
              {currentTerms.length===0 ? (
                <div style={{textAlign:"center",padding:"40px 0",color:C.textWeak,fontSize:13}}>まだ用語がありません</div>
              ) : currentTerms.map(t=><TermRow key={t.id} t={t} cat={activeCategory}/>)}
            </>
          )}
        </div>
      </div>

      {/* 削除確認 */}
      {deleteConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(26,24,51,0.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
          <div style={{background:C.bgCard,borderRadius:12,padding:"22px 26px",width:340,boxShadow:"0 16px 48px rgba(83,74,183,0.15)"}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:8}}>用語を削除しますか？</div>
            <div style={{fontSize:12,color:C.textMid,marginBottom:18,lineHeight:1.6}}>
              「{glossary[deleteConfirm.cat]?.find(t=>t.id===deleteConfirm.id)?.term}」を削除します。この操作は元に戻せません。
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{padding:"6px 14px",background:"none",color:C.textMid,border:`1px solid ${C.border}`,borderRadius:6,fontSize:12,cursor:"pointer"}}>キャンセル</button>
              <button onClick={doDelete} style={{padding:"6px 14px",background:C.text,color:"#fff",border:"none",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Gantt View ──
const TASK_STATUS = {
  done:    { color: C.thing,    label: "完了",   bg: "#EAF8F3" },
  active:  { color: C.strong,   label: "進行中", bg: "#EEEDFB" },
  delay:   { color: C.critical, label: "遅延",   bg: "#F9EEF3" },
  pending: { color: C.textWeak, label: "未着手", bg: C.bg },
};

function GanttView({ project, onTaskSelect, selectedTaskId }) {
  const tasks = project.tasks || [];
  if (!tasks.length) return null;

  // 全タスクの期間からガント幅を計算
  const allDates = tasks.flatMap(t => [new Date(t.start), new Date(t.end)]);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  // 月単位のラベルを生成
  const months = [];
  const cur = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);
  while (cur < end) {
    months.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }
  const totalDays = (maxDate - minDate) / 86400000 + 1;
  const pct = (d) => Math.max(0, Math.min(100, (new Date(d) - minDate) / (totalDays * 86400000) * 100));
  const today = new Date();
  const todayPct = pct(today);

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 5px rgba(83,74,183,0.05)" }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.thing, marginRight: 8 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.thing, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>SCHEDULE VIEW</span>
        <span style={{ fontSize: 10, color: C.textWeak, marginLeft: 8 }}>タスクをクリックで詳細編集</span>
        <div style={{ flex: 1 }} />
        {/* 凡例 */}
        <div style={{ display: "flex", gap: 10 }}>
          {Object.entries(TASK_STATUS).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: C.textWeak }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: v.color }} />
              {v.label}
            </div>
          ))}
        </div>
      </div>

      {/* ガント本体 */}
      <div style={{ padding: "0 0 12px" }}>
        {/* 月ヘッダー */}
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ padding: "6px 12px", fontSize: 9, color: C.textWeak, borderRight: `1px solid ${C.border}` }}>タスク</div>
          <div style={{ position: "relative", height: 24 }}>
            {months.map((m, i) => {
              const leftPct = pct(m);
              return (
                <div key={i} style={{ position: "absolute", left: `${leftPct}%`, top: 0, height: "100%", borderLeft: `1px solid ${C.border}`, paddingLeft: 4, display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 8, color: C.textWeak, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
                    {m.getFullYear()}/{String(m.getMonth() + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* タスク行 */}
        {tasks.map((task, i) => {
          const st = TASK_STATUS[task.status] || TASK_STATUS.pending;
          const barLeft = pct(task.start);
          const barWidth = Math.max(0.5, pct(task.end) - barLeft);
          const isSelected = selectedTaskId === task.id;
          return (
            <div key={task.id} onClick={() => onTaskSelect(task)}
              style={{ display: "grid", gridTemplateColumns: "140px 1fr", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: isSelected ? C.bg : "transparent", transition: "background 0.1s" }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.bg; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
              {/* タスク名 */}
              <div style={{ padding: "6px 12px", borderRight: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: 1, background: st.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: isSelected ? C.text : C.textMid, fontWeight: isSelected ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.name}</span>
              </div>
              {/* バー */}
              <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
                {/* today線 */}
                {todayPct > 0 && todayPct < 100 && (
                  <div style={{ position: "absolute", left: `${todayPct}%`, top: 0, bottom: 0, width: 1, background: C.critical, opacity: 0.4, zIndex: 1 }} />
                )}
                {/* バー背景（予定） */}
                <div style={{ position: "absolute", left: `${barLeft}%`, width: `${barWidth}%`, height: 14, background: st.color + "22", borderRadius: 3, border: `1px solid ${st.color}44` }} />
                {/* バー前景（実績） */}
                <div style={{ position: "absolute", left: `${barLeft}%`, width: `${barWidth * task.progress / 100}%`, height: 14, background: st.color, borderRadius: 3, opacity: 0.85 }} />
                {/* 進捗% */}
                {task.progress > 0 && (
                  <div style={{ position: "absolute", left: `${barLeft + barWidth / 2}%`, transform: "translateX(-50%)", fontSize: 8, color: task.progress > 50 ? "#fff" : st.color, fontFamily: "'DM Mono', monospace", fontWeight: 700, zIndex: 2, pointerEvents: "none" }}>
                    {task.progress}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Gravity View（SVG直接描画）──
function GravityView({ project }) {
  const [activeTab, setActiveTab] = useState("gravity");
  const [selectedNode, setSelectedNode] = useState(null);
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const { nodes, edges, drift } = project.gravity;
  const gravNodes = project.gravity.nodes;
  const maxC = Math.max(...gravNodes.map(n => n.coupling));

  const nodeColor = (n) => {
    const r = n.coupling / maxC;
    if (r > 0.80) return { fill: "#534AB7", stroke: "#3C3489", text: "#EEEDFE" };
    if (r > 0.60) return { fill: "#7B74D4", stroke: "#534AB7", text: "#EEEDFE" };
    if (n.type === "S") return { fill: "#5DB99A", stroke: "#0F6E56", text: "#04342C" };
    return { fill: "#AFA9EC", stroke: "#534AB7", text: "#26215C" };
  };

  const edgeStyle = (w) => {
    if (w >= 4)   return { stroke: "#534AB7", width: w * 1.1, opacity: 0.72 };
    if (w >= 3)   return { stroke: "#7B74D4", width: w * 0.7, opacity: 0.62 };
    if (w >= 2)   return { stroke: "#AFA9EC", width: w * 0.5, opacity: 0.55 };
    return              { stroke: "#C8EDE3", width: 1.0,     opacity: 0.45 };
  };

  // Drift chartをCanvas2Dで描画
  useEffect(() => {
    if (activeTab !== "drift" || !canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    const { labels, plan, actual } = drift;

    // Dynamic import of Chart.js via window.Chart (loaded globally)
    const draw = () => {
      if (!window.Chart) { setTimeout(draw, 100); return; }
      chartRef.current = new window.Chart(canvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            { label: "予測", data: plan,   borderColor: "#534AB7", borderWidth: 2, borderDash: [5,3], pointRadius: 0, fill: false, tension: 0.3 },
            { label: "実績", data: actual, borderColor: "#5DB99A", borderWidth: 2, pointRadius: 3,    pointBackgroundColor: "#5DB99A", fill: "-1", backgroundColor: "rgba(175,169,236,0.22)", tension: 0.3 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { min: 0, max: 110, ticks: { font: { size: 10 }, callback: v => v + "%" }, grid: { color: "rgba(0,0,0,0.05)" } }
          }
        }
      });
    };
    draw();
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [activeTab, project]);

  const avgCoupling = (gravNodes.reduce((a, n) => a + n.coupling, 0) / gravNodes.length).toFixed(1);
  const highGravity = gravNodes.filter(n => n.coupling / maxC > 0.7).length;

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 5px rgba(83,74,183,0.05)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.strong }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.strong, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>GRAVITY VIEW</span>
          <span style={{ fontSize: 10, color: C.textWeak, marginLeft: 4 }}>依存構造とリスクの重力分布</span>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
          {["gravity", "drift"].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSelectedNode(null); }} style={{
              fontSize: 10, fontWeight: 600, padding: "4px 14px", border: "none",
              background: activeTab === tab ? C.strong : "transparent",
              color: activeTab === tab ? "#fff" : C.textWeak,
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {tab === "gravity" ? "Gravity" : "Drift"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "gravity" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

          {/* SVGグラフ */}
          <div style={{ padding: "14px 16px", borderRight: `1px solid ${C.border}` }}>
            {/* メトリクス */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "avg coupling", value: avgCoupling, color: C.strong },
                { label: "high-gravity", value: `${highGravity}ノード`, color: C.critical },
              ].map((m, i) => (
                <div key={i} style={{ background: C.bg, borderRadius: 6, padding: "7px 10px" }}>
                  <div style={{ fontSize: 9, color: C.textWeak, marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: m.color, fontFamily: "'DM Mono', monospace" }}>{m.value}</div>
                </div>
              ))}
            </div>

            <OntologyGraph />
          </div>

          {/* 右：ランキング + ノード詳細 */}
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", marginBottom: 10 }}>
              GRAVITY RANKING
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {[...gravNodes].sort((a, b) => b.coupling - a.coupling).map((n, i) => {
                const nc = nodeColor(n);
                const pct = Math.round((n.coupling / maxC) * 100);
                const isSelected = selectedNode?.id === n.id;
                return (
                  <div key={i} onClick={() => setSelectedNode(isSelected ? null : n)}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "3px 6px", borderRadius: 5, background: isSelected ? C.bg : "transparent", transition: "background 0.1s" }}>
                    <span style={{ fontSize: 10, color: C.textWeak, width: 80, textAlign: "right", flexShrink: 0 }}>{n.id}</span>
                    <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: nc.fill, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 10, color: nc.fill, fontFamily: "'DM Mono', monospace", width: 24, textAlign: "right", fontWeight: 700 }}>{n.coupling.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>

            {/* ノード詳細 */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 10, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", marginBottom: 8 }}>
                NODE DETAIL
              </div>
              {selectedNode ? (
                <div style={{ background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedNode.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: nodeColor(selectedNode).fill, fontFamily: "'DM Mono', monospace" }}>
                      {selectedNode.coupling.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { label: "Dependency Strength", value: selectedNode.depStr, max: 5 },
                      { label: "Change Probability",  value: selectedNode.changeProb, max: 100, suffix: "%" },
                      { label: "Communication Freq",  value: selectedNode.commFreq, max: 100 },
                    ].map((m, i) => {
                      const pct = Math.round((typeof m.suffix === "undefined" ? m.value / m.max * 100 : m.value));
                      const c = pct > 70 ? C.critical : pct > 45 ? C.strong : C.thing;
                      return (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 10, color: C.textWeak }}>{m.label}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: c, fontFamily: "'DM Mono', monospace" }}>
                              {m.value}{m.suffix || ""}
                            </span>
                          </div>
                          <Bar value={m.suffix ? m.value : m.value / m.max * 100} color={c} height={3} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: C.textWeak, padding: "10px 0" }}>
                  ノードまたはランキングをクリックしてください
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "drift" && (
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
            {[
              { label: "schedule drift", value: "−18日", color: C.critical },
              { label: "risk accumulation", value: "+4件", color: C.critical },
              { label: "velocity trend", value: "↓12%", color: C.strong },
              { label: "on-track prob.", value: "34%", color: C.human },
            ].map((m, i) => (
              <div key={i} style={{ background: C.bg, borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 9, color: C.textWeak, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: m.color, fontFamily: "'DM Mono', monospace" }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, color: C.textWeak, fontFamily: "'DM Mono', monospace", marginBottom: 8, letterSpacing: "0.06em" }}>
            予測 vs 実績のズレ — drift area
          </div>
          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <canvas ref={canvasRef} role="img" aria-label="予測と実績のズレを示すエリアチャート" />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[
              { color: "#534AB7", label: "予測", dash: true },
              { color: "#5DB99A", label: "実績", dash: false },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textWeak }}>
                <svg width={20} height={4}>
                  <line x1={0} y1={2} x2={20} y2={2} stroke={l.color} strokeWidth={2} strokeDasharray={l.dash ? "4 2" : "none"} strokeLinecap="round" />
                </svg>
                {l.label}
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textWeak }}>
              <div style={{ width: 12, height: 8, background: "#AFA9EC", opacity: 0.35, borderRadius: 2 }} />
              drift zone
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.border}`, background: C.bg, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.strong, boxShadow: `0 0 4px ${C.strong}` }} />
        <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>
          Semantic Space より生成　—　MDM Engine　·　Dependency Strength　·　Change Probability　·　Communication Frequency　·　Coupling Score
        </span>
      </div>
    </div>
  );
}

function ProjectListRow({ project, selected, onClick }) {
  const sc = scoreColor(project.score);
  const delta = project.trend.at(-1) - project.trend.at(-2);
  return (
    <div onClick={() => onClick(project)} style={{ padding: "10px 14px", background: selected ? C.bg : C.bgCard, borderLeft: `3px solid ${selected ? sc : "transparent"}`, borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.1s" }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = C.bg; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = C.bgCard; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>{project.code}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{project.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: sc, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{project.score}</div>
          <div style={{ fontSize: 9, color: delta >= 0 ? C.thing : C.critical, fontFamily: "'DM Mono', monospace" }}>{delta >= 0 ? "▲" : "▼"}{Math.abs(delta)}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Sparkline data={project.trend} color={sc} w={68} h={18} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {[{ l: "S", v: project.staticScore, c: C.thing }, { l: "D", v: project.dynamicScore, c: C.human }].map(ax => (
            <div key={ax.l} style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 8, color: ax.c, fontFamily: "'DM Mono', monospace", width: 10 }}>{ax.l}</span>
              <Bar value={ax.v} color={ax.c} height={3} />
              <span style={{ fontSize: 9, color: ax.c, fontFamily: "'DM Mono', monospace", width: 18, textAlign: "right" }}>{ax.v}</span>
            </div>
          ))}
        </div>
      </div>
      {project.alerts.some(a => a.level === "critical") && (
        <div style={{ marginTop: 5, fontSize: 9, color: C.critical, fontFamily: "'DM Mono', monospace" }}>
          ● {project.alerts.filter(a => a.level === "critical").length} critical
        </div>
      )}
    </div>
  );
}

// ── プロジェクト作成モーダル ──
const STATIC_FIELDS = [
  { key: "name",       label: "プロジェクト名",  placeholder: "例：基幹システム刷新 Phase3", required: true },
  { key: "due",        label: "完了期日",          placeholder: "例：2026-12-31",              required: true },
  { key: "scope",      label: "スコープ・目的",    placeholder: "例：在庫管理システムの全面刷新", required: true },
  { key: "assumption", label: "前提条件",           placeholder: "例：予算5000万、外部ベンダー利用可" },
  { key: "success",    label: "成功基準",           placeholder: "例：稼働率99.9%、移行期間3ヶ月以内" },
];
const DYNAMIC_FIELDS = [
  { key: "owner",        label: "PM / PMO",          placeholder: "例：田中 誠", required: true },
  { key: "stakeholders", label: "ステークホルダー",  placeholder: "例：CTO、IT部長、ベンダーA" },
  { key: "approver",     label: "承認者・意思決定者", placeholder: "例：IT部長（最終承認）" },
  { key: "team",         label: "チーム構成",         placeholder: "例：社内6名＋外部ベンダー8名" },
  { key: "risks",        label: "主要リスク・懸念",  placeholder: "例：ベンダー依存、要件変更リスク" },
];

function InputBox({ field, value, onChange, axis }) {
  const color = axis === "S" ? C.thing : C.human;
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>{axis}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>
          {field.label}{field.required && <span style={{ color: C.critical, marginLeft: 3 }}>*</span>}
        </span>
      </div>
      <textarea value={value} onChange={e => onChange(field.key, e.target.value)} placeholder={field.placeholder} rows={2}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ border: `1.5px solid ${focused ? color : C.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, color: C.text, background: focused ? (axis === "S" ? "#EAF8F3" : "#EEEDFB") : C.bgCard, outline: "none", resize: "none", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: 1.6, transition: "border-color 0.15s, background 0.15s" }} />
    </div>
  );
}

function CreateProjectModal({ visible, onClose, onCreated, nextCode }) {
  const [form, setForm] = useState({});
  const [fileStatus, setFileStatus] = useState(null);
  const [creating, setCreating] = useState(false);
  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const canProceed = form.name && form.due && form.scope && form.owner;

  const handleFile = async (file) => {
    setFileStatus("loading");
    try {
      const text = await file.text();
      const snippet = text.slice(0, 4000);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `プロジェクト情報を以下のJSON形式で抽出。見つからない項目は空文字。JSONのみ返す。{"name":"","due":"","scope":"","assumption":"","success":"","owner":"","stakeholders":"","approver":"","team":"","risks":""}`,
          messages: [{ role: "user", content: `以下のファイルからプロジェクト情報を抽出:\n\n${snippet}` }] }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setForm(prev => ({ ...prev, ...parsed }));
      setFileStatus("done");
    } catch { setFileStatus("error"); }
  };

  const handleCreate = async () => {
    setCreating(true);
    await new Promise(r => setTimeout(r, 500));
    const teamCount = parseInt((form.team || "").match(/\d+/)?.[0] || "5");
    const stakeList = (form.stakeholders || "").split(/[、,，]/).map(s => s.trim()).filter(Boolean);
    const daysLeft = Math.max(10, Math.floor((new Date(form.due) - new Date()) / 86400000));
    const newProject = {
      id: Date.now(), code: nextCode, name: form.name, owner: form.owner,
      due: form.due, daysLeft, progress: 0, team: teamCount || 5,
      score: 70, staticScore: 70, dynamicScore: 70, status: "healthy",
      trend: [70,70,70,70,70,70,70,70],
      static:  { schedule: 70, tasks: 70, risk: 70 },
      dynamic: { stakeholder: stakeList.length > 0 ? 75 : 60, team: 70, decision: 70 },
      alerts: [{ level: "info", axis: "S", text: "プロジェクト開始 — 初期定義フェーズ" }],
      events: [{ date: new Date().toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" }), type: "normal", text: "プロジェクト登録完了" }],
      glossary: [], stakeholders: [
        { name: form.owner, role: "PM", status: "active" },
        ...(form.approver ? [{ name: form.approver, role: "承認者", status: "active" }] : []),
        ...stakeList.slice(0, 3).map(s => ({ name: s, role: "ステークホルダー", status: "active" })),
      ],
      gravity: {
        nodes: [
          { id: "承認",    coupling: 3.0, depStr: 2.8, changeProb: 40, commFreq: 55, x: 150, y: 70,  r: 18, type: "D" },
          { id: "PM/PMO", coupling: 2.8, depStr: 2.5, changeProb: 35, commFreq: 65, x: 70,  y: 140, r: 16, type: "D" },
          { id: "スケジュール", coupling: 2.5, depStr: 2.2, changeProb: 40, commFreq: 45, x: 230, y: 140, r: 14, type: "S" },
          { id: "要件",   coupling: 2.2, depStr: 2.0, changeProb: 50, commFreq: 35, x: 150, y: 165, r: 13, type: "S" },
          { id: "WBS",    coupling: 1.8, depStr: 1.5, changeProb: 30, commFreq: 30, x: 95,  y: 210, r: 11, type: "S" },
        ],
        edges: [{ s:0,t:1,w:2.8 },{ s:0,t:2,w:2.2 },{ s:1,t:3,w:2.0 },{ s:2,t:4,w:1.8 },{ s:3,t:4,w:1.5 }],
        drift: { labels:["W1","W2","W3","W4","W5","W6","W7","W8"], plan:[100,87,74,61,48,35,22,9], actual:[100,87,74,61,48,35,22,9] },
      },
    };
    setCreating(false);
    onCreated(newProject);
    setForm({}); setFileStatus(null);
  };

  if (!visible) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(26,24,51,0.22)", zIndex: 200, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 680, maxHeight: "88vh", background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 16, boxShadow: "0 32px 80px rgba(83,74,183,0.20)", zIndex: 201, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.strong }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>新規プロジェクト作成</div>
            <div style={{ fontSize: 10, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>{nextCode}　— Semantic Space に登録</div>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textWeak, fontSize: 18 }}>×</button>
        </div>
        {/* Drop zone */}
        <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          style={{ margin: "12px 20px 0", padding: "12px 16px", border: `1.5px dashed ${fileStatus === "done" ? C.thing : C.mid}`, borderRadius: 10, background: fileStatus === "done" ? "#EAF8F3" : C.bg, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>{fileStatus === "loading" ? "⏳" : fileStatus === "done" ? "✅" : "📎"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: fileStatus === "done" ? C.thing : C.text }}>
              {fileStatus === "loading" ? "AIがファイルを解析中…" : fileStatus === "done" ? "読み込み完了 — フォームに自動入力されました" : "WBS・要件定義書・前提条件シートをここにドロップ"}
            </div>
            <div style={{ fontSize: 10, color: C.textWeak, marginTop: 2 }}>{fileStatus === null && "CSV・TXT・Markdown に対応"}</div>
          </div>
          <label style={{ fontSize: 11, color: C.strong, background: "#EEEDFB", border: `1px solid ${C.mid}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", flexShrink: 0 }}>
            ファイルを選択<input type="file" accept=".csv,.txt,.md" onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }} style={{ display: "none" }} />
          </label>
        </div>
        {/* Form */}
        <div style={{ flex: 1, overflow: "auto", padding: "14px 20px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${C.thing}` }}>
                <div style={{ width: 3, height: 14, background: C.thing, borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.thing, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>STATIC — 構造・計画</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {STATIC_FIELDS.map(f => <InputBox key={f.key} field={f} value={form[f.key] || ""} onChange={setField} axis="S" />)}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${C.human}` }}>
                <div style={{ width: 3, height: 14, background: C.human, borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.human, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>DYNAMIC — 人・関係性</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DYNAMIC_FIELDS.map(f => <InputBox key={f.key} field={f} value={form[f.key] || ""} onChange={setField} axis="D" />)}
              </div>
            </div>
          </div>
          <div style={{ height: 20 }} />
        </div>
        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg }}>
          <div style={{ fontSize: 10, color: C.textWeak }}><span style={{ color: C.critical }}>*</span> は必須項目</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ fontSize: 12, color: C.textMid, background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 18px", cursor: "pointer" }}>キャンセル</button>
            <button onClick={handleCreate} disabled={!canProceed || creating} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: canProceed && !creating ? C.strong : C.mid, border: "none", borderRadius: 8, padding: "8px 24px", cursor: canProceed && !creating ? "pointer" : "default", display: "flex", alignItems: "center", gap: 8 }}>
              {creating ? "登録中…" : "Semantic Space に登録"}
              {!creating && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function GhostSearch({ project, visible, onClose, onApplyData }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (visible && inputRef.current) setTimeout(() => inputRef.current?.focus(), 80);
    if (!visible) { setMessages([]); setQuery(""); setPendingAction(null); }
  }, [visible]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildContext = (p) => `あなたはPMO Intelligence「Metis」のAIアシスタントです。以下のプロジェクトデータを参照して日本語・マークダウンなしで答えてください。
${p.code} ${p.name} / スコア${p.score}(S:${p.staticScore} D:${p.dynamicScore}) / ${p.status} / PM:${p.owner} / 残${p.daysLeft}日 / 進捗${p.progress}%
Static: schedule${p.static.schedule} tasks${p.static.tasks} risk${p.static.risk}
Dynamic: stakeholder${p.dynamic.stakeholder} team${p.dynamic.team} decision${p.dynamic.decision}
アラート: ${p.alerts.map(a=>`[${a.level}][${a.axis}]${a.text}`).join(" / ")}
Gravity上位ノード: ${p.gravity.nodes.slice(0,3).map(n=>`${n.id}(coupling:${n.coupling})`).join(", ")}`;

  const parseCSV = (text) => {
    const lines = text.split("\n").map(l=>l.trim()).filter(Boolean);
    const header = lines[0].split(",").map(s=>s.trim().toLowerCase());
    return { header, rows: lines.slice(1).map(l=>{ const c=l.split(","); return Object.fromEntries(header.map((h,i)=>[[h],c[i]?.trim()||""])); }) };
  };

  const detectAndProcess = async (csvText, filename) => {
    const { header, rows } = parseCSV(csvText);
    const headerStr = header.join(",");
    setMessages(prev=>[...prev, { role:"file", text:`📎 ${filename}（${rows.length}行）` }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000,
          system:`あなたはCSVファイルの用途を判定するAIです。ヘッダー情報からファイルの種類を判定し、必ずJSONのみで返してください。
判定結果は以下のいずれか: "schedule"（WBS・ガントチャート・スケジュール）, "stakeholders"（体制図・組織図・役割一覧）, "unknown"（判定不能）
返すJSONの形式: {"type":"schedule","message":"WBS・スケジュールデータと判定しました。スケジュールビューに反映しますか？","confidence":"high"}`,
          messages:[{ role:"user", content:`CSVヘッダー: ${headerStr}
最初の3行: ${rows.slice(0,3).map(r=>Object.values(r).join(",")).join(" / ")}` }] }) });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/```json|```/g,"").trim();
      const result = JSON.parse(clean);

      setPendingAction({ type: result.type, csvText, header, rows, filename });
      setMessages(prev=>[...prev, { role:"assistant", text: result.message || "ファイルを読み込みました。" }]);

      if(result.type !== "unknown") {
        setMessages(prev=>[...prev, { role:"action", type: result.type, rows }]);
      }
    } catch(e) {
      setMessages(prev=>[...prev, { role:"assistant", text:"ファイルの解析中にエラーが発生しました。" }]);
    }
    setLoading(false);
  };

  const handleFile = (file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => detectAndProcess(e.target.result, file.name);
    reader.readAsText(file, "UTF-8");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if(file && (file.name.endsWith(".csv") || file.name.endsWith(".txt"))) handleFile(file);
    else setMessages(prev=>[...prev, { role:"assistant", text:"CSVファイルをドロップしてください。" }]);
  };

  const handleApply = (type, rows) => {
    onApplyData(type, rows);
    setMessages(prev=>[...prev, { role:"assistant", text: type==="schedule" ? "スケジュールビューに反映しました。ダッシュボードでご確認ください。" : "Stakeholdersタブに体制図を反映しました。" }]);
    setPendingAction(null);
  };

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const q = query; setMessages(prev => [...prev, { role:"user", text:q }]); setQuery(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system:buildContext(project),
          messages:[...messages.filter(m=>m.role==="user"||m.role==="assistant").map(m=>({ role:m.role==="user"?"user":"assistant", content:m.text })), { role:"user", content:q }] }) });
      const data = await res.json();
      setMessages(prev=>[...prev, { role:"assistant", text:data.content?.[0]?.text || "エラーが発生しました。" }]);
    } catch { setMessages(prev=>[...prev, { role:"assistant", text:"エラーが発生しました。" }]); }
    finally { setLoading(false); }
  };

  if (!visible) return null;
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(26,24,51,0.18)", zIndex:100, backdropFilter:"blur(1px)" }} />
      <div
        onDragOver={e=>{e.preventDefault();setIsDragOver(true);}}
        onDragLeave={()=>setIsDragOver(false)}
        onDrop={handleDrop}
        style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:520, maxHeight:"70vh", background: isDragOver?"rgba(83,74,183,0.06)":"rgba(247,247,251,0.97)", border:`1.5px solid ${isDragOver?C.strong:C.border}`, borderRadius:14, boxShadow:"0 24px 64px rgba(83,74,183,0.18)", zIndex:101, display:"flex", flexDirection:"column", overflow:"hidden", transition:"border-color 0.15s, background 0.15s" }}>

        {/* ヘッダー */}
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.strong, boxShadow:`0 0 6px ${C.strong}` }} />
          <span style={{ fontSize:11, fontWeight:700, color:C.strong, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>SEMANTIC GHOST</span>
          <span style={{ fontSize:10, color:C.textWeak, marginLeft:4 }}>{project.code} を参照中</span>
          <div style={{ flex:1 }} />
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textWeak, fontSize:18 }}>×</button>
        </div>

        {/* メッセージエリア */}
        <div style={{ flex:1, overflow:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:12, minHeight:120 }}>
          {messages.length === 0 && (
            <div style={{ textAlign:"center", paddingTop:16 }}>
              <div style={{ fontSize:11, color:C.textWeak, marginBottom:14 }}>Metis が状態を診断して回答します</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", marginBottom:14 }}>
                {["承認ノードのGravityが高い理由は？","最もリスクの高い依存関係は？","Drift Viewのズレの原因は何？","どこに介入すれば最も効果的？"].map(hint => (
                  <button key={hint} onClick={()=>setQuery(hint)} style={{ fontSize:11, color:C.strong, background:"#EEEDFB", border:`1px solid ${C.mid}`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>{hint}</button>
                ))}
              </div>
              {/* ドロップヒント */}
              <div style={{ fontSize:10, color:C.textWeak, borderTop:`1px dashed ${C.border}`, paddingTop:12, marginTop:4 }}>
                CSVファイルのドロップが可能です。
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            if(m.role==="file") return (
              <div key={i} style={{ display:"flex", justifyContent:"flex-end" }}>
                <div style={{ padding:"6px 12px", borderRadius:"10px 10px 2px 10px", background:C.strong, color:"#fff", fontSize:11 }}>{m.text}</div>
              </div>
            );
            if(m.role==="action") return (
              <div key={i} style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:11, color:C.text, flex:1 }}>
                  {m.type==="schedule" ? `${m.rows.length}件のタスクをスケジュールビューに反映します` : `${m.rows.length}件のロールをStakeholdersに反映します`}
                </span>
                <button onClick={()=>handleApply(m.type, m.rows)}
                  style={{ padding:"5px 14px", background:C.strong, color:"#fff", border:"none", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                  反映する
                </button>
                <button onClick={()=>setPendingAction(null)}
                  style={{ padding:"5px 10px", background:"none", color:C.textWeak, border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, cursor:"pointer" }}>
                  キャンセル
                </button>
              </div>
            );
            return (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"82%", padding:"8px 12px", borderRadius:m.role==="user"?"10px 10px 2px 10px":"10px 10px 10px 2px", background:m.role==="user"?C.strong:C.bgCard, color:m.role==="user"?"#fff":C.text, fontSize:12, lineHeight:1.65, border:m.role==="user"?"none":`1px solid ${C.border}` }}>{m.text}</div>
              </div>
            );
          })}
          {loading && <div style={{ display:"flex", gap:4, padding:"8px 12px" }}>{[0,1,2].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:C.mid, animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}</div>}
          <div ref={bottomRef} />
        </div>

        {/* 入力エリア */}
        <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:6 }}>
          {/* ドラッグオーバー時のハイライト */}
          {isDragOver && (
            <div style={{ textAlign:"center", fontSize:11, color:C.strong, fontWeight:600, padding:"4px 0" }}>ここにドロップ</div>
          )}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {/* ファイル選択ボタン */}
            <label style={{ flexShrink:0, width:32, height:32, borderRadius:7, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.textWeak, fontSize:14 }} title="CSVファイルを選択">
              📎
              <input type="file" accept=".csv,.txt" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
            </label>
            <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} }}
              placeholder="プロジェクトについて質問する…"
              style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", fontSize:12, color:C.text, background:C.bgCard, outline:"none", fontFamily:"'Noto Sans JP',sans-serif" }}
              onFocus={e=>e.target.style.borderColor=C.strong} onBlur={e=>e.target.style.borderColor=C.border}/>
            <button onClick={handleSend} disabled={!query.trim()||loading}
              style={{ width:34, height:34, borderRadius:8, border:"none", background:query.trim()&&!loading?C.strong:C.border, cursor:query.trim()&&!loading?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </>
  );
}


export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selected, setSelected] = useState(INITIAL_PROJECTS[0]);
  const [time, setTime]         = useState(new Date());
  const [ghostOpen, setGhostOpen]   = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState("Dashboard");
  const [alertOpen, setAlertOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null); // タスク詳細パネル用
  const [taskEditBuf, setTaskEditBuf] = useState(null);
  const [ghostApplyTarget, setGhostApplyTarget] = useState(null); // {type, rows}

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setGhostOpen(v => !v); }
      if (e.key === "Escape") { setGhostOpen(false); setCreateOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const nextCode = `PRJ-${String(projects.length + 1).padStart(3, "0")}`;
  const handleCreated = (newProject) => {
    setProjects(prev => [...prev, newProject]);
    setSelected(newProject);
    setCreateOpen(false);
  };

  const p = selected;
  const st = STATUS[p.status];
  const avgStatic  = Math.round(Object.values(p.static).reduce((a,v)=>a+v,0)/3);
  const avgDynamic = Math.round(Object.values(p.dynamic).reduce((a,v)=>a+v,0)/3);
  const portfolioAvg = Math.round(projects.reduce((a,pr)=>a+pr.score,0)/projects.length);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Noto Sans JP', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.mid}; border-radius: 2px; }
      `}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" />

      {/* NAV */}
      <div style={{ height: 48, background: C.bgCard, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 0, flexShrink: 0, boxShadow: "0 1px 4px rgba(83,74,183,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 24, borderRight: `1px solid ${C.border}`, marginRight: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
            M<span style={{ color: C.strong }}>e</span>tis
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: C.strong,
            background: C.blueLight || "#EEF0FD",
            border: `1px solid ${C.mid}`,
            borderRadius: 5,
            padding: "2px 7px",
            letterSpacing: "0.06em",
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1.4,
          }}>alpha</span>
        </div>
        {["Dashboard","Glossary","Stakeholders"].map(tab => (
          <div key={tab} onClick={()=>setActiveNavTab(tab)} style={{ padding: "0 16px", height: 48, display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: tab === activeNavTab ? C.strong : C.textWeak, borderBottom: tab === activeNavTab ? `2px solid ${C.strong}` : "2px solid transparent", cursor: "pointer" }}>{tab}</div>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setGhostOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 12px", background: C.bg, cursor: "pointer", color: C.textWeak, fontSize: 11, marginRight: 14, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.strong; e.currentTarget.style.color = C.strong; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textWeak; }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.4" /><path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          Semantic Ghost
          <span style={{ fontSize: 9, background: C.border, padding: "1px 5px", borderRadius: 3, fontFamily: "'DM Mono', monospace" }}>⌘K</span>
        </button>
        <div style={{ display: "flex", gap: 8, marginRight: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.thing, background: "#EAF8F3", padding: "3px 10px", borderRadius: 4 }}>◼ Static</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.human, background: "#EEEDFB", padding: "3px 10px", borderRadius: 4 }}>◆ Dynamic</span>
        </div>
        <div style={{ fontSize: 10, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>
          {time.toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
      </div>

      {/* PORTFOLIO */}
      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "8px 20px", display: "flex", gap: 0, flexShrink: 0 }}>
        {[
          { label: "ポートフォリオ平均", value: portfolioAvg, color: scoreColor(portfolioAvg) },
          { label: "要対応",   value: `${projects.filter(p=>p.status==="critical").length}件`, color: C.critical },
          { label: "注意",     value: `${projects.filter(p=>p.status==="warn").length}件`,     color: C.strong },
          { label: "健全",     value: `${projects.filter(p=>p.status==="healthy").length}件`,  color: C.thing },
          { label: "管理PJ数", value: `${projects.length}件`, color: C.textMid },
        ].map((stat, i) => (
          <div key={i} style={{ paddingRight: 24, marginRight: 24, borderRight: i < 4 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: 9, color: C.textWeak, marginBottom: 1 }}>{stat.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: stat.color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT — 全タブ共通プロジェクトリスト */}
        <div style={{ width: 240, minWidth: 240, borderRight: `1px solid ${C.border}`, overflow: "auto", background: C.bgCard, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "8px 14px 6px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>PROJECTS　{projects.length}</span>
            <button
              onClick={() => setCreateOpen(true)}
              style={{ fontSize: 10, fontWeight: 700, color: C.strong, background: "#EEEDFB", border: `1px solid ${C.mid}`, borderRadius: 5, padding: "3px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              onMouseEnter={e => e.currentTarget.style.background = C.mid}
              onMouseLeave={e => e.currentTarget.style.background = "#EEEDFB"}
            >
              <span style={{ fontSize: 13, lineHeight: 1 }}>+</span> 新規
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {projects.map(proj => <ProjectListRow key={proj.id} project={proj} selected={selected?.id === proj.id} onClick={setSelected} />)}
          </div>
        </div>

        {/* CENTER — タブ別コンテンツ */}
        {activeNavTab === "Glossary" ? (
          <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
            <GlossaryView />
          </div>
        ) : activeNavTab === "Stakeholders" ? (
          <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
            <StakeholderView />
          </div>
        ) : (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* CENTER（Dashboard） */}
        <div style={{ flex: 1, overflow: "auto", background: C.bg, position: "relative" }}>
          {!alertOpen && (
            <button onClick={() => setAlertOpen(true)} style={{ position: "sticky", top: 8, float: "right", marginRight: 8, zIndex: 10, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 9, color: C.textWeak, cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>ALERTS ▶</button>
          )}

          {/* Header Card */}
          <div style={{ margin: "14px 14px 0", background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, padding: "16px 20px", boxShadow: "0 1px 5px rgba(83,74,183,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
              <ScoreRing value={p.score} size={72} color={scoreColor(p.score)} sublabel="HEALTH" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>{p.code}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, padding: "1px 8px", borderRadius: 3 }}>{st.label}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10 }}>{p.name}</div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[{ label: "PM", value: p.owner },{ label: "期日", value: p.due },{ label: "残日数", value: `${p.daysLeft}日` },{ label: "チーム", value: `${p.team}名` }].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: 9, color: C.textWeak }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: C.textMid, fontFamily: "'DM Mono', monospace", marginTop: 1 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Sparkline data={p.trend} color={scoreColor(p.score)} w={96} h={38} />
                <div style={{ fontSize: 8, color: C.textWeak, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>8-PERIOD TREND</div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, color: C.textWeak }}>進捗</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(p.progress), fontFamily: "'DM Mono', monospace" }}>{p.progress}%</span>
              </div>
              <Bar value={p.progress} color={scoreColor(p.progress)} height={5} />
            </div>
          </div>

          {/* Static / Dynamic */}
          <div style={{ margin: "12px 14px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <AxisBlock axis="S" scores={p.static} items={[{ key: "schedule", label: "スケジュール" },{ key: "tasks", label: "タスク管理" },{ key: "risk", label: "リスク・課題" }]} />
            <AxisBlock axis="D" scores={p.dynamic} items={[{ key: "stakeholder", label: "ステークホルダー" },{ key: "team", label: "チーム健全性" },{ key: "decision", label: "意思決定" }]} />
          </div>



          {/* ── SCHEDULE VIEW ── */}
          <div style={{ margin: "12px 14px 0" }}>
            <GanttView project={p} onTaskSelect={(task) => { setSelectedTask(task); setTaskEditBuf({...task}); setAlertOpen(true); }} selectedTaskId={selectedTask?.id} />
          </div>

          {/* ── GRAVITY VIEW ── */}
          <div style={{ margin: "12px 14px 14px" }}>
            <GravityView project={p} />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ width: alertOpen ? 260 : 0, minWidth: alertOpen ? 260 : 0, overflow: "hidden", background: C.bgCard, borderLeft: alertOpen ? `1px solid ${C.border}` : "none", display: "flex", flexDirection: "column", transition: "width 0.22s ease, min-width 0.22s ease", flexShrink: 0 }}>
          {selectedTask && taskEditBuf ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", flex: 1 }}>TASK DETAIL</div>
                <button onClick={() => { setSelectedTask(null); setTaskEditBuf(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.textWeak, fontSize: 14 }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.textWeak, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>タスク名</div>
                  <input value={taskEditBuf.name} onChange={e => setTaskEditBuf(b => ({...b, name: e.target.value}))}
                    style={{ width: "100%", padding: "6px 9px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, color: C.text, background: C.bg, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.textWeak, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>担当者</div>
                  <input value={taskEditBuf.assignee} onChange={e => setTaskEditBuf(b => ({...b, assignee: e.target.value}))}
                    style={{ width: "100%", padding: "6px 9px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, color: C.text, background: C.bg, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.textWeak, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>開始日</div>
                    <input type="date" value={taskEditBuf.start} onChange={e => setTaskEditBuf(b => ({...b, start: e.target.value}))}
                      style={{ width: "100%", padding: "6px 4px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 10, color: C.text, background: C.bg, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.textWeak, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>終了日</div>
                    <input type="date" value={taskEditBuf.end} onChange={e => setTaskEditBuf(b => ({...b, end: e.target.value}))}
                      style={{ width: "100%", padding: "6px 4px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 10, color: C.text, background: C.bg, outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.textWeak, letterSpacing: "0.06em", textTransform: "uppercase" }}>進捗</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(taskEditBuf.progress), fontFamily: "'DM Mono', monospace" }}>{taskEditBuf.progress}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={taskEditBuf.progress} onChange={e => setTaskEditBuf(b => ({...b, progress: Number(e.target.value)}))}
                    style={{ width: "100%", accentColor: C.strong }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.textWeak, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>ステータス</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.entries(TASK_STATUS).map(([k, v]) => (
                      <button key={k} onClick={() => setTaskEditBuf(b => ({...b, status: k}))}
                        style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 5, border: `1px solid ${taskEditBuf.status === k ? v.color : C.border}`, background: taskEditBuf.status === k ? v.color : "transparent", color: taskEditBuf.status === k ? "#fff" : C.textMid, cursor: "pointer" }}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
                <button onClick={() => {
                  setProjects(ps => ps.map(proj => proj.id === p.id ? { ...proj, tasks: proj.tasks.map(t => t.id === taskEditBuf.id ? taskEditBuf : t) } : proj));
                  setSelected(s => ({ ...s, tasks: s.tasks.map(t => t.id === taskEditBuf.id ? taskEditBuf : t) }));
                  setSelectedTask(taskEditBuf);
                }} style={{ width: "100%", padding: "8px 0", background: C.strong, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>ACTIVE ALERTS</span>
                  <button onClick={() => setAlertOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.textWeak, fontSize: 14, lineHeight: 1, padding: "0 2px" }}>✕</button>
                  {p.alerts.filter(a => a.level === "critical").length > 0 && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.critical, background: "#F9EEF3", border: `1px solid #DDB8CA`, padding: "1px 6px", borderRadius: 3, fontFamily: "'DM Mono', monospace" }}>
                      {p.alerts.filter(a => a.level === "critical").length} critical
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {p.alerts.map((a, i) => {
                    const bc = a.level === "critical" ? C.critical : a.level === "warn" ? C.strong : C.mid;
                    const tc = a.level === "critical" ? C.critical : a.level === "warn" ? C.strong : C.textMid;
                    const ax = AXIS[a.axis];
                    return (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 10px", background: C.bg, borderLeft: `3px solid ${bc}`, borderRadius: "0 6px 6px 0" }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: ax.color, background: ax.bg, padding: "1px 5px", borderRadius: 2, flexShrink: 0, fontFamily: "'DM Mono', monospace", marginTop: 1 }}>{ax.label}</span>
                        <span style={{ fontSize: 11, color: tc, lineHeight: 1.5 }}>{a.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ padding: "12px 14px", flex: 1, overflowY: "auto" }}>
                <div style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 10 }}>RECENT EVENTS</div>
                {p.events.map((e, i) => {
                  const dc = e.type === "critical" ? C.critical : e.type === "warn" ? C.strong : C.mid;
                  const tc = e.type === "critical" ? C.critical : e.type === "warn" ? C.strong : C.textMid;
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, paddingBottom: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: dc, flexShrink: 0, marginTop: 4 }} />
                        {i < p.events.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, minHeight: 10 }} />}
                      </div>
                      <div>
                        <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>{e.date}　</span>
                        <span style={{ fontSize: 11, color: tc, lineHeight: 1.5 }}>{e.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0, background: C.bg }}>
                <div style={{ fontSize: 8, color: C.textWeak, marginBottom: 6, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>SEMANTIC SPACE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {["Glossary","ステークHマップ","リスク課題","イベント"].map(item => (
                    <span key={item} style={{ fontSize: 9, color: C.textMid, background: C.bgCard, border: `1px solid ${C.border}`, padding: "2px 8px", borderRadius: 4, cursor: "pointer" }}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
        )
        }
      </div>

      {/* STATUS BAR */}
      <div style={{ height: 24, background: C.bgCard, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {projects.map(proj => <div key={proj.id} style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS[proj.status].color }} />)}
        </div>
        <span style={{ fontSize: 8, color: C.border }}>|</span>
        <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>Semantic Space　Active</span>
        <span style={{ fontSize: 8, color: C.border }}>|</span>
        <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>Ghost + Gravity　Ready</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace", cursor: "pointer" }} onClick={() => setGhostOpen(true)}>⌘K　Semantic Ghost</span>
        <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace" }}>Metis　alpha　v0.2.0</span>
      </div>

      <GhostSearch project={selected} visible={ghostOpen} onClose={() => setGhostOpen(false)} onApplyData={(type, rows) => { setGhostApplyTarget({ type, rows }); if(type === "stakeholders") setActiveNavTab("Stakeholders"); }} />
      <CreateProjectModal visible={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} nextCode={nextCode} />
    </div>
  );
}
