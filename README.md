# Superpowers Uncovering

> 交互式学习平台 — 拆解 [superpowers](https://github.com/binshao996/superpowers) skill 系统，帮助你从 0 到 1 快速掌握 skill 封装思想。

**[开始学习 →](https://binshao996.github.io/superpowers-uncovering/)**

---

## 核心架构

```
App
├── GraphView           （图谱主视图）
│   ├── GraphToolbar     （搜索框 · 分组筛选 · 导游按钮）
│   ├── SkillGraph       （cytoscape.js 技能关系图谱）
│   └── SidePanel        （L1 节点速览 · 滑出面板）
│       └── FullArticle  （L2 深度文章 · Markdown 渲染）
├── GuideTour            （导游模式 overlay）
└── DeepDive             （writing-skills 4 章专项）
```

### 四大技能分组（14 个 skill 节点）

| 分组 | 颜色 | Skills |
|------|------|--------|
| 过程管控 | 蓝 | brainstorming → writing-plans → executing-plans → subagent-driven-development → requesting-code-review → finishing-a-development-branch |
| 纪律保障 | 绿 | test-driven-development, verification-before-completion, systematic-debugging |
| 协作支撑 | 黄 | receiving-code-review, dispatching-parallel-agents, using-git-worktrees |
| 元技能 | 紫 | using-superpowers, writing-skills |

### 三种连线关系

| 关系 | 样式 | 含义 |
|------|------|------|
| 顺序依赖 → | 实线箭头 | A 流程结束后调用 B |
| 横切嵌入 ↗ | 虚线段 | A 在 B 的流程中被引用/要求 |
| 理念引用 ⇢ | 点线 | A 的设计思想被 B 继承 |

---

## 阅读流程

### 新手路径（15 分钟）

1. 打开图谱，点击 **using-superpowers** 节点 → 浏览 L1 面板
2. 点击「阅读全文」阅读 L2 深度文章
3. 返回图谱，点击「快速概览」导游路径 — 沿过程管控链浏览 6 个核心 skill
4. 逐个阅读过程管控链上每个 skill 的 L2 文章

### 进阶路径（30 分钟）

5. 进入纪律保障分组（绿），理解整个体系的约束层
6. 点击 **writing-skills** → 「深入方法论（4章专项）」进入专项页
7. 按顺序阅读 4 章：什么是 Skill → CSO 搜索优化 → TDD 方法论 → 防理性化设计
8. 返回图谱，点击「深入方法论」导游路径，理解 TDD + writing-skills 体系
9. 最后阅读协作支撑分组（黄），理解团队协作机制

### 速查（5 分钟）

- 图谱搜索框输入关键词 → 直接找到目标 skill
- 分组筛选按钮（过程管控/纪律保障/协作支撑/元技能）缩小范围
- 点击节点 → L1 面板 200 字速览（触发条件、核心功能、解决的痛点）

---

## 技术栈

React 18 + Vite + cytoscape.js + Tailwind CSS + react-markdown + React Router v6 · 纯静态站点，零服务端

## 开发

```bash
npm install
npm run dev       # 启动开发服务器 localhost:5173
npm run build     # 生产构建到 dist/
```

## 部署

- **GitHub Pages**: `https://binshao996.github.io/superpowers-uncovering/`
- 构建输出 `dist/` 可直接部署到任何静态托管服务（Vercel, Netlify, Cloudflare Pages）
