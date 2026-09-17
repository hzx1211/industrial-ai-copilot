const state = {
  activeView: "dashboard",
  messages: [
    {
      role: "assistant",
      text: "早上好，我是智造智库。可以从设备手册、SOP 和质检标准里帮你找答案。",
      sources: []
    },
    {
      role: "user",
      text: "注塑机换模后，首件确认前需要检查哪些项目？",
      sources: []
    },
    {
      role: "assistant",
      text: "建议按「安全状态 → 模具定位 → 水路/油路 → 低速试模 → 首件尺寸」顺序检查。首件确认前，先留存首件照片和关键尺寸记录。",
      sources: ["SOP-042 / 换模作业指导书", "QA-118 / 首件确认标准"]
    }
  ]
};

const documents = [
  { id: "SOP-042", name: "注塑机换模作业指导书", type: "SOP", chunks: 186, updated: "今天 09:42", status: "已索引" },
  { id: "QA-118", name: "注塑件外观缺陷判定标准", type: "质检", chunks: 248, updated: "昨天 16:18", status: "已索引" },
  { id: "EQP-027", name: "IMM-680 设备维护手册", type: "设备", chunks: 392, updated: "06 月 05 日", status: "已索引" },
  { id: "FAQ-009", name: "一线工单高频问题与处理建议", type: "工单", chunks: 124, updated: "06 月 04 日", status: "已索引" }
];

const icons = {
  grid: "<rect x='3' y='3' width='7' height='7' rx='1.5'/><rect x='14' y='3' width='7' height='7' rx='1.5'/><rect x='3' y='14' width='7' height='7' rx='1.5'/><rect x='14' y='14' width='7' height='7' rx='1.5'/>",
  spark: "<path d='m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z'/><path d='m19 16 .7 1.8L21.5 18l-1.8.7L19 20.5l-.7-1.8-1.8-.7 1.8-.7L19 16Z'/>",
  book: "<path d='M4 5.8A2.8 2.8 0 0 1 6.8 3H20v16H6.8A2.8 2.8 0 0 0 4 21V5.8Z'/><path d='M4 5.8V21'/><path d='M8 7h8M8 11h7'/>",
  chart: "<path d='M4 19V5M4 19h17'/><path d='m7 15 3-4 3 2 5-7'/>",
  settings: "<path d='M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z'/><path d='m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3.1 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3.1-1.3l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1A1.8 1.8 0 0 0 3.3 12a1.8 1.8 0 0 1 0-3.6h.2A1.8 1.8 0 0 0 4.8 5.3l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1A1.8 1.8 0 0 0 10.4 1.5h.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3.1 1.3l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 1.3 3.1h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.2 2.8Z'/>",
  search: "<circle cx='10.8' cy='10.8' r='6.8'/><path d='m16 16 5 5'/>",
  arrow: "<path d='M5 12h14M13 6l6 6-6 6'/>",
  bell: "<path d='M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4'/>",
  send: "<path d='m21 3-7.2 18-3.1-7.7L3 10.2 21 3Z'/><path d='M10.7 13.3 21 3'/>",
  bot: "<rect x='4' y='7' width='16' height='13' rx='3'/><path d='M12 3v4M8 13h.01M16 13h.01M8 17h8'/>",
  file: "<path d='M6 3h8l4 4v14H6z'/><path d='M14 3v5h5M9 13h6M9 17h6'/>",
  check: "<path d='m5 12 4 4L19 6'/>",
  clock: "<circle cx='12' cy='12' r='8.5'/><path d='M12 7v5l3 2'/>",
  upload: "<path d='M12 16V4M8 8l4-4 4 4'/><path d='M5 14v5h14v-5'/>",
  chevron: "<path d='m9 18 6-6-6-6'/>"
};

function icon(name, size = 18) {
  return "<svg width='" + size + "' height='" + size + "' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>" + icons[name] + "</svg>";
}

function navItem(view, label, iconName, badge = "") {
  return "<button class='nav-link " + (state.activeView === view ? "active" : "") + "' data-view='" + view + "'>" +
    icon(iconName, 16) + "<span class='nav-text'>" + label + "</span>" +
    (badge ? "<span class='nav-badge'>" + badge + "</span>" : "") + "</button>";
}

function layout() {
  return "<div class='app-shell'>" +
    "<aside class='sidebar'>" +
      "<div class='brand'><div class='brand-mark'>" + icon("spark", 19) + "</div><div class='brand-name'>智造智库<small>industrial ai copilot</small></div></div>" +
      "<div class='nav-label'>WORKSPACE</div>" +
      "<nav class='nav-list'>" +
        navItem("dashboard", "工作台", "grid") +
        navItem("assistant", "AI 助手", "spark", "BETA") +
        navItem("knowledge", "知识库", "book", "4") +
        navItem("evaluation", "评测中心", "chart") +
        navItem("settings", "系统设置", "settings") +
      "</nav>" +
      "<div class='sidebar-spacer'></div>" +
      "<div class='system-card'><div class='system-head'><span>AI 服务状态</span><span class='online-dot'></span></div><p class='system-copy'>Qwen-Plus · 检索服务 · 评测服务均在线</p></div>" +
      "<div class='profile'><div class='avatar'>林</div><div><strong>林同学</strong><span>AI 应用开发实习生</span></div></div>" +
    "</aside>" +
    "<main class='main-shell'>" +
      "<header class='topbar'><div class='crumb'>项目空间&nbsp; / &nbsp;<b>" + ({ dashboard: "工作台", assistant: "AI 助手", knowledge: "知识库", evaluation: "评测中心", settings: "系统设置" }[state.activeView]) + "</b></div><div class='topbar-actions'><div class='status-pill'><span class='online-dot'></span>服务正常 · 09:48</div><button class='icon-button' aria-label='通知'>" + icon("bell", 16) + "</button></div></header>" +
      "<section class='content' id='content'></section>" +
    "</main>" +
  "</div>";
}

function metric(label, value, change, iconName, neutral = false) {
  return "<article class='metric-card'><div class='metric-top'><span>" + label + "</span><span class='metric-icon'>" + icon(iconName, 14) + "</span></div><div class='metric-value'>" + value + "</div><div class='metric-change " + (neutral ? "neutral" : "") + "'>" + change + "</div></article>";
}

function sourceChips(sources) {
  if (!sources || !sources.length) return "";
  return "<div class='source-chips'>" + sources.map((source) => "<span class='source-chip'>" + source + "</span>").join("") + "</div>";
}

function messageRow(message) {
  return "<div class='message-row " + message.role + "'><div class='message-avatar'>" + icon(message.role === "assistant" ? "bot" : "spark", 14) + "</div><div class='message-bubble'>" + message.text + sourceChips(message.sources) + "</div></div>";
}

function assistantPanel(compact = false) {
  const messages = compact ? state.messages.slice(-3) : state.messages;
  return "<section class='panel assistant-preview " + (compact ? "" : "full-assistant") + "'>" +
    "<div class='panel-heading'><div><h2>现场 AI 助手</h2><p>RAG 检索增强 · Agent 工具调用 · 可追溯回答</p></div><span class='mono'>qwen-plus / online</span></div>" +
    "<div class='assistant-window'>" + messages.map(messageRow).join("") + "</div>" +
    "<form class='prompt-row' data-chat-form><input name='question' autocomplete='off' placeholder='输入设备、工艺或质检问题…' /><button class='send-button' aria-label='发送'>" + icon("send", 16) + "</button></form>" +
    "<div class='quick-row'><button class='quick-chip' data-question='换模后首件确认要检查什么？'>换模检查清单</button><button class='quick-chip' data-question='温控报警应该怎样排查？'>温控报警排查</button><button class='quick-chip' data-question='毛边缺陷如何判断？'>缺陷判定建议</button></div>" +
  "</section>";
}

function tracePanel() {
  const steps = [
    ["01", "问题改写", "识别设备、工序与风险词"],
    ["02", "知识召回", "SOP / 质检 / 设备手册"],
    ["03", "Agent 决策", "检查是否需要调用工单工具"],
    ["04", "回答生成", "引用来源并输出下一步动作"]
  ];
  return "<section class='panel trace-panel'><div class='panel-heading'><div><h2>RAG 链路追踪</h2><p>回答不是黑盒，每一步都可解释</p></div><span class='mono'>TRACE 00482</span></div><div class='trace-flow'>" +
    steps.map((step, index) => "<div class='trace-step " + (index === 3 ? "active" : "") + "'><div class='trace-number'>" + step[0] + "</div><div><strong>" + step[1] + "</strong><span>" + step[2] + "</span></div></div>" + (index < steps.length - 1 ? "<div class='trace-line'></div>" : "")).join("") +
    "</div><div style='margin-top:20px;display:flex;justify-content:space-between;align-items:center'><span style='font-size:10px;color:var(--muted)'>本次回答置信度</span><strong style='font-size:22px;letter-spacing:-.06em'>93.8%</strong></div><div style='height:5px;margin-top:9px;border-radius:99px;background:#edf2ef;overflow:hidden'><div style='width:93.8%;height:100%;border-radius:99px;background:linear-gradient(90deg,#64bca7,#ff9b7a)'></div></div></section>";
}

function documentsPreview() {
  return "<section class='panel'><div class='panel-heading'><div><h2>知识库动态</h2><p>最近更新的现场资料</p></div><button class='button button-ghost' data-view='knowledge'>查看全部 " + icon("chevron", 13) + "</button></div><div class='doc-list'>" +
    documents.slice(0, 3).map((doc) => "<div class='doc-item'><div class='doc-icon'>" + icon("file", 15) + "</div><div class='doc-info'><strong>" + doc.name + "</strong><span>" + doc.type + " · " + doc.chunks + " chunks · " + doc.updated + "</span></div><span class='doc-status'>" + doc.status + "</span></div>").join("") +
    "</div></section>";
}

function dashboardView() {
  return "<div class='page-intro'><div><div class='eyebrow'>AI OPERATIONS / 06.08</div><h1>让设备知识，变成现场能执行的答案。</h1><p>一个面向珠三角制造业场景的 AI 工作台：把 SOP、设备手册和质检标准接入 RAG，让每一次问答都有依据、可复盘、能落地。</p></div><div class='hero-actions'><button class='button button-primary' data-view='assistant'>开始提问 " + icon("arrow", 14) + "</button><button class='button button-ghost' data-view='knowledge'>管理知识库</button></div></div>" +
    "<div class='metric-grid'>" +
      metric("知识库 chunks", "12,480", "↑ 8.4% 本周新增", "book") +
      metric("回答准确率", "93.6%", "↑ 2.8% 对比上周", "check") +
      metric("平均响应", "1.8s", "↓ 0.4s 检索优化", "clock") +
      metric("活跃 Agent", "06", "3 个正在运行", "spark", true) +
    "</div>" +
    "<div class='workspace-grid'>" + assistantPanel(true) + tracePanel() + "</div>" +
    "<div class='quality-strip'><section class='panel'><div class='panel-heading'><div><h2>回答质量趋势</h2><p>最近 7 天 · 离线评测集 #QA-2026-06</p></div><span class='mono'>+2.8%</span></div><div class='quality-chart'><span class='bar' style='height:48%'></span><span class='bar' style='height:61%'></span><span class='bar' style='height:58%'></span><span class='bar hot' style='height:74%'></span><span class='bar' style='height:68%'></span><span class='bar' style='height:83%'></span><span class='bar hot' style='height:94%'></span></div><div class='chart-foot'><span>06.02</span><span>06.08</span></div></section>" + documentsPreview() + "</div>";
}

function assistantView() {
  return "<div class='subpage-heading'><div><div class='eyebrow'>CONVERSATION / RAG + AGENT</div><h1>AI 助手</h1><p>围绕设备、工艺和质检问题，给出有来源的下一步动作。</p></div><div class='hero-actions'><button class='button button-ghost' data-action='clear-chat'>清空会话</button></div></div><div class='workspace-grid'>" + assistantPanel(false) + tracePanel() + "</div>";
}

function knowledgeView() {
  return "<div class='subpage-heading'><div><div class='eyebrow'>KNOWLEDGE / INDEXED SOURCES</div><h1>知识库</h1><p>文档解析、切片、索引状态一目了然。</p></div><button class='button button-accent' data-action='upload'>" + icon("upload", 14) + "上传资料</button></div>" +
    "<section class='panel'><div style='display:flex;gap:10px;align-items:center;margin-bottom:18px'><div style='position:relative;flex:1'><span style='position:absolute;left:12px;top:11px;color:var(--muted)'>" + icon("search", 15) + "</span><input class='search-input' style='padding-left:36px' id='doc-search' placeholder='搜索文档名称、编号或类型…' /></div><button class='button button-ghost' data-action='filter-docs'>全部类型</button></div><div class='doc-table'><div class='table-head'><span>文档</span><span>类型</span><span>chunks</span><span>更新时间</span><span>状态</span></div><div id='doc-rows'>" + documents.map((doc) => "<div class='table-row'><div class='doc-cell'><div class='doc-icon'>" + icon("file", 15) + "</div><div><strong>" + doc.name + "</strong><span>" + doc.id + "</span></div></div><span class='type-tag'>" + doc.type + "</span><span class='mono'>" + doc.chunks + "</span><span class='muted-cell'>" + doc.updated + "</span><span class='doc-status'>" + icon("check", 12) + " " + doc.status + "</span></div>").join("") + "</div></div></section>" +
    "<div class='quality-strip' style='margin-top:16px'><section class='panel'><div class='panel-heading'><div><h2>索引策略</h2><p>当前知识库使用的检索配置</p></div><span class='mono'>v0.4</span></div><div class='strategy-list'><div><strong>切片</strong><span>512 tokens · overlap 64</span></div><div><strong>Embedding</strong><span>bge-m3 · 中文优化</span></div><div><strong>召回</strong><span>向量 Top 8 → Rerank Top 3</span></div></div></section><section class='panel'><div class='panel-heading'><div><h2>数据闭环</h2><p>把现场反馈变成下一次优化</p></div></div><div class='loop-row'><span>问答日志</span><b>→</b><span>人工标注</span><b>→</b><span>评测集</span><b>→</b><span>切片优化</span></div><button class='button button-ghost' style='margin-top:22px' data-view='evaluation'>查看评测中心 " + icon("arrow", 13) + "</button></section></div>";
}

function evaluationView() {
  const rows = [
    ["QA-001", "换模后首件确认", "SOP-042", "通过", "96%"],
    ["QA-014", "温控报警排查", "EQP-027", "通过", "91%"],
    ["QA-026", "毛边缺陷判断", "QA-118", "需复核", "82%"],
    ["QA-031", "异常工单查询", "FAQ-009", "通过", "94%"]
  ];
  return "<div class='subpage-heading'><div><div class='eyebrow'>EVALUATION / QUALITY LOOP</div><h1>评测中心</h1><p>用可量化的指标，把大模型效果从感觉变成证据。</p></div><button class='button button-primary' data-action='run-eval'>" + icon("spark", 14) + "运行一轮评测</button></div>" +
    "<div class='metric-grid'>" + metric("总体准确率", "93.6%", "基于 240 条测试样本", "check") + metric("引用命中率", "96.2%", "↑ 4.1% 检索优化", "book") + metric("幻觉率", "2.4%", "↓ 1.3% 安全规则", "spark") + metric("P95 延迟", "2.6s", "目标 < 3.0s", "clock", true) + "</div>" +
    "<section class='panel'><div class='panel-heading'><div><h2>最近一次评测样本</h2><p>离线集 QA-2026-06 · 运行于今天 09:36</p></div><span class='mono'>240 CASES</span></div><div class='eval-table'><div class='table-head'><span>编号</span><span>问题</span><span>命中文档</span><span>结果</span><span>置信度</span></div>" +
    rows.map((row) => "<div class='table-row'><span class='mono'>" + row[0] + "</span><strong>" + row[1] + "</strong><span class='mono'>" + row[2] + "</span><span class='result-tag " + (row[3] === "需复核" ? "review" : "") + "'>" + row[3] + "</span><span class='confidence'>" + row[4] + "</span></div>").join("") +
    "</div></section><section class='panel eval-note'><div class='metric-icon'>" + icon("spark", 16) + "</div><div><strong>下一步建议</strong><p>QA-026 的“毛边”样本置信度偏低，建议补充缺陷照片与锁模力字段，再重新切片和评测。</p></div></section>";
}

function settingsView() {
  return "<div class='subpage-heading'><div><div class='eyebrow'>SYSTEM / PROJECT CONFIG</div><h1>系统设置</h1><p>作品集演示环境配置。敏感密钥仅保留在本地环境变量中。</p></div></div>" +
    "<div class='settings-grid'><section class='panel'><div class='panel-heading'><div><h2>模型连接</h2><p>用于演示的模型供应商</p></div><span class='status-tag'>已连接</span></div><div class='setting-row'><div><strong>Qwen-Plus</strong><span>DashScope compatible API</span></div><code>qwen-plus</code></div><div class='setting-row'><div><strong>Embedding</strong><span>中文知识库向量模型</span></div><code>bge-m3</code></div><div class='setting-row'><div><strong>Reranker</strong><span>检索结果重排序</span></div><code>bge-reranker-v2</code></div></section><section class='panel'><div class='panel-heading'><div><h2>工程环境</h2><p>本项目在面试中可以这样讲</p></div><span class='status-tag'>LOCAL</span></div><div class='stack-tags'><span>Python / FastAPI</span><span>LangChain</span><span>Chroma</span><span>Docker</span><span>Git</span><span>SQL</span></div><div class='architecture-note'><span class='eyebrow'>PROJECT STORY</span><p>从资料入库到答案评测，打通一条可解释、可部署、可迭代的 AI 应用链路。</p></div></section></div>";
}

function renderView() {
  const content = document.getElementById("content");
  if (!content) return;
  const views = { dashboard: dashboardView, assistant: assistantView, knowledge: knowledgeView, evaluation: evaluationView, settings: settingsView };
  content.innerHTML = views[state.activeView]();
  if (state.activeView === "knowledge") bindDocumentSearch();
}

function toast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2600);
}

async function ask(question) {
  const clean = (question || "").trim();
  if (!clean) return;
  state.messages.push({ role: "user", text: clean, sources: [] });
  renderView();
  const input = document.querySelector("[data-chat-form] input");
  if (input) input.focus();
  try {
    const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: clean }) });
    const data = await response.json();
    state.messages.push({ role: "assistant", text: data.answer, sources: data.sources });
  } catch {
    state.messages.push({ role: "assistant", text: "演示服务暂时不可用，请确认本地服务已启动。", sources: [] });
  }
  renderView();
}

function bindDocumentSearch() {
  const input = document.getElementById("doc-search");
  const rows = document.getElementById("doc-rows");
  if (!input || !rows) return;
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    rows.querySelectorAll(".table-row").forEach((row) => {
      row.hidden = query && !row.textContent.toLowerCase().includes(query);
    });
  });
}

document.getElementById("app").addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    state.activeView = viewButton.dataset.view;
    document.getElementById("app").innerHTML = layout();
    renderView();
    return;
  }
  const questionButton = event.target.closest("[data-question]");
  if (questionButton) {
    ask(questionButton.dataset.question);
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  if (actionButton.dataset.action === "clear-chat") {
    state.messages = [{ role: "assistant", text: "会话已清空。告诉我你想排查的设备、工艺或质检问题吧。", sources: [] }];
    renderView();
  }
  if (actionButton.dataset.action === "upload") toast("演示模式：资料上传入口已准备好，下一步接入解析与向量化任务。");
  if (actionButton.dataset.action === "filter-docs") toast("当前展示全部类型，后续可按 SOP、质检、设备和工单筛选。");
  if (actionButton.dataset.action === "run-eval") toast("评测任务已创建：240 条样本将在后台执行。");
});

document.getElementById("app").addEventListener("submit", (event) => {
  if (!event.target.matches("[data-chat-form]")) return;
  event.preventDefault();
  ask(new FormData(event.target).get("question"));
});

document.getElementById("app").innerHTML = layout();
renderView();
