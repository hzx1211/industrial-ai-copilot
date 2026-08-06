# 智造智库 · Industrial AI Copilot

面向珠三角制造业场景的 AI 应用作品集项目，围绕 RAG + Agent + Evaluation 设计，模拟把 SOP、设备手册、质检标准和工单知识接入一个可追溯的现场助手。

## 当前能力

- 工作台：展示知识库规模、回答质量、响应速度和 Agent 运行状态
- AI 助手：支持中文设备、工艺、质检问题问答，返回来源文档和检索链路
- 知识库：展示文档、类型、chunks、索引状态和切片策略
- 评测中心：展示准确率、引用命中率、幻觉率、P95 延迟和样本复核建议
- 系统设置：展示模型、Embedding、Reranker 与工程化技术栈
- 本地 mock API：/api/health、/api/documents、/api/ask

## 本地运行

    npm run dev

浏览器打开 http://localhost:4173。

当前版本使用 Node 原生 HTTP 服务和 mock 数据，不需要安装第三方依赖。接入真实模型时，可以把 /api/ask 替换为 Python/FastAPI 服务，并将模型密钥放到本地环境变量中。

## 面试可讲的技术链路

    文档上传 → 解析与清洗 → 512 tokens 切片 → bge-m3 Embedding
    → Chroma/FAISS 向量检索 → Rerank → Agent 工具调用 → 引用式回答
    → 测试集评测 → 日志反馈 → 继续优化切片和 Prompt

推荐的下一步真实化路线：

1. 使用 Python + FastAPI 拆出知识库和问答服务
2. 接入 Qwen/DeepSeek API，并为每个回答保存 trace
3. 使用 Chroma 或 Milvus 保存向量，补充文档上传任务
4. 增加 30～50 条真实测试样本，比较无 RAG、基础 RAG 和 Rerank RAG
5. 面向东莞/顺德制造业岗位增加 YOLO 缺陷检测或 XGBoost 设备异常预测模块
