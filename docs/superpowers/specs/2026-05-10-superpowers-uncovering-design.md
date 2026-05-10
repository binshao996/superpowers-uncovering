# Superpowers Uncovering — 交互式学习平台设计文档

## 目标

构建一个交互式 Web 应用，拆解 superpowers skill 系统，帮助有经验的 Claude Code 用户**通俗易懂地、从 0 到 1 快速掌握 skill 的封装思想**。

**核心价值**：既见森林（13 个 skill 全局关系），又见树木（writing-skills 方法论深入）。

## 受众

有经验的 Claude Code 用户，日常使用 CC，想深入理解 skill 封装，能自己写 skill。

## 交互形态：全流程图谱 · 中心辐射

主界面是一张完整的交互式技能关系图谱（13 个 skill 节点 + 连线），点击节点展开侧边详情面板。图谱支持拖拽、缩放、筛选。

### 四种交互模式

| 模式 | 触发 | 行为 |
|------|------|------|
| 自由探索 | 默认 | 拖拽/缩放图谱，点击节点看详情 |
| 导游路径 | 顶部按钮 | 预设路径动画推进，可随时退出 |
| 分组筛选 | 顶部 tab | 只显示选中分组，淡化其余 |
| 深度阅读 | 面板"阅读全文" | 全屏 Markdown 文章 |

### 导游路径

- **快速概览**：沿过程管控链浏览 6 个核心 skill
- **深入方法论**：聚焦 writing-skills + TDD 体系

## 技能分类与关系

### 四大分组（颜色标识）

- **过程管控（蓝）**：brainstorming → writing-plans → executing-plans → subagent-driven-development → requesting-code-review → finishing-a-development-branch
- **纪律保障（绿）**：test-driven-development, verification-before-completion, systematic-debugging
- **协作支撑（黄）**：receiving-code-review, dispatching-parallel-agents, using-git-worktrees
- **元技能（紫）**：using-superpowers, writing-skills

### 三种连线关系

| 关系 | 符号 | 含义 |
|------|------|------|
| 顺序依赖 | → 实线箭头 | A 流程结束后调用 B |
| 横切嵌入 | ↗ 虚线段 | A 在 B 的流程中被引用/要求 |
| 理念引用 | ⇢ 点线 | A 的设计思想被 B 继承 |

## 内容设计

### 两层深度

- **L1 侧边面板**（200-300 字）：触发词、一句话概述、解决什么痛点、前置/后置 skill、skill 类型
- **L2 深度文章**（全屏 Markdown）：痛点分析 → 核心工作流 → 关键设计决策（为什么这样设计）→ 防理性化机制 → 协作关系 → 原始 SKILL.md 精读

### writing-skills 专项（额外 4 章）

1. 什么是 Skill？— 定义、类型、适用边界
2. CSO 搜索优化 — description 写法、关键词覆盖、命名规范
3. TDD 方法论：RED → GREEN → REFACTOR — 压测场景、基线行为、防理性化闭环
4. 防理性化设计 — 漏洞关闭、红牌表、铁律、说服心理学

## 技术架构

### 技术栈

- React 18 + Vite
- cytoscape.js（图谱渲染与交互）
- Tailwind CSS（样式）
- react-markdown + remark-gfm（L2 文章渲染）
- React Router（路由）
- Vite 静态导出 → GitHub Pages / Vercel 部署

### 组件树

```
App
├── GraphView          （图谱主视图）
│   ├── GraphToolbar    （搜索框 · 分组筛选 · 导游按钮）
│   ├── SkillGraph      （cytoscape.js 画布）
│   └── SidePanel       （L1 节点详情 · 滑出面板）
│       └── FullArticle （L2 全屏文章 · Markdown 渲染）
├── GuideTour           （导游模式 overlay）
└── DeepDive            （writing-skills 4 章专项页）
```

### 数据流（纯静态，零服务端）

| 数据层 | 格式 | 内容 |
|--------|------|------|
| 图谱结构 + L1 内容 | `skills-graph.json` | 13 节点 + 连线 + L1 字段 |
| L2 深度文章 | `content/<skill-name>.md` | 每篇 Markdown，13 篇 |
| 导游路径 | `tour-paths.json` | 路径数组 |
| 专项文章 | `content/writing-skills/*.md` | 4 章 |

### 路由

- `/` — 图谱主页
- `/article/:skill` — L2 深度文章
- `/deep-dive` — writing-skills 专项

### 图谱样式

- 节点颜色：4 种对应 4 个分组
- 刚性 skill：实线边框；柔性 skill：虚线边框
- 连线：实线箭头（顺序依赖）、虚线段（横切嵌入）、点线（理念引用）
- 响应式：桌面端图谱+侧面板并排；移动端面板全屏覆盖

## 目录结构

```
src/
  components/
    GraphView.tsx
    SkillGraph.tsx
    SidePanel.tsx
    FullArticle.tsx
    GraphToolbar.tsx
    GuideTour.tsx
    DeepDive.tsx
  data/
    skills-graph.json
    tour-paths.json
  content/
    brainstorming.md
    writing-plans.md
    executing-plans.md
    subagent-driven-development.md
    requesting-code-review.md
    finishing-a-development-branch.md
    test-driven-development.md
    verification-before-completion.md
    systematic-debugging.md
    receiving-code-review.md
    dispatching-parallel-agents.md
    using-git-worktrees.md
    using-superpowers.md
    writing-skills.md
    writing-skills/
      overview.md
      cso.md
      tdd-methodology.md
      anti-rationalization.md
  App.tsx
  main.tsx
public/
  favicon.svg
```

## 分阶段实施

### P1 · 骨架（可交互的完整图谱站点）

- Vite + React 项目初始化
- cytoscape.js 集成，图谱渲染（13 节点 + 连线）
- GraphToolbar（搜索、筛选）
- SidePanel 滑出面板（L1 内容）
- FullArticle 全屏文章视图
- skills-graph.json 完整数据（图谱 + 全部 L1 内容）
- L2 文章 Markdown 文件（内容先占位，后续填充）
- React Router 路由

### P2 · 血肉（完整学习体验）

- GuideTour 导游模式（动画路径）
- 13 篇 L2 深度文章完整内容
- writing-skills 4 章专项页
- DeepDive 组件
- 移动端响应式适配
- 视觉打磨（动画、过渡效果）

## 非目标（明确不做）

- 后端服务 / CMS / 数据库 — 纯静态站点
- 用户系统 / 进度追踪 / 评论 — 一期不做
- 视频 / 音频内容
- 多语言
- 移动端原生 App
