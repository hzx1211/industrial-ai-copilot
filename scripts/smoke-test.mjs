const baseUrl = process.env.BASE_URL || "http://localhost:4173";

async function get(path) {
  const response = await fetch(baseUrl + path);
  if (!response.ok) throw new Error(path + " returned " + response.status);
  return response.json();
}

const health = await get("/api/health");
if (!health.ok || health.service !== "industrial-ai-copilot") {
  throw new Error("health payload is invalid");
}

const docs = await get("/api/documents");
if (!Array.isArray(docs.items) || docs.items.length < 4) {
  throw new Error("documents payload is incomplete");
}

const askResponse = await fetch(baseUrl + "/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "温控报警应该怎样排查？" })
});
if (!askResponse.ok) throw new Error("/api/ask returned " + askResponse.status);
const answer = await askResponse.json();
if (!answer.answer || !Array.isArray(answer.sources) || !Array.isArray(answer.trace)) {
  throw new Error("ask payload is incomplete");
}

console.log("smoke test passed: health, documents, ask");
