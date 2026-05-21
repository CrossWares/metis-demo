import { useState, useEffect, useRef } from "react";

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
        { id: "承認",      coupling: 5.0, depStr: 4.8, changeProb: 72, commFreq: 88, x: 150, y: 70,  r: 28, type: "D" },
        { id: "PM/PMO",   coupling: 4.6, depStr: 4.5, changeProb: 55, commFreq: 95, x: 58,  y: 145, r: 24, type: "D" },
        { id: "スケジュール", coupling: 4.2, depStr: 4.0, changeProb: 60, commFreq: 70, x: 242, y: 145, r: 21, type: "S" },
        { id: "前提条件",  coupling: 3.5, depStr: 3.8, changeProb: 48, commFreq: 52, x: 98,  y: 215, r: 17, type: "S" },
        { id: "リスク",   coupling: 3.2, depStr: 3.0, changeProb: 65, commFreq: 60, x: 202, y: 215, r: 16, type: "S" },
        { id: "WBS",      coupling: 2.8, depStr: 2.5, changeProb: 40, commFreq: 45, x: 52,  y: 50,  r: 14, type: "S" },
        { id: "SHマップ",  coupling: 2.4, depStr: 2.2, changeProb: 35, commFreq: 38, x: 258, y: 50,  r: 12, type: "D" },
        { id: "要件",     coupling: 2.0, depStr: 2.0, changeProb: 50, commFreq: 30, x: 150, y: 172, r: 11, type: "S" },
      ],
      edges: [
        { s: 0, t: 1, w: 4.8 }, { s: 0, t: 2, w: 4.0 }, { s: 0, t: 4, w: 3.2 },
        { s: 1, t: 3, w: 3.8 }, { s: 1, t: 5, w: 2.5 }, { s: 1, t: 7, w: 2.0 },
        { s: 2, t: 4, w: 3.0 }, { s: 2, t: 6, w: 2.2 }, { s: 3, t: 7, w: 2.0 },
        { s: 5, t: 7, w: 1.8 },
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
        { id: "承認",     coupling: 3.8, depStr: 3.5, changeProb: 45, commFreq: 60, x: 150, y: 70,  r: 22, type: "D" },
        { id: "PM/PMO",  coupling: 3.5, depStr: 3.2, changeProb: 40, commFreq: 75, x: 65,  y: 145, r: 20, type: "D" },
        { id: "スケジュール",coupling: 3.2, depStr: 3.0, changeProb: 50, commFreq: 55, x: 235, y: 145, r: 18, type: "S" },
        { id: "要件",    coupling: 2.8, depStr: 2.5, changeProb: 60, commFreq: 40, x: 150, y: 165, r: 15, type: "S" },
        { id: "API連携", coupling: 2.5, depStr: 2.8, changeProb: 70, commFreq: 35, x: 95,  y: 210, r: 14, type: "S" },
        { id: "WBS",     coupling: 2.2, depStr: 2.0, changeProb: 35, commFreq: 40, x: 205, y: 210, r: 13, type: "S" },
        { id: "SHマップ", coupling: 1.8, depStr: 1.5, changeProb: 30, commFreq: 30, x: 258, y: 55,  r: 11, type: "D" },
      ],
      edges: [
        { s: 0, t: 1, w: 3.5 }, { s: 0, t: 2, w: 3.0 },
        { s: 1, t: 4, w: 2.8 }, { s: 1, t: 3, w: 2.5 },
        { s: 2, t: 5, w: 2.0 }, { s: 3, t: 4, w: 2.2 },
        { s: 2, t: 6, w: 1.5 },
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
        { id: "承認",    coupling: 2.8, depStr: 2.5, changeProb: 25, commFreq: 50, x: 150, y: 70,  r: 18, type: "D" },
        { id: "PM/PMO", coupling: 2.5, depStr: 2.2, changeProb: 20, commFreq: 60, x: 70,  y: 140, r: 16, type: "D" },
        { id: "UAT",    coupling: 2.2, depStr: 2.0, changeProb: 30, commFreq: 45, x: 230, y: 140, r: 14, type: "S" },
        { id: "要件",   coupling: 1.8, depStr: 1.5, changeProb: 20, commFreq: 30, x: 150, y: 165, r: 12, type: "S" },
        { id: "WBS",    coupling: 1.5, depStr: 1.2, changeProb: 15, commFreq: 25, x: 95,  y: 205, r: 10, type: "S" },
        { id: "SHマップ",coupling: 1.2, depStr: 1.0, changeProb: 10, commFreq: 20, x: 205, y: 205, r: 9,  type: "D" },
      ],
      edges: [
        { s: 0, t: 1, w: 2.5 }, { s: 0, t: 2, w: 2.0 },
        { s: 1, t: 4, w: 1.5 }, { s: 2, t: 3, w: 1.8 },
        { s: 3, t: 4, w: 1.2 }, { s: 0, t: 5, w: 1.0 },
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

// ── Gravity View（SVG直接描画）──
function GravityView({ project }) {
  const [activeTab, setActiveTab] = useState("gravity");
  const [selectedNode, setSelectedNode] = useState(null);
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const { nodes, edges, drift } = project.gravity;
  const maxC = Math.max(...nodes.map(n => n.coupling));

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

  const avgCoupling = (nodes.reduce((a, n) => a + n.coupling, 0) / nodes.length).toFixed(1);
  const highGravity = nodes.filter(n => n.coupling / maxC > 0.7).length;

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

            <svg width="100%" viewBox="0 0 300 250" style={{ display: "block" }}>
              {edges.map((e, i) => {
                const a = nodes[e.s], b = nodes[e.t], es = edgeStyle(e.w);
                return (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={es.stroke} strokeWidth={es.width} strokeOpacity={es.opacity} strokeLinecap="round" />
                );
              })}
              {nodes.map((n, i) => {
                const nc = nodeColor(n);
                const isSelected = selectedNode?.id === n.id;
                return (
                  <g key={i} style={{ cursor: "pointer" }} onClick={() => setSelectedNode(isSelected ? null : n)}>
                    {isSelected && (
                      <circle cx={n.x} cy={n.y} r={n.r + 5}
                        fill="none" stroke={C.strong} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
                    )}
                    <circle cx={n.x} cy={n.y} r={n.r}
                      fill={nc.fill} stroke={nc.stroke} strokeWidth={1.8} opacity={0.93} />
                    <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={nc.text} fontSize={Math.max(8, Math.min(11, n.r * 0.52))}
                      fontFamily="sans-serif" fontWeight="500">
                      {n.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* 凡例 */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              {[
                { label: "強い依存", el: <svg width={28} height={6}><line x1={0} y1={3} x2={28} y2={3} stroke="#534AB7" strokeWidth={4} strokeLinecap="round" /></svg> },
                { label: "弱い依存", el: <svg width={28} height={6}><line x1={0} y1={3} x2={28} y2={3} stroke="#AFA9EC" strokeWidth={1.5} strokeLinecap="round" /></svg> },
                { label: "高 Gravity", el: <svg width={12} height={12}><circle cx={6} cy={6} r={5} fill="#534AB7" /></svg> },
                { label: "低 Gravity", el: <svg width={12} height={12}><circle cx={6} cy={6} r={5} fill="#5DB99A" /></svg> },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.textWeak }}>
                  {l.el}{l.label}
                </div>
              ))}
            </div>
          </div>

          {/* 右：ランキング + ノード詳細 */}
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", marginBottom: 10 }}>
              GRAVITY RANKING
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {[...nodes].sort((a, b) => b.coupling - a.coupling).map((n, i) => {
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

function GhostSearch({ project, visible, onClose }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  useEffect(() => {
    if (visible && inputRef.current) setTimeout(() => inputRef.current?.focus(), 80);
    if (!visible) { setMessages([]); setQuery(""); }
  }, [visible]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const buildContext = (p) => `あなたはPMOIntelligence「PMOSemantic」の検索AIです。以下のデータを参照して日本語・マークダウンなしで答えてください。
${p.code} ${p.name} / スコア${p.score}(S:${p.staticScore} D:${p.dynamicScore}) / ${p.status} / PM:${p.owner} / 残${p.daysLeft}日 / 進捗${p.progress}%
Static: schedule${p.static.schedule} tasks${p.static.tasks} risk${p.static.risk}
Dynamic: stakeholder${p.dynamic.stakeholder} team${p.dynamic.team} decision${p.dynamic.decision}
アラート: ${p.alerts.map(a=>`[${a.level}][${a.axis}]${a.text}`).join(" / ")}
Gravity上位ノード: ${p.gravity.nodes.slice(0,3).map(n=>`${n.id}(coupling:${n.coupling})`).join(", ")}`;
  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const q = query; setMessages(prev => [...prev, { role: "user", text: q }]); setQuery(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: buildContext(project),
          messages: [...messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })), { role: "user", content: q }] }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.content?.[0]?.text || "エラーが発生しました。" }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", text: "エラーが発生しました。" }]); }
    finally { setLoading(false); }
  };
  if (!visible) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(26,24,51,0.18)", zIndex: 100, backdropFilter: "blur(1px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 520, maxHeight: "70vh", background: "rgba(247,247,251,0.97)", border: `1.5px solid ${C.border}`, borderRadius: 14, boxShadow: "0 24px 64px rgba(83,74,183,0.18)", zIndex: 101, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.strong, boxShadow: `0 0 6px ${C.strong}` }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.strong, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>SEMANTIC GHOST</span>
          <span style={{ fontSize: 10, color: C.textWeak, marginLeft: 4 }}>{project.code} + Gravity を参照中</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textWeak, fontSize: 18 }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 120 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 20 }}>
              <div style={{ fontSize: 11, color: C.textWeak, marginBottom: 14 }}>Semantic Space + Gravity に問い合わせできます</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {["承認ノードのGravityが高い理由は？","最もリスクの高い依存関係は？","Drift Viewのズレの原因は何？","どこに介入すれば最も効果的？"].map(hint => (
                  <button key={hint} onClick={() => setQuery(hint)} style={{ fontSize: 11, color: C.strong, background: "#EEEDFB", border: `1px solid ${C.mid}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>{hint}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "82%", padding: "8px 12px", borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px", background: m.role === "user" ? C.strong : C.bgCard, color: m.role === "user" ? "#fff" : C.text, fontSize: 12, lineHeight: 1.65, border: m.role === "user" ? "none" : `1px solid ${C.border}` }}>{m.text}</div>
            </div>
          ))}
          {loading && <div style={{ display: "flex", gap: 4, padding: "8px 12px" }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.mid, animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}</div>}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center" }}>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Gravity・Semantic Spaceに質問する…" style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.text, background: C.bgCard, outline: "none", fontFamily: "'Noto Sans JP', sans-serif" }} onFocus={e => e.target.style.borderColor = C.strong} onBlur={e => e.target.style.borderColor = C.border} />
          <button onClick={handleSend} disabled={!query.trim() || loading} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: query.trim() && !loading ? C.strong : C.border, cursor: query.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
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
        {["Dashboard","Glossary","Risk","Stakeholders"].map(tab => (
          <div key={tab} style={{ padding: "0 16px", height: 48, display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: tab === "Dashboard" ? C.strong : C.textWeak, borderBottom: tab === "Dashboard" ? `2px solid ${C.strong}` : "2px solid transparent", cursor: "pointer" }}>{tab}</div>
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
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "240px 1fr 260px", overflow: "hidden" }}>

        {/* LEFT */}
        <div style={{ borderRight: `1px solid ${C.border}`, overflow: "auto", background: C.bgCard, display: "flex", flexDirection: "column" }}>
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

        {/* CENTER */}
        <div style={{ overflow: "auto", background: C.bg }}>

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

          {/* Axis Summary */}
          <div style={{ margin: "12px 14px 0", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 5px rgba(83,74,183,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ScoreRing value={avgStatic} size={46} color={scoreColor(avgStatic)} />
              <div>
                <div style={{ fontSize: 9, color: C.thing, fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>◼ STATIC</div>
                <div style={{ fontSize: 10, color: C.textMid }}>構造・計画</div>
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: C.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ScoreRing value={avgDynamic} size={46} color={scoreColor(avgDynamic)} />
              <div>
                <div style={{ fontSize: 9, color: C.human, fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>◆ DYNAMIC</div>
                <div style={{ fontSize: 10, color: C.textMid }}>人・関係性</div>
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: C.border }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: C.textWeak, marginBottom: 6 }}>二軸の乖離</div>
              <div style={{ display: "flex", height: 6, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ flex: avgStatic, background: C.thing }} />
                <div style={{ flex: avgDynamic, background: C.human }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 9, color: C.thing, fontFamily: "'DM Mono', monospace" }}>{avgStatic}</span>
                <span style={{ fontSize: 9, color: C.textWeak }}>差 {Math.abs(avgStatic - avgDynamic)}</span>
                <span style={{ fontSize: 9, color: C.human, fontFamily: "'DM Mono', monospace" }}>{avgDynamic}</span>
              </div>
            </div>
          </div>

          {/* ── GRAVITY VIEW（赤枠の位置）── */}
          <div style={{ margin: "12px 14px 14px" }}>
            <GravityView project={p} />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ borderLeft: `1px solid ${C.border}`, overflow: "auto", background: C.bgCard, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: C.textWeak, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>ACTIVE ALERTS</span>
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
          <div style={{ padding: "12px 14px", flex: 1 }}>
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

      <GhostSearch project={selected} visible={ghostOpen} onClose={() => setGhostOpen(false)} />
      <CreateProjectModal visible={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} nextCode={nextCode} />
    </div>
  );
}
