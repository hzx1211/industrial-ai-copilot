import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

const documents = [
  { id: "SOP-042", name: "注塑机换模作业指导书", type: "SOP", chunks: 186, updated: "今天 09:42", status: "已索引" },
  { id: "QA-118", name: "注塑件外观缺陷判定标准", type: "质检", chunks: 248, updated: "昨天 16:18", status: "已索引" },
  { id: "EQP-027", name: "IMM-680 设备维护手册", type: "设备", chunks: 392, updated: "06 月 05 日", status: "已索引" },
  { id: "FAQ-009", name: "一线工单高频问题与处理建议", type: "工单", chunks: 124, updated: "06 月 04 日", status: "已索引" }
];

const answers = [
  {
    match: ["换模", "模具", "注塑"],
    answer: "建议先执行停机断电与残料清理，再按「吊装确认 → 定位锁模 → 水路/油路连接 → 低速试模」顺序操作。当前知识库要求首件确认后才可以恢复量产。",
    sources: ["SOP-042 / 注塑机换模作业指导书", "QA-118 / 首件确认标准"]
  },
  {
    match: ["温度", "过热", "报警"],
    answer: "先确认报警代码与加热区实际温度是否一致，再检查热电偶接线和风扇滤网。若温差持续超过 8℃，应暂停升温并转交设备工程师处理。",
    sources: ["EQP-027 / IMM-680 设备维护手册", "FAQ-009 / 温控报警处理"]
  },
  {
    match: ["缺陷", "毛边", "缩水", "质检"],
    answer: "可以先按缺陷类型定位：毛边优先检查锁模力与分型面，缩水优先检查保压时间与模温。建议拍照留档，并将首件、末件分别纳入批次记录。",
    sources: ["QA-118 / 注塑件外观缺陷判定标准", "FAQ-009 / 一线工单高频问题"]
  }
];

function json(res, payload, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function contentType(path) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".json": "application/json; charset=utf-8"
  };
  return types[extname(path)] || "application/octet-stream";
}

async function serveStatic(req, res, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const candidate = normalize(join(root, requested));
  if (!candidate.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(candidate);
    res.writeHead(200, { "Content-Type": contentType(candidate), "Cache-Control": "no-cache" });
    res.end(body);
  } catch {
    if (!extname(candidate)) {
      const body = await readFile(join(root, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
      res.end(body);
      return;
    }
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));

  if (url.pathname === "/api/health") {
    json(res, { ok: true, service: "industrial-ai-copilot", mode: "mock" });
    return;
  }

  if (url.pathname === "/api/documents") {
    json(res, { items: documents });
    return;
  }

  if (url.pathname === "/api/ask" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let question = "";
      try {
        question = JSON.parse(body).question || "";
      } catch {
        json(res, { error: "请求格式不正确" }, 400);
        return;
      }
      const lower = question.toLowerCase();
      const matched = answers.find((item) => item.match.some((keyword) => lower.includes(keyword))) || {
        answer: "我已经完成知识库检索，但没有找到足够确定的作业依据。建议补充设备型号、工序和现场现象，我会继续缩小检索范围。",
        sources: ["FAQ-009 / 一线工单高频问题与处理建议"]
      };
      setTimeout(() => {
        json(res, {
          answer: matched.answer,
          sources: matched.sources,
          trace: ["问题改写", "向量召回 8 条", "重排保留 3 条", "安全规则检查", "生成结构化回答"],
          latency: "1.6s"
        });
      }, 260);
    });
    return;
  }

  await serveStatic(req, res, url.pathname);
});

server.listen(port, () => {
  console.log("智造智库 running at http://localhost:" + port);
});
