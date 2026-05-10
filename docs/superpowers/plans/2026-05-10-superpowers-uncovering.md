# Superpowers Uncovering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive knowledge-graph web app that dissects the superpowers skill system, helping experienced Claude Code users master skill encapsulation philosophy.

**Architecture:** React 18 + Vite SPA with cytoscape.js rendering a 13-node skill relationship graph. Clicking a node opens a side panel (L1 summary); "read full article" navigates to a markdown-rendered detail page. Pure static JSON + Markdown data, zero backend.

**Tech Stack:** React 18, Vite, cytoscape.js, Tailwind CSS v3, react-markdown + remark-gfm, React Router v6

---

## P1 · 骨架 — 可交互的完整图谱站点

### Task 1: 初始化项目

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`

- [ ] **Step 1: Scaffold Vite + React + TypeScript**

```bash
cd /Users/bin.ke/my-compony/superpowers-uncovering
npm create vite@latest . -- --template react-ts
npm install
```

Expected: project scaffolds into current directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install cytoscape.js react-router-dom react-markdown remark-gfm
npm install -D tailwindcss @tailwindcss/vite @types/cytoscape
```

Expected: packages added to package.json.

- [ ] **Step 3: Configure Tailwind with Vite plugin**

Write `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Add Tailwind directives**

Write `src/index.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 5: Clean up Vite scaffold**

Delete `src/App.css`, delete all content in `src/App.tsx` (replace with empty div for now), delete `src/assets/`.

```bash
rm -f src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on localhost:5173, page renders without errors.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite + React + Tailwind + cytoscape.js project"
```

---

### Task 2: Create skills-graph.json data file

**Files:**
- Create: `src/data/skills-graph.json`

- [ ] **Step 1: Write the data file**

```bash
mkdir -p src/data
```

Write `src/data/skills-graph.json`:

```json
{
  "nodes": [
    {
      "id": "brainstorming",
      "label": "brainstorming",
      "group": "process",
      "skillType": "flexible",
      "l1": {
        "trigger": "有想法但未成形，开始任何新功能前",
        "summary": "通过自然对话将想法转化为完整设计，在写代码前获得用户对设计的认可",
        "problem": "盲目编码、方向错误、需求理解偏差",
        "before": null,
        "after": "writing-plans"
      }
    },
    {
      "id": "writing-plans",
      "label": "writing-plans",
      "group": "process",
      "skillType": "flexible",
      "l1": {
        "trigger": "有 spec/需求，多步骤任务，写代码前",
        "summary": "将设计文档转化为详细的、分步骤的实现计划，每个步骤2-5分钟可完成",
        "problem": "盲目编码、遗漏步骤、范围蔓延",
        "before": "brainstorming",
        "after": "executing-plans"
      }
    },
    {
      "id": "executing-plans",
      "label": "executing-plans",
      "group": "process",
      "skillType": "rigid",
      "l1": {
        "trigger": "有实现的计划，需要在单独的session中按任务执行",
        "summary": "按照实现计划逐任务执行，在检查点进行审查，确保每个任务正确完成",
        "problem": "计划执行走样、跳过检查点、任务间状态混乱",
        "before": "writing-plans",
        "after": "requesting-code-review"
      }
    },
    {
      "id": "subagent-driven-development",
      "label": "subagent-driven-development",
      "group": "process",
      "skillType": "rigid",
      "l1": {
        "trigger": "有包含独立任务的实现计划，在当前session中执行",
        "summary": "每个任务派发一个新subagent，任务间进行两阶段代码审查（spec合规+代码质量）",
        "problem": "上下文污染、任务间依赖混乱、缺少审查环节",
        "before": "executing-plans",
        "after": "requesting-code-review"
      }
    },
    {
      "id": "requesting-code-review",
      "label": "requesting-code-review",
      "group": "process",
      "skillType": "rigid",
      "l1": {
        "trigger": "完成实现任务后，合并或PR之前",
        "summary": "派遣专门的code-reviewer agent检查工作是否满足需求、代码质量",
        "problem": "未验证的代码直接合入、需求遗漏、质量问题",
        "before": "subagent-driven-development",
        "after": "finishing-a-development-branch"
      }
    },
    {
      "id": "finishing-a-development-branch",
      "label": "finishing-a-development-branch",
      "group": "process",
      "skillType": "flexible",
      "l1": {
        "trigger": "实现完成、所有测试通过，需要决定如何合入",
        "summary": "引导完成开发工作的合入决策：合并、PR或清理，提供结构化选项",
        "problem": "合入方式选择困难、清理不彻底、分支管理混乱",
        "before": "requesting-code-review",
        "after": null
      }
    },
    {
      "id": "test-driven-development",
      "label": "test-driven-development",
      "group": "discipline",
      "skillType": "rigid",
      "l1": {
        "trigger": "实现任何功能或bug修复，写实现代码之前",
        "summary": "强制执行RED-GREEN-REFACTOR循环：先写失败测试→最小实现→重构",
        "problem": "没有测试的代码、测试后补缺乏约束力、重构无安全网",
        "before": null,
        "after": null
      }
    },
    {
      "id": "verification-before-completion",
      "label": "verification-before-completion",
      "group": "discipline",
      "skillType": "rigid",
      "l1": {
        "trigger": "准备声称工作完成、修复完成、测试通过，提交或创建PR之前",
        "summary": "在做出任何成功声明前，必须运行验证命令并确认输出——证据先于断言",
        "problem": "虚假完成声明、未验证的'应该可以了'、信任未经验证的agent报告",
        "before": null,
        "after": null
      }
    },
    {
      "id": "systematic-debugging",
      "label": "systematic-debugging",
      "group": "discipline",
      "skillType": "rigid",
      "l1": {
        "trigger": "遇到任何bug、测试失败、非预期行为，在提出修复方案之前",
        "summary": "系统性地追溯根因而非打补丁：条件等待→根因追踪→深度防御",
        "problem": "症状修复而非根因修复、补丁式调试、重复bug",
        "before": null,
        "after": null
      }
    },
    {
      "id": "receiving-code-review",
      "label": "receiving-code-review",
      "group": "collaboration",
      "skillType": "rigid",
      "l1": {
        "trigger": "收到code review反馈，在实现建议之前",
        "summary": "要求技术严谨和验证，而非表演性同意或盲目实现——对不清晰的反馈追问到底",
        "problem": "盲目接受review建议、未验证就改、不理解反馈意图",
        "before": null,
        "after": null
      }
    },
    {
      "id": "dispatching-parallel-agents",
      "label": "dispatching-parallel-agents",
      "group": "collaboration",
      "skillType": "flexible",
      "l1": {
        "trigger": "面对2个以上独立任务，可以并行工作而不需要共享状态",
        "summary": "将多个独立任务并行派发给多个agent，大幅提升效率",
        "problem": "串行执行独立任务浪费时间、上下文切换成本",
        "before": null,
        "after": null
      }
    },
    {
      "id": "using-git-worktrees",
      "label": "using-git-worktrees",
      "group": "collaboration",
      "skillType": "flexible",
      "l1": {
        "trigger": "开始需要隔离的功能开发，或执行实现计划之前",
        "summary": "创建隔离的git worktree确保工作空间独立，不影响当前分支",
        "problem": "工作区污染、分支切换成本、并行开发冲突",
        "before": null,
        "after": null
      }
    },
    {
      "id": "using-superpowers",
      "label": "using-superpowers",
      "group": "meta",
      "skillType": "rigid",
      "l1": {
        "trigger": "开始任何对话——建立如何查找和使用skills的方法",
        "summary": "superpowers的入口说明书：在任何回复前必须先检查并调用相关skill",
        "problem": "不知道该用哪个skill、忽略skill、手动做skill能做的事",
        "before": null,
        "after": null
      }
    },
    {
      "id": "writing-skills",
      "label": "writing-skills",
      "group": "meta",
      "skillType": "flexible",
      "l1": {
        "trigger": "创建新skill、编辑已有skill、验证skill在部署前能正常工作",
        "summary": "用TDD方法创建skill：压测场景→基线失败→写skill→验证通过→关闭漏洞",
        "problem": "skill写得不好AI不用、有漏洞被绕过、未测试就部署",
        "before": null,
        "after": null
      }
    }
  ],
  "edges": [
    {"from": "brainstorming", "to": "writing-plans", "relation": "sequential"},
    {"from": "writing-plans", "to": "executing-plans", "relation": "sequential"},
    {"from": "executing-plans", "to": "subagent-driven-development", "relation": "sequential"},
    {"from": "subagent-driven-development", "to": "requesting-code-review", "relation": "sequential"},
    {"from": "requesting-code-review", "to": "finishing-a-development-branch", "relation": "sequential"},
    {"from": "test-driven-development", "to": "writing-skills", "relation": "inherits"},
    {"from": "verification-before-completion", "to": "executing-plans", "relation": "embeds"},
    {"from": "verification-before-completion", "to": "writing-plans", "relation": "embeds"},
    {"from": "systematic-debugging", "to": "test-driven-development", "relation": "embeds"},
    {"from": "using-superpowers", "to": "brainstorming", "relation": "embeds"},
    {"from": "using-superpowers", "to": "systematic-debugging", "relation": "embeds"},
    {"from": "receiving-code-review", "to": "requesting-code-review", "relation": "embeds"},
    {"from": "dispatching-parallel-agents", "to": "subagent-driven-development", "relation": "embeds"},
    {"from": "using-git-worktrees", "to": "executing-plans", "relation": "embeds"}
  ]
}
```

- [ ] **Step 2: Define TypeScript types**

Write `src/data/types.ts`:

```typescript
export interface SkillNode {
  id: string
  label: string
  group: 'process' | 'discipline' | 'collaboration' | 'meta'
  skillType: 'rigid' | 'flexible'
  l1: {
    trigger: string
    summary: string
    problem: string
    before: string | null
    after: string | null
  }
}

export interface SkillEdge {
  from: string
  to: string
  relation: 'sequential' | 'embeds' | 'inherits'
}

export interface SkillsGraph {
  nodes: SkillNode[]
  edges: SkillEdge[]
}

export interface TourStep {
  nodeId: string
  highlight: string
}

export interface TourPath {
  id: string
  label: string
  description: string
  steps: TourStep[]
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/ && git commit -m "feat: add skills graph data and types"
```

---

### Task 3: Create tour-paths.json

**Files:**
- Create: `src/data/tour-paths.json`

- [ ] **Step 1: Write tour paths data**

Write `src/data/tour-paths.json`:

```json
[
  {
    "id": "quick-overview",
    "label": "快速概览",
    "description": "沿过程管控链浏览 6 个核心 skill",
    "steps": [
      { "nodeId": "brainstorming", "highlight": "一切从这里开始——想法到设计" },
      { "nodeId": "writing-plans", "highlight": "设计到可执行计划" },
      { "nodeId": "executing-plans", "highlight": "计划到代码" },
      { "nodeId": "subagent-driven-development", "highlight": "并行派发agent执行" },
      { "nodeId": "requesting-code-review", "highlight": "代码审查确保质量" },
      { "nodeId": "finishing-a-development-branch", "highlight": "合入完成" }
    ]
  },
  {
    "id": "deep-methodology",
    "label": "深入方法论",
    "description": "聚焦 writing-skills + TDD 体系",
    "steps": [
      { "nodeId": "test-driven-development", "highlight": "所有流程的基石" },
      { "nodeId": "verification-before-completion", "highlight": "证据先于断言" },
      { "nodeId": "writing-skills", "highlight": "TDD for 文档——核心方法论" },
      { "nodeId": "using-superpowers", "highlight": "skill的入口和控制中心" }
    ]
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tour-paths.json && git commit -m "feat: add tour paths data"
```

---

### Task 4: Create GraphToolbar component

**Files:**
- Create: `src/components/GraphToolbar.tsx`

- [ ] **Step 1: Write the component**

```bash
mkdir -p src/components
```

Write `src/components/GraphToolbar.tsx`:

```typescript
import { TourPath } from '../data/types'

interface GraphToolbarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  activeGroup: string
  onGroupChange: (g: string) => void
  tourPaths: TourPath[]
  onStartTour: (tourId: string) => void
  tourActive: boolean
  onStopTour: () => void
}

const groups = [
  { id: 'all', label: '全部' },
  { id: 'process', label: '过程管控' },
  { id: 'discipline', label: '纪律保障' },
  { id: 'collaboration', label: '协作支撑' },
  { id: 'meta', label: '元技能' },
]

export default function GraphToolbar({
  searchQuery, onSearchChange,
  activeGroup, onGroupChange,
  tourPaths, onStartTour, tourActive, onStopTour,
}: GraphToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border-b border-gray-200 bg-white">
      <input
        type="text"
        placeholder="搜索 skill..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
      />

      <div className="flex gap-1">
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => onGroupChange(g.id)}
            className={`px-3 py-1 text-xs rounded-full transition ${
              activeGroup === g.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 ml-auto">
        {tourActive ? (
          <button
            onClick={onStopTour}
            className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            退出导游
          </button>
        ) : (
          tourPaths.map(tp => (
            <button
              key={tp.id}
              onClick={() => onStartTour(tp.id)}
              className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
              title={tp.description}
            >
              {tp.label}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GraphToolbar.tsx && git commit -m "feat: add GraphToolbar component"
```

---

### Task 5: Create SkillGraph component (cytoscape.js)

**Files:**
- Create: `src/components/SkillGraph.tsx`

- [ ] **Step 1: Write the cytoscape wrapper**

Write `src/components/SkillGraph.tsx`:

```typescript
import { useEffect, useRef, useCallback } from 'react'
import cytoscape, { Core, EventObject } from 'cytoscape'
import { SkillsGraph } from '../data/types'

interface SkillGraphProps {
  data: SkillsGraph
  activeGroup: string
  searchQuery: string
  onNodeClick: (nodeId: string) => void
  highlightedNodeId: string | null
  graphRef: React.MutableRefObject<Core | null>
}

const groupColors: Record<string, string> = {
  process: '#3b82f6',
  discipline: '#22c55e',
  collaboration: '#f59e0b',
  meta: '#8b5cf6',
}

const relationStyles: Record<string, { style: string; label: string }> = {
  sequential: { style: 'solid', label: '→' },
  embeds: { style: 'dashed', label: '↗' },
  inherits: { style: 'dotted', label: '⇢' },
}

export default function SkillGraph({
  data, activeGroup, searchQuery, onNodeClick, highlightedNodeId, graphRef,
}: SkillGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const buildElements = useCallback(() => {
    let nodes = data.nodes
    if (activeGroup !== 'all') {
      nodes = nodes.filter(n => n.group === activeGroup)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      nodes = nodes.filter(n =>
        n.label.toLowerCase().includes(q) ||
        n.l1.summary.toLowerCase().includes(q)
      )
    }
    const nodeIds = new Set(nodes.map(n => n.id))
    const edges = data.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to))
    return { nodes, edges }
  }, [data, activeGroup, searchQuery])

  useEffect(() => {
    if (!containerRef.current) return

    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'color': '#333',
            'background-color': (el: any) => groupColors[el.data('group')] || '#999',
            'width': 32,
            'height': 32,
            'border-width': 3,
            'border-color': '#fff',
            'font-weight': 'bold',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
          },
        },
        {
          selector: 'node[skillType="flexible"]',
          style: { 'border-style': 'dashed' },
        },
        {
          selector: 'node[skillType="rigid"]',
          style: { 'border-style': 'solid' },
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-color': '#ef4444',
            'border-width': 4,
            'shadow-blur': 12,
            'shadow-color': '#ef4444',
          },
        },
        {
          selector: 'node.dimmed',
          style: { 'opacity': 0.3 },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#cbd5e1',
            'target-arrow-color': '#cbd5e1',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-style': (el: any) => {
              const r = relationStyles[el.data('relation')]
              return r ? r.style : 'solid'
            },
          },
        },
        {
          selector: 'edge[relation="inherits"]',
          style: {
            'line-style': 'dotted',
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
          },
        },
        {
          selector: 'edge[relation="embeds"]',
          style: {
            'line-style': 'dashed',
            'line-color': '#cbd5e1',
            'target-arrow-color': '#cbd5e1',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.5,
        padding: 30,
      },
    })

    const { nodes, edges } = buildElements()
    nodes.forEach(n => {
      cy.add({
        group: 'nodes',
        data: { id: n.id, label: n.label, group: n.group, skillType: n.skillType },
      })
    })
    edges.forEach(e => {
      cy.add({
        group: 'edges',
        data: { id: `${e.from}-${e.to}`, source: e.from, target: e.to, relation: e.relation },
      })
    })

    cy.layout({ name: 'breadthfirst', directed: true, spacingFactor: 1.5, padding: 30 }).run()
    cy.fit(undefined, 50)
    cy.minZoom(0.3)
    cy.maxZoom(3)

    cy.on('tap', 'node', (evt: EventObject) => {
      const nodeId = evt.target.id()
      onNodeClick(nodeId)
    })

    graphRef.current = cy

    return () => {
      cy.destroy()
      graphRef.current = null
    }
  }, [data, activeGroup, searchQuery])

  useEffect(() => {
    const cy = graphRef.current
    if (!cy) return

    const { nodes } = buildElements()
    const nodeIds = new Set(nodes.map(n => n.id))

    cy.nodes().forEach(node => {
      if (!nodeIds.has(node.id())) {
        node.addClass('dimmed')
      } else {
        node.removeClass('dimmed')
      }
    })
  }, [activeGroup, searchQuery, graphRef, buildElements])

  useEffect(() => {
    const cy = graphRef.current
    if (!cy) return
    cy.nodes().forEach(node => {
      if (highlightedNodeId && node.id() === highlightedNodeId) {
        node.addClass('highlighted')
      } else {
        node.removeClass('highlighted')
      }
    })
  }, [highlightedNodeId, graphRef])

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full min-h-0"
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SkillGraph.tsx && git commit -m "feat: add SkillGraph cytoscape component"
```

---

### Task 6: Create SidePanel component

**Files:**
- Create: `src/components/SidePanel.tsx`

- [ ] **Step 1: Write the side panel**

Write `src/components/SidePanel.tsx`:

```typescript
import { SkillNode } from '../data/types'
import { useNavigate } from 'react-router-dom'

interface SidePanelProps {
  node: SkillNode | null
  onClose: () => void
  allNodes: SkillNode[]
}

const groupLabels: Record<string, string> = {
  process: '过程管控',
  discipline: '纪律保障',
  collaboration: '协作支撑',
  meta: '元技能',
}

const groupColors: Record<string, string> = {
  process: 'bg-blue-100 text-blue-700',
  discipline: 'bg-green-100 text-green-700',
  collaboration: 'bg-amber-100 text-amber-700',
  meta: 'bg-purple-100 text-purple-700',
}

const typeLabels: Record<string, string> = {
  rigid: '刚性流程',
  flexible: '柔性指引',
}

const typeColors: Record<string, string> = {
  rigid: 'bg-red-50 text-red-600 border-red-200',
  flexible: 'bg-gray-50 text-gray-500 border-gray-200',
}

export default function SidePanel({ node, onClose, allNodes }: SidePanelProps) {
  const navigate = useNavigate()

  if (!node) return null

  const beforeNode = node.l1.before ? allNodes.find(n => n.id === node.l1.before) : null
  const afterNode = node.l1.after ? allNodes.find(n => n.id === node.l1.after) : null

  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{node.label}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${groupColors[node.group]}`}>
              {groupLabels[node.group]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[node.skillType]}`}>
              {typeLabels[node.skillType]}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">触发条件</p>
          <p className="text-sm text-gray-700">{node.l1.trigger}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">核心功能</p>
          <p className="text-sm text-gray-700">{node.l1.summary}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">解决的痛点</p>
          <p className="text-sm text-gray-700">{node.l1.problem}</p>
        </div>

        <div className="flex gap-4 text-sm text-gray-500">
          {beforeNode && (
            <div>
              <span className="text-xs text-gray-400">← 前置</span>
              <p className="font-medium text-blue-600">{beforeNode.label}</p>
            </div>
          )}
          {afterNode && (
            <div>
              <span className="text-xs text-gray-400">后置 →</span>
              <p className="font-medium text-blue-600">{afterNode.label}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => navigate(`/article/${node.id}`)}
          className="w-full py-2 px-4 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
        >
          阅读全文
        </button>
        {node.id === 'writing-skills' && (
          <button
            onClick={() => navigate('/deep-dive')}
            className="w-full mt-2 py-2 px-4 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
          >
            深入方法论（4章专项）
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SidePanel.tsx && git commit -m "feat: add SidePanel component"
```

---

### Task 7: Create FullArticle component

**Files:**
- Create: `src/components/FullArticle.tsx`

- [ ] **Step 1: Write the article view**

Write `src/components/FullArticle.tsx`:

```typescript
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function FullArticle() {
  const { skill } = useParams<{ skill: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!skill) return
    setLoading(true)
    fetch(`/content/${skill}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.text()
      })
      .then(text => { setContent(text); setLoading(false) })
      .catch(() => { setContent('# 文章暂未完成\n\n这篇深度文章还在编写中。'); setLoading(false) })
  }, [skill])

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-500 hover:text-blue-700 transition"
      >
        ← 返回图谱
      </button>
      {loading ? (
        <p className="text-gray-400">加载中...</p>
      ) : (
        <article className="prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FullArticle.tsx && git commit -m "feat: add FullArticle component"
```

---

### Task 8: Create GraphView container

**Files:**
- Create: `src/components/GraphView.tsx`

- [ ] **Step 1: Write the container**

Write `src/components/GraphView.tsx`:

```typescript
import { useState, useRef, useMemo } from 'react'
import { Core } from 'cytoscape'
import GraphToolbar from './GraphToolbar'
import SkillGraph from './SkillGraph'
import SidePanel from './SidePanel'
import skillsGraph from '../data/skills-graph.json'
import tourPathsData from '../data/tour-paths.json'
import { SkillsGraph, SkillNode, TourPath } from '../data/types'

const graphData = skillsGraph as SkillsGraph
const tourPaths = tourPathsData as TourPath[]

export default function GraphView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('all')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)
  const [tourActive, setTourActive] = useState(false)
  const graphRef = useRef<Core | null>(null)

  const selectedNode = useMemo(
    () => graphData.nodes.find(n => n.id === selectedNodeId) || null,
    [selectedNodeId]
  )

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId)
    setHighlightedNodeId(nodeId)
  }

  const handleClosePanel = () => {
    setSelectedNodeId(null)
    setHighlightedNodeId(null)
  }

  const handleStartTour = (tourId: string) => {
    const path = tourPaths.find(t => t.id === tourId)
    if (!path || !graphRef.current) return

    setTourActive(true)
    let stepIndex = 0

    const advance = () => {
      if (stepIndex >= path.steps.length) {
        setTourActive(false)
        setHighlightedNodeId(null)
        return
      }
      const step = path.steps[stepIndex]
      setSelectedNodeId(step.nodeId)
      setHighlightedNodeId(step.nodeId)
      const cy = graphRef.current
      if (cy) {
        const node = cy.getElementById(step.nodeId)
        if (node.length) {
          cy.animate({
            center: { eles: node },
            zoom: 1.2,
            duration: 600,
          })
        }
      }
      stepIndex++
      setTimeout(advance, 3000)
    }

    advance()
  }

  const handleStopTour = () => {
    setTourActive(false)
    setHighlightedNodeId(null)
  }

  return (
    <div className="flex flex-col h-screen">
      <GraphToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
        tourPaths={tourPaths}
        onStartTour={handleStartTour}
        tourActive={tourActive}
        onStopTour={handleStopTour}
      />
      <div className="flex flex-1 min-h-0">
        <SkillGraph
          data={graphData}
          activeGroup={activeGroup}
          searchQuery={searchQuery}
          onNodeClick={handleNodeClick}
          highlightedNodeId={highlightedNodeId}
          graphRef={graphRef}
        />
        {selectedNode && (
          <SidePanel
            node={selectedNode}
            onClose={handleClosePanel}
            allNodes={graphData.nodes}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GraphView.tsx && git commit -m "feat: add GraphView container"
```

---

### Task 9: Create App.tsx and main.tsx with routing

**Files:**
- Write: `src/App.tsx`, `src/main.tsx`
- Create: `src/components/DeepDive.tsx` (stub for P2)

- [ ] **Step 1: Write main.tsx**

Write `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 2: Write App.tsx**

Write `src/App.tsx`:

```typescript
import { Routes, Route } from 'react-router-dom'
import GraphView from './components/GraphView'
import FullArticle from './components/FullArticle'
import DeepDive from './components/DeepDive'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GraphView />} />
      <Route path="/article/:skill" element={<FullArticle />} />
      <Route path="/deep-dive" element={<DeepDive />} />
    </Routes>
  )
}
```

- [ ] **Step 3: Write DeepDive stub**

Write `src/components/DeepDive.tsx`:

```typescript
import { useNavigate } from 'react-router-dom'

export default function DeepDive() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-blue-500 hover:text-blue-700 transition"
      >
        ← 返回图谱
      </button>
      <h1 className="text-2xl font-bold mb-4">Writing Skills 深入方法论</h1>
      <p className="text-gray-500">详细内容将在 P2 阶段完成。</p>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/main.tsx src/components/DeepDive.tsx && git commit -m "feat: add App routing, main entry, DeepDive stub"
```

---

### Task 10: Create L2 content placeholder markdown files

**Files:**
- Create: `public/content/<13 skill names>.md`, `public/content/writing-skills/<4 chapters>.md`

- [ ] **Step 1: Create directory and a script to generate placeholders**

```bash
mkdir -p public/content/writing-skills
```

Write a small script to generate all placeholder files, then run it:

```bash
skills="brainstorming writing-plans executing-plans subagent-driven-development requesting-code-review finishing-a-development-branch test-driven-development verification-before-completion systematic-debugging receiving-code-review dispatching-parallel-agents using-git-worktrees using-superpowers writing-skills"

for skill in $skills; do
  cat > "public/content/${skill}.md" << EOF
# ${skill}

> 这篇深度文章还在编写中，将在 P2 阶段完成。

## 解决的痛点

（待补充）

## 核心工作流

（待补充）

## 关键设计决策

（待补充）

## 防理性化机制

（待补充）

## 与其他 skill 的协作关系

（待补充）

## 原始 SKILL.md 精读

（待补充）
EOF
done

mkdir -p public/content/writing-skills
for chapter in overview cso tdd-methodology anti-rationalization; do
  cat > "public/content/writing-skills/${chapter}.md" << EOF
# ${chapter}

> 详细内容将在 P2 阶段完成。
EOF
done
```

- [ ] **Step 2: Verify files created**

```bash
ls public/content/*.md | wc -l
ls public/content/writing-skills/*.md | wc -l
```

Expected: 14 and 4.

- [ ] **Step 3: Commit**

```bash
git add public/content/ && git commit -m "feat: add L2 content placeholder markdown files"
```

---

### Task 11: Verify P1 complete — dev build and smoke test

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Expected: Dev server starts, open http://localhost:5173.

- [ ] **Step 2: Manual smoke test checklist**
  - Graph renders with 13 colored nodes and connecting edges
  - Clicking a node opens SidePanel with L1 info
  - Group filter buttons work (click "纪律保障" → only 3 green nodes bright, others dimmed)
  - Search box filters nodes (type "writing" → only writing-skills and writing-plans visible)
  - "阅读全文" button navigates to /article/:skill with placeholder content
  - Back button returns to graph
  - "快速概览" tour button starts animated walkthrough
  - "退出导游" stops the tour
  - Deep dive link on writing-skills node navigates to /deep-dive stub

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors. Output in `dist/`.

- [ ] **Step 4: Verify build output**

```bash
ls dist/index.html && echo "Build OK"
```

- [ ] **Step 5: Commit any remaining changes and tag P1**

```bash
git add -A && git commit -m "chore: P1 complete - interactive graph site skeleton"
```

---

## P2 · 血肉 — 完整学习体验

### Task 12: Create GuideTour overlay component

**Files:**
- Create: `src/components/GuideTour.tsx`
- Modify: `src/components/GraphView.tsx` — integrate GuideTour

- [ ] **Step 1: Write GuideTour component**

Write `src/components/GuideTour.tsx`:

```typescript
import { TourPath, TourStep } from '../data/types'

interface GuideTourProps {
  path: TourPath
  currentStep: number
  currentNodeId: string | null
  onStop: () => void
}

export default function GuideTour({ path, currentStep, currentNodeId, onStop }: GuideTourProps) {
  const step: TourStep | undefined = path.steps[currentStep]

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-96 z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-purple-500 font-bold uppercase tracking-wide">
          导游模式 · {path.label}
        </span>
        <button onClick={onStop} className="text-gray-400 hover:text-gray-600 text-sm">退出</button>
      </div>
      <div className="flex gap-1 mb-3">
        {path.steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-purple-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {step ? (
        <div>
          <p className="text-sm font-medium text-gray-800">
            {currentStep + 1}. {step.nodeId.replace(/-/g, ' ')}
          </p>
          <p className="text-xs text-gray-500 mt-1">{step.highlight}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">导游完成！你现在可以自由探索了。</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Integrate GuideTour into GraphView**

Modify `src/components/GraphView.tsx`:

Add import:
```typescript
import GuideTour from './GuideTour'
```

Add state after existing state declarations:
```typescript
const [tourPath, setTourPath] = useState<TourPath | null>(null)
const [tourStepIndex, setTourStepIndex] = useState(0)
```

Replace `handleStartTour` and `handleStopTour` with:

```typescript
const handleStartTour = (tourId: string) => {
  const path = tourPaths.find(t => t.id === tourId)
  if (!path || !graphRef.current) return
  setTourActive(true)
  setTourPath(path)
  setTourStepIndex(0)
  const firstNodeId = path.steps[0].nodeId
  setSelectedNodeId(firstNodeId)
  setHighlightedNodeId(firstNodeId)
  const cy = graphRef.current
  const node = cy.getElementById(firstNodeId)
  if (node.length) {
    cy.animate({ center: { eles: node }, zoom: 1.2, duration: 600 })
  }
}

const handleTourNext = () => {
  if (!tourPath) return
  const nextIndex = tourStepIndex + 1
  if (nextIndex >= tourPath.steps.length) {
    handleStopTour()
    return
  }
  setTourStepIndex(nextIndex)
  const nodeId = tourPath.steps[nextIndex].nodeId
  setSelectedNodeId(nodeId)
  setHighlightedNodeId(nodeId)
  const cy = graphRef.current
  if (cy) {
    const node = cy.getElementById(nodeId)
    if (node.length) {
      cy.animate({ center: { eles: node }, zoom: 1.2, duration: 600 })
    }
  }
}

const handleStopTour = () => {
  setTourActive(false)
  setTourPath(null)
  setTourStepIndex(0)
  setHighlightedNodeId(null)
}
```

Add GuideTour component just before closing `</div>` of the outer container (after SidePanel), replacing the old tour logic block:

```typescript
{tourActive && tourPath && (
  <>
    <GuideTour
      path={tourPath}
      currentStep={tourStepIndex}
      currentNodeId={highlightedNodeId}
      onStop={handleStopTour}
    />
    <button
      onClick={handleTourNext}
      className="absolute bottom-6 right-6 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition z-10 text-sm"
    >
      {tourStepIndex >= tourPath.steps.length - 1 ? '完成' : '下一步 →'}
    </button>
  </>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GuideTour.tsx src/components/GraphView.tsx && git commit -m "feat: add GuideTour overlay with manual advance"
```

---

### Task 13: Create DeepDive full component

**Files:**
- Write: `src/components/DeepDive.tsx`

- [ ] **Step 1: Write the DeepDive component**

Write `src/components/DeepDive.tsx` (overwrite the stub):

```typescript
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const chapters = [
  { id: 'overview', title: '1. 什么是 Skill？', desc: '定义、类型、适用边界' },
  { id: 'cso', title: '2. CSO 搜索优化', desc: '如何让 AI 找到你的 skill' },
  { id: 'tdd-methodology', title: '3. TDD 方法论', desc: 'RED → GREEN → REFACTOR' },
  { id: 'anti-rationalization', title: '4. 防理性化设计', desc: '如何让 Skill 不被绕过' },
]

export default function DeepDive() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId?: string }>()
  const [content, setContent] = useState('')
  const [activeChapter, setActiveChapter] = useState(chapterId || 'overview')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (chapterId) setActiveChapter(chapterId)
  }, [chapterId])

  useEffect(() => {
    setLoading(true)
    fetch(`/content/writing-skills/${activeChapter}.md`)
      .then(res => res.text())
      .then(text => { setContent(text); setLoading(false) })
      .catch(() => { setContent('内容加载失败。'); setLoading(false) })
  }, [activeChapter])

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-blue-500 hover:text-blue-700 transition"
      >
        ← 返回图谱
      </button>

      <h1 className="text-2xl font-bold mb-2">Writing Skills 深入方法论</h1>
      <p className="text-gray-500 mb-8">
        这是 superpowers 最核心的元技能——教你如何创建和封装自己的 skill。
        通过 TDD 方法确保 skill 质量，通过防理性化设计确保 skill 不可绕过。
      </p>

      <div className="flex gap-6">
        <nav className="w-56 shrink-0">
          <ul className="space-y-1 sticky top-6">
            {chapters.map(ch => (
              <li key={ch.id}>
                <button
                  onClick={() => {
                    setActiveChapter(ch.id)
                    navigate(`/deep-dive/${ch.id}`, { replace: true })
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeChapter === ch.id
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div>{ch.title}</div>
                  <div className="text-xs text-gray-400">{ch.desc}</div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 min-w-0">
          {loading ? (
            <p className="text-gray-400">加载中...</p>
          ) : (
            <article className="prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
          )}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update App.tsx routing for deep-dive chapters**

Modify `src/App.tsx`:

```typescript
import { Routes, Route } from 'react-router-dom'
import GraphView from './components/GraphView'
import FullArticle from './components/FullArticle'
import DeepDive from './components/DeepDive'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GraphView />} />
      <Route path="/article/:skill" element={<FullArticle />} />
      <Route path="/deep-dive" element={<DeepDive />} />
      <Route path="/deep-dive/:chapterId" element={<DeepDive />} />
    </Routes>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DeepDive.tsx src/App.tsx && git commit -m "feat: add DeepDive chapter navigation"
```

---

### Task 14: Write all 13 L2 articles

**Files:**
- Write: `public/content/<all 13 skills>.md`

- [ ] **Step 1: Write writing-skills deep article**

Write `public/content/writing-skills.md`:

```markdown
# writing-skills

## 解决的痛点

写了一个 skill，AI 却不按你说的做？skill 被聪明的 agent 找到漏洞绕过？skill 写了没人用？
writing-skills 解决的核心问题：**如何创建 AI agent 真正会遵守、无法绕过的 skill**。

## 核心工作流

writing-skills 将 Test-Driven Development 应用于过程文档编写：

1. **RED** — 创建压测场景，不带 skill 运行，记录 agent 的基线行为（包括逐字逐句的理性化借口）
2. **GREEN** — 写最小化 skill 恰好解决那些具体的违规行为
3. **REFACTOR** — 在测试中发现新的理性化借口 → 补充明确的反制措施 → 重新验证

## 关键设计决策

### "description 只写触发条件，绝不写工作流"

这是 writing-skills 最反直觉的设计。测试发现：当 description 包含工作流摘要时，Claude 会直接按 description 行动而不读取 skill 正文。把 description 想象成搜索引擎的关键词——它的唯一作用是让 AI 判断"我现在该不该读这个 skill"。

### "没有失败的测试，就没有 skill"

这是不可谈判的铁律。包括新增 skill 和编辑已有 skill。原理：你写 skill 是为了纠正某种行为，如果不先观察基线行为，你根本不知道自己在纠正什么。

### "关闭每一个漏洞，逐字逐句"

聪明的 agent 会找借口："这只是一次简单的改动""我先做这个再回来补流程"。writing-skills 要求把所有这些借口写进"红牌表"，让 agent 能自我识别理性化。

## 防理性化机制

| 借口 | 现实 |
|------|------|
| "skill 已经很清楚了" | 清楚对你 ≠ 清楚对其他 agent。必须测试。 |
| "只是一个参考文档" | 参考文档也会有漏洞和不清晰的地方。测检索。 |
| "测试太花时间" | 不测试的 skill 浪费更多时间修。 |
| "部署后再测试" | 问题 = agent 不知道为什么 skill 没用。先测试。 |

## 与其他 skill 的协作关系

- **前置依赖**：test-driven-development（继承其 RED-GREEN-REFACTOR 思想）
- **协作技能**：systematic-debugging（基线行为分析）、verification-before-completion（验证 skill 生效）
- **被引用者**：所有 skill 都应该通过 writing-skills 方法论创建

## 原始 SKILL.md 精读

> "Writing skills IS Test-Driven Development applied to process documentation."

writing-skills 不是"写文档"，而是"为 AI 行为编写约束程序"。skill 是代码，SKILL.md 是源码，压测是 CI。一切与传统软件开发对齐。
```

- [ ] **Step 2: Write using-superpowers L2 article**

Write `public/content/using-superpowers.md`:

```markdown
# using-superpowers

## 解决的痛点

AI 不知道该用哪个 skill。遇到问题自己硬上，做了 skill 本该做的事。用户说"帮我添加登录"，AI 直接写代码，跳过了 brainstorming → writing-plans → TDD 整条流水线。

## 核心工作流

using-superpowers 是 superpowers 生态的"入口路由器"：

1. 收到任何消息 → 先检查：有没有 skill 可能适用？
2. 即使只有 1% 的可能性 → 调用 Skill tool
3. 多个 skill 都适用 → 过程 skill 优先（brainstorming > debugging），再实现 skill
4. skill 装载后 → 无条件遵循其指令

## 关键设计决策

### "极端重要性标记"

SKILL.md 开头使用 `<EXTREMELY-IMPORTANT>` 标签强行打断 agent 的默认行为模式。这不是装饰——没有这个标签，agent 可能在判断要不要调 skill 的阶段就已经开始行动了。

### "Red Flags 表——拦截理性化思维"

列出了 agent 最常见的 12 种逃避借口及其反驳。这不是写给人看的，是写给 agent 自己的——当它想到"let me explore the codebase first"，恰好对应红牌："Skills tell you HOW to explore. Check first."

### "用户指令永远优先"

Superpowers skills 覆盖默认系统行为，但用户的 CLAUDE.md / GEMINI.md / 直接指令优先级最高。这确保 skill 不会成为"独裁者"。

## 防理性化机制

思想转化为表格：每一种"我觉得不需要 skill"的念头都有对应的反制文字。关键在于不是人在执行这些检查，而是 agent 在自我检查。

## 与其他 skill 的协作关系

- **入口角色**：是所有其他 skill 的前置入口
- **被嵌入者**：被系统作为 `<system-reminder>` 注入每个对话
- **用户扩展**：用户可以通过 CLAUDE.md 配置额外规则覆盖 skill 行为

## 原始 SKILL.md 精读

> "IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT."

无条件、不可谈判。这是整个 superpowers 体系的核心约束——skill 的权威来自于这种强制性。
```

- [ ] **Step 3: Write brainstorming L2 article**

Write `public/content/brainstorming.md`:

```markdown
# brainstorming

## 解决的痛点

拿到需求就写代码 → 写到一半发现方向错了 → 删掉重来。没有设计阶段的需求就像没有地图的旅行。

## 核心工作流

1. 探索项目上下文（文件、文档、最近提交）
2. 逐一提问澄清需求（每次只问一个问题，多用选择题）
3. 提出 2-3 种方案及权衡，给出推荐
4. 逐节呈现设计，每节确认后继续
5. 写设计文档到 `docs/superpowers/specs/`
6. 自查（占位符、一致性、范围、歧义）
7. 用户审查 → 过渡到 writing-plans

## 关键设计决策

### "硬性门槛——禁止在批准前写代码"

`<HARD-GATE>` 标签明确禁止在用户批准设计前调用任何实现 skill 或写任何代码。这对抗的是 agent 的"善意冲动"——agent 倾向于"直接帮用户解决问题"，但没想清楚就动手反而浪费更多时间。

### "视觉伴侣——工具而非模式"

braistorming 提供浏览器端的视觉伴侣（mockup、对比图、架构图），但强调这不是模式切换——每个问题独立决定用浏览器还是终端。视觉问题用浏览器，概念问题用终端。

### "反模式——这东西太简单不需要设计"

每一个项目都要走这个过程。todo list、单函数工具、配置修改都不例外。"简单"项目是被未经验证的假设浪费最多工作的地方。

## 防理性化机制

"这只是一个简单的问题""让我先探索代码库""我检查一下 git 就行"——这些想法都是在理性化地跳过设计阶段。skill 用红牌表直接拦截这些念头。

## 与其他 skill 的协作关系

- **后置 skill**：writing-plans（设计文档的下一步是实现计划）
- **被嵌入者**：using-superpowers 的流程图中引用了 brainstorming 作为第一条检查
- **触发 pattern**：用户表达"我想做 X""帮我构建 Y"时自动触发

## 原始 SKILL.md 精读

> "Instructions say WHAT, not HOW. 'Add X' or 'Fix Y' doesn't mean skip workflows."

用户告诉你做什么（WHAT），skill 告诉你怎么做（HOW）。用户说"添加登录"不代表跳过设计。
```

- [ ] **Step 4: Write writing-plans L2 article**

Write `public/content/writing-plans.md`:

```markdown
# writing-plans

## 解决的痛点

有设计文档但不知道从哪里开始写代码。实现时范围逐渐扩大（scope creep）。任务太粗糙导致 agent 执行走样。

## 核心工作流

1. 读取设计文档，理解完整需求
2. 设计文件结构——哪些文件创建/修改，每个职责是什么
3. 将工作分解为 2-5 分钟的任务（"写失败测试""运行验证失败""写最小实现""运行验证通过""提交"）
4. 每个任务包含：精确文件路径、完整代码、精确命令及预期输出
5. 自查（覆盖范围、占位符、类型一致性）
6. 保存到 `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`

## 关键设计决策

### "假设工程师零上下文"

编写计划时假设执行者完全不了解项目代码库和工具集——每个文件路径、每行代码、每个命令都必须显式给出。这确保了 plan 可以被 subagent 或其他 session 可靠执行。

### "无占位符"

TODO、TBD、"适当补充错误处理"——这些都是 plan 的失败模式。每一个步骤都必须包含实际内容。同样的代码在不同任务中出现就重复写，因为执行者可能不按顺序读。

### "文件结构先于任务分解"

在定义任务之前先设计文件结构。这是分解决策被锁定的地方。每个文件应该有明确的职责边界。

## 防理性化机制

写计划是一种纪律——没有铁律就无法强制执行。但全流程中对 plan 的格式化要求（精确路径、完整代码、命令+预期输出）本身就是一种防偷懒机制。

## 与其他 skill 的协作关系

- **前置 skill**：brainstorming（设计文档输入）
- **后置 skill**：executing-plans / subagent-driven-development
- **协作 skill**：verification-before-completion（计划自查阶段）

## 原始 SKILL.md 精读

> "Assume they are a skilled developer, but know almost nothing about our toolset or problem domain."

这是 plan 质量的核心标准。不是写给"理解上下文的人"看的，是写给"完全不了解项目的人"看的。
```

- [ ] **Step 5: Write executing-plans L2 article**

Write `public/content/executing-plans.md`:

```markdown
# executing-plans

## 解决的痛点

有了 plan 但执行时跳过步骤、合并任务、在检查点不检查。一个好的 plan 被糟糕地执行，结果一样差。

## 核心工作流

1. 在单独的 session 中按任务顺序执行计划
2. 每个检查点停下来审查已完成的工作
3. 发现偏差及时纠正，不积累问题
4. 完成后过渡到代码审查

## 关键设计决策

### "分离 session"

executing-plans 刻意要求在新 session 中执行——避免 plan 编写时的上下文污染执行时的判断。编写 plan 的人和执行 plan 的人（或 agent）应该是不同的"角色"。

### "检查点制度"

检查点不是建议，是硬停。在关键里程碑必须验证已完成的工作符合 plan 预期。这借鉴了制造业的质量控制节点思想。

## 防理性化机制

"这个任务太简单，不需要检查点""我已经知道没问题了"——与 verification-before-completion 协作，证据先于断言。

## 与其他 skill 的协作关系

- **前置 skill**：writing-plans
- **后置 skill**：requesting-code-review
- **横切嵌入**：verification-before-completion（每个检查点触发）
- **并行替代**：subagent-driven-development（同一阶段的不同执行方式）

## 原始 SKILL.md 精读

执行计划不是"照着做就行"，而是需要纪律——verification-before-completion 和 systematic-debugging 随时待命，当出现偏差时立即介入。
```

- [ ] **Step 6: Write remaining L2 articles**

Write `public/content/subagent-driven-development.md`:

```markdown
# subagent-driven-development

## 解决的痛点

在一个 session 中连续执行多个任务导致上下文污染、agent 分心。串行执行独立任务浪费时间。

## 核心工作流

1. 每个独立任务派发一个全新的 subagent
2. 任务间进行两阶段审查：spec 合规 + 代码质量
3. subagent 从零上下文开始，必须通过 plan 中的完整信息完成任务

## 关键设计决策

### "新 agent = 新大脑"

每个 subagent 不继承任何上下文，这看似低效，实则是最关键的设计。上下文的"污染"（前面任务的决策、试错、偏差）不会传递。每个 agent 只看到它需要完成的那一个任务。

### "两阶段审查"

第一阶段检查是否满足 spec（功能完整），第二阶段检查代码质量（安全、性能、可维护性）。两个不同 reviewer prompt，防止 reviewer 被一个视角限制。

## 防理性化机制

"两个任务差不多，一起做更快"——禁止。subagent per task 的粒度不可合并。这对抗的是效率错觉：合并任务短期更快，但长期 bug 更多。

## 与其他 skill 的协作关系

- **前置 skill**：executing-plans
- **后置 skill**：requesting-code-review
- **横切技能**：dispatching-parallel-agents（独立任务并行）、using-git-worktrees（隔离工作区）

## 原始 SKILL.md 精读

subagent-driven-development 是 executing-plans 的"加强版"——用并行和隔离换取更高的效率和质量保证。
```

Write `public/content/requesting-code-review.md`:

```markdown
# requesting-code-review

## 解决的痛点

写了代码就提交，没有审查环节。"自己能看出来的问题早就修了，真正需要审查的是自己看不出来的问题。"

## 核心工作流

1. 派遣专门的 code-reviewer agent（独立于实现 agent）
2. 两阶段审查：spec 合规 → 代码质量
3. 审查报告返回后，实现 agent 逐条处理
4. 修复后重新审查直到通过

## 关键设计决策

### "独立 agent = 独立视角"

code-reviewer agent 不继承实现 agent 的思维过程。这模拟了人类 code review 的核心价值——一个不同的视角看到不同的问题。

### "先 spec 后代码"

不先读 spec 就去 review 代码 → reviewer 会用"代码看起来合理"替代"代码做了该做的事"。必须先建立"应该做什么"的基准，再看代码。

## 防理性化机制

"我自己 review 过了"——不等于有效审查。需要的是独立 agent 的视角。

## 与其他 skill 的协作关系

- **前置 skill**：subagent-driven-development / executing-plans
- **后置 skill**：finishing-a-development-branch
- **协作 skill**：receiving-code-review（review 的另一半）

## 原始 SKILL.md 精读

code reviewer 的 prompt 是精心设计的——不是"检查这个代码"，而是"对照 spec 逐条核实，每个 check 都要有明确结论"。
```

Write `public/content/finishing-a-development-branch.md`:

```markdown
# finishing-a-development-branch

## 解决的痛点

代码写完了、测试通过了，然后呢？合并、PR、还是先清理？很多人在这步犹豫，导致分支堆积。

## 核心工作流

1. 确认所有工作已完成、测试通过
2. 评估当前分支状态（与主分支的差异）
3. 提供结构化选项：直接合并、创建 PR、暂存清理、放弃
4. 执行选定操作
5. 清理工作区

## 关键设计决策

### "结构化选项而非开放式问题"

不直接问"你想怎么处理这个分支？"——而是给出 4 个具体选项及其适用场景。这降低了决策疲劳。

### "完成后清理"

每次完成一个开发周期后确保工作区干净：worktree 移除、分支清理、stash 处理。这防止"僵尸分支"积累。

## 防理性化机制

"先留着，说不定以后还要改"——这是分支堆积的主要原因。skill 引导及时清理。

## 与其他 skill 的协作关系

- **前置 skill**：requesting-code-review
- **协作 skill**：using-git-worktrees（清理 worktree）
```

Write `public/content/test-driven-development.md`:

```markdown
# test-driven-development

## 解决的痛点

先写代码再补测试 → 测试只验证"代码做了什么"而不是"代码应该做什么"。没有测试就重构 → 恐惧驱动开发。

## 核心工作流

1. **RED**：写一个失败的测试（验证它会失败）
2. **GREEN**：写恰好让测试通过的最小代码
3. **REFACTOR**：在测试保护下改进代码
4. 重复

## 关键设计决策

### "铁律——没有测试就没有代码"

先写了实现代码？删除。重来。这不是效率问题，是质量问题。先写测试确保每个功能都有明确的可验证的预期行为。

### "反证法验证——回归测试必须双向验证"

写了回归测试后必须：revert 修复 → 测试失败 → 恢复修复 → 测试通过。如果 revert 后测试仍然通过，说明这个测试没有真正覆盖该 bug。

### "写测试前写代码 = 删除"

不允许保留作为"参考"。不允许"边改边写测试"。删掉，重来。这是整个 superpowers 中最严格的规定之一。

## 防理性化机制

| 借口 | 现实 |
|------|------|
| "太简单不需要测试" | 简单代码也会坏。测试 30 秒。 |
| "我手动测过了" | 手动测试不可重复。 |
| "先写代码再补测试效果一样" | 先写测试="应该做什么"，后补="做了什么"。 |
| "这是关于精神不是形式" | 违反形式就是违反精神。 |

## 与其他 skill 的协作关系

- **被继承者**：writing-skills（将 TDD 方法论移植到文档创建）
- **横切嵌入**：所有编码 skill 执行时
- **协作技能**：systematic-debugging（深入分析失败）、verification-before-completion（验证通过）

## 原始 SKILL.md 精读

> "Violating the letter of the rules is violating the spirit of the rules."

这是封死"我在遵循精神"借口的关键声明。没有例外，没有解释。
```

Write `public/content/verification-before-completion.md`:

```markdown
# verification-before-completion

## 解决的痛点

"应该可以了""看起来没问题""上次跑通了"——基于假设宣布完成，而不是基于证据。

## 核心工作流

1. 在做出任何完成声明前，问：什么命令能证明这个声明？
2. 运行完整命令（重新跑，不用缓存结果）
3. 读取完整输出，检查退出码，数失败数量
4. 输出是否真的证实了声明？
   - 否 → 报告实际状态 + 证据
   - 是 → 报告声明 + 证据
5. 只有这时才能做声明

## 关键设计决策

### "跳过任何一步 = 欺骗"

不是效率问题，是诚信问题。系统提示中记录了来自 24 条失败记忆的教训——用户说"我不信你"，信任破裂。

### "新鲜验证，不用缓存"

上次跑的结果不算。编译器和测试在上次跑和现在之间可能已经有了不同的输入。必须重新运行。

### "禁止模糊措辞"

"should work" "probably" "seems to"——这些都是撒谎的信号。只允许：命令 + 输出 + 结论。

## 防理性化机制

"这次例外""我太累了""agent 报告成功了所以应该没问题"——对疲惫和压力下的理性化尤其警惕。专门点出"tired and wanting work over"作为红牌。

## 与其他 skill 的协作关系

- **横切嵌入**：被 brainstorming、writing-plans、executing-plans、TDD 等几乎所有 skill 引用
- **触发面最广**：任何形式的完成/成功声明都会触发

## 原始 SKILL.md 精读

> "Claiming work is complete without verification is dishonesty, not efficiency."

这不是流程要求，是诚信要求。superpowers 的设计哲学中，verification 是最底层的纪律约束。
```

Write `public/content/systematic-debugging.md`:

```markdown
# systematic-debugging

## 解决的痛点

看到 bug → 猜原因 → 改代码 → bug 还在 → 再猜。这种"打地鼠"式调试在复杂系统中效率极低。

## 核心工作流

systematic-debugging 提供了三个递进的调试技术：

1. **condition-based-waiting**：不用 sleep(1000)，等待条件满足。处理时序问题——等待真正的原因（条件）而不是等待时间。
2. **root-cause-tracing**：不从症状直接跳到修复。沿着调用链逐层向上追溯，找到最初的触发点。
3. **defense-in-depth**：不在表面修 bug。修复根因 + 添加验证（测试/断言）防止复发 + 考虑同类问题是否在其他地方存在。

## 关键设计决策

### "技术是语言无关的"

condition-based-waiting 不是 setTimeout vs Promise vs asyncio——它是等待条件而非时间的思维模式。skill 的触发描述刻意避免使用语言特定的症状词。

### "三个技术递进使用"

不是并列选择——先掌握 condition-based-waiting，然后 root-cause-tracing，最后 defense-in-depth。每个技术都以前一个为基础。

## 防理性化机制

"加个 setTimeout 就行了""重启一下应该能好"——这些都是打地鼠，不是调试。skill 用具体的技术替换这些条件反射。

## 与其他 skill 的协作关系

- **被嵌入者**：TDD 流程中分析测试失败时触发
- **协作 skill**：verification-before-completion（验证修复）

## 原始 SKILL.md 精读

systematic-debugging 是最"工程化"的 skill——它的技术不是新发明，而是将成熟的软件工程调试方法适配到 AI agent 环境中。
```

Write `public/content/receiving-code-review.md`:

```markdown
# receiving-code-review

## 解决的痛点

收到 code review 反馈 → 立刻改 → 改完发现 reviewer 其实是错的。或者：收到模糊反馈 → 自己猜意思 → 猜错 → 白改。

## 核心工作流

1. 收到反馈 → 先理解：这条反馈想要解决什么问题？
2. 如果反馈不清晰 → 追问到清晰（技术严谨，不表演性同意）
3. 如果反馈有问题 → 用证据反驳（测试结果、文档引用、设计决策）
4. 理解后才开始实现
5. 实现后验证修改确实解决了反馈中指出的问题

## 关键设计决策

### "不盲目实现"

区别于大多数 agent 的默认行为——"用户/审查者说了什么，就改什么"。实际上 reviewer 也可能犯错，或者表述不准确。receiving-code-review 给 agent 赋权去追问和反驳。

### "技术严谨 > 表面和谐"

不追求"快速同意 → 快速修改 → 快速通过"的表面效率。真正的效率是改对，不是改快。

## 与其他 skill 的协作关系

- **前置协作**：requesting-code-review（发出审查请求）
- **支撑技能**：systematic-debugging（分析反馈中指出的问题）、verification-before-completion（验证修改）

## 原始 SKILL.md 精读

这个 skill 最独特的地方在于它给了 agent "反驳权"——不是盲目执行 review 反馈，而是像一个有经验的工程师一样判断每条反馈的合理性。
```

Write `public/content/dispatching-parallel-agents.md`:

```markdown
# dispatching-parallel-agents

## 解决的痛点

3 个独立任务，一个一个做，每个等前一个完成——明明可以同时进行。串行执行浪费大量墙上时间。

## 核心工作流

1. 识别 2+ 个独立任务（无共享状态、无顺序依赖）
2. 为每个任务编写自包含的 prompt（agent 从零开始看到的所有信息）
3. 同时派出多个 agent
4. 等所有 agent 完成后汇总结果

## 关键设计决策

### "自包含 prompt 是关键"

并行 agent 不共享上下文，所以每个 prompt 必须包含该 agent 完成工作所需的全部信息。这不是冗余，是隔离的必要代价。

### "独立 = 无共享状态 + 无顺序依赖"

两个任务即使处理同一个文件的不同区域，如果有合并冲突的风险，就不是真正独立的。

## 与其他 skill 的协作关系

- **嵌入技能**：subagent-driven-development（并行派发任务）
- **协作技能**：using-git-worktrees（隔离每个 agent 的工作目录）
```

Write `public/content/using-git-worktrees.md`:

```markdown
# using-git-worktrees

## 解决的痛点

在一个分支上做一半，突然需要切回 main 修紧急 bug。stash → 切换 → 修完 → 切回来 → pop → 冲突。

## 核心工作流

1. 为 feature 工作创建独立的 git worktree
2. 每个 worktree 有独立的工作目录和分支
3. 不需要 stash/checkout/冲突解决
4. 完成后清理 worktree

## 关键设计决策

### "隔离而非切换"

worktree 的核心思想：不是在不同分支间切换，而是让不同分支同时存在。这从根本上消除了 stash/pop 的痛点。

### "与 subagent 协作"

每个 subagent 可以拥有自己的 worktree，彻底隔离文件系统操作。这也是 executing-plans 推荐的前置步骤。

## 与其他 skill 的协作关系

- **嵌入者**：executing-plans、subagent-driven-development（隔离工作环境）
- **协作技能**：finishing-a-development-branch（清理 worktree）
```

- [ ] **Step 7: Commit**

```bash
git add public/content/*.md && git commit -m "feat: complete all 13 L2 depth articles"
```

---

### Task 15: Write writing-skills 4 deep-dive chapters

**Files:**
- Write: `public/content/writing-skills/overview.md`
- Write: `public/content/writing-skills/cso.md`
- Write: `public/content/writing-skills/tdd-methodology.md`
- Write: `public/content/writing-skills/anti-rationalization.md`

- [ ] **Step 1: Write overview.md**

Write `public/content/writing-skills/overview.md`:

```markdown
## 什么是 Skill？

在 superpowers 体系中，**skill 是给 AI agent 的行为约束程序**。

### 三种类型

| 类型 | 本质 | 例子 |
|------|------|------|
| **技法 (Technique)** | 具体的、有步骤的方法 | condition-based-waiting, root-cause-tracing |
| **模式 (Pattern)** | 思考问题的方式 | flatten-with-flags, test-invariants |
| **参考 (Reference)** | API 文档、语法指南 | pptxgenjs 参考, ooxml 结构 |

### Skill 不是什么

- **不是一次性的问题解决记录** — "某年某月我们遇到了 X 问题这样解决了"太特定，不可复用
- **不是项目约定** — 项目级配置放 CLAUDE.md，不封装为 skill
- **不是机械约束** — 能用正则/校验工具自动检查的就不要写成 skill

### Skill vs 普通提示词

普通提示词是"一次性指导"，skill 是"持久化并可被发现的指导"。关键差异在于：

1. **可发现性**：agent 通过 description 匹配自动找到 skill
2. **可迭代性**：通过 TDD 流程（压测→基线→skill→验证→关闭漏洞）持续改进
3. **权威性**：skill 被系统作为 `<system-reminder>` 注入，优先级高于默认行为

### 何时创建 Skill

- 技术不是直觉上显而易见的
- 会跨项目复用
- 模式广泛适用（不是项目特定的）
- 其他人也会受益

### 何时不创建

- 一次性解决方案
- 标准实践（官方文档已有）
- 项目特有约定（放 CLAUDE.md）
- 机械约束（自动化 > 文档）
```

- [ ] **Step 2: Write cso.md**

Write `public/content/writing-skills/cso.md`:

```markdown
## CSO (Claude Search Optimization) — 如何让 AI 找到你的 Skill

CSO 是 writing-skills 最精妙的设计之一。它的核心洞察：**skill 写得再好，如果 agent 不加载它，等于不存在**。

### 五条核心规则

#### 1. Description 只写触发条件，绝不写工作流

这是被实际测试验证过的关键设计。当 description 包含工作流摘要时，agent 会直接按 description 行动而不加载 skill 正文。

```yaml
# 错误：包含了流程摘要
description: Use for TDD - write test first, watch it fail, write minimal code, refactor

# 正确：只有触发条件
description: Use when implementing any feature or bugfix, before writing implementation code
```

**原理**：description 是"我该不该读这个 skill"的判断条件，不是"这个 skill 做什么"的摘要。把 description 想象成索引，不是 TL;DR。

#### 2. 关键词覆盖

使用 agent 会搜索的词：
- 错误消息："Hook timed out", "ENOTEMPTY"
- 症状："flaky", "hanging", "zombie"
- 同义词："timeout/hang/freeze", "cleanup/teardown/afterEach"
- 工具名：实际命令、库名、文件类型

#### 3. 描述性命名

- 主动语态，动词优先
- `creating-skills` 不是 `skill-creation`
- `condition-based-waiting` 不是 `async-test-helpers`
- 用核心洞察命名，不用分类名

#### 4. Token 预算意识

经常被加载的 skill（如 getting-started）目标 < 150 词。其他 skill < 500 词。

- 压缩示例：一个优秀的例子胜过多个平庸的
- 用交叉引用替代重复：`**REQUIRED BACKGROUND:** Use superpowers:xxx`
- 不要用 `@path/to/skill` 强制加载（会立即消费 200k+ 上下文）

#### 5. 交叉引用格式

```markdown
# 正确
**REQUIRED BACKGROUND:** You MUST understand superpowers:systematic-debugging

# 错误
@skills/testing/test-driven-development/SKILL.md
```
```

- [ ] **Step 3: Write tdd-methodology.md**

Write `public/content/writing-skills/tdd-methodology.md`:

```markdown
## TDD 方法论：RED → GREEN → REFACTOR for Skills

writing-skills 的核心理念：**写 skill 就是 TDD for 过程文档**。

### TDD 概念映射

| TDD 概念 | Skill 创建对应 |
|----------|---------------|
| 测试用例 | 压测场景（pressure scenario） |
| 生产代码 | Skill 文档（SKILL.md） |
| 测试失败 (RED) | Agent 不带 skill 时违反规则（基线行为） |
| 测试通过 (GREEN) | Agent 带 skill 时遵守规则 |
| 重构 (REFACTOR) | 关闭漏洞，同时保持合规 |

### 为什么必须先看失败

如果你没有亲眼看到 agent 在没有 skill 的情况下做错了什么，你就不知道 skill 应该教什么。

这就像修复一个你没有复现过的 bug——你改了很多东西，但不知道哪一个（如果有的话）真正解决了问题。

### RED 阶段：压测场景设计

用 subagent 运行压测场景（不带目标 skill），逐字逐句记录 agent 的基线行为：

- 做了什么选择？
- 用了什么借口（逐字）？
- 什么压力触发了违规？

对"规则/要求"类 skill，组合 3+ 种压力：时间压力、沉没成本、权威挑战、疲惫。

### GREEN 阶段：最小化 Skill

只写针对基线测试中发现的具体违规行为的 skill。不为假设的情况添加内容。

验证：同样场景，带 skill 运行，agent 现在应该遵守规则。

### REFACTOR 阶段：关闭漏洞

Agent 找到了新的借口？添加明确的反制。重复直到 skill 牢不可破。

这轮循环可能跑很多次——聪明的 agent 总能找到新的漏洞。

### 铁律

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

- 新增 skill = 需要先有失败测试
- 编辑已有 skill = 同样需要先有失败测试
- 没有例外：不是"简单补充"、不是"加一节"、不是"文档更新"
- 在测试前就写了 skill？删掉。重来。
```

- [ ] **Step 4: Write anti-rationalization.md**

Write `public/content/writing-skills/anti-rationalization.md`:

```markdown
## 防理性化设计：如何让 Skill 不被绕过

这是 writing-skills 最独特的贡献——将"说服心理学"应用于 skill 设计，确保 agent 无法绕过规则。

### 心理学基础

防理性化设计借鉴了 Cialdini (2021) 的说服原则在 AI agent 环境中的应用：

- **权威 (Authority)**：skill 作为"系统注入的规则"具有天然权威
- **承诺 (Commitment)**：公开陈述的规则更难违背
- **稀缺 (Scarcity)**：明确的"没有例外"增加规则的感知重要性
- **社会证明 (Social Proof)**："之前的 agent 都这样做过"
- **统一 (Unity)**：skill 语言建立"我们这样做"的认同感

### 五种防理性化技术

#### 1. 显式关闭每一个漏洞

不只说规则，还要明确禁止具体的绕过方式：

```markdown
# 错误
写了代码但没写测试？删掉。

# 正确
写了代码但没写测试？删掉。重来。

**没有例外：**
- 不能保留为"参考"
- 不能在写测试时"修改"它
- 不能看它
- 删掉意味着删掉
```

#### 2. 封堵"精神 vs 文字"争论

在一开始就加入基础原则声明：

```markdown
**违反规则的文字就是违反规则的精神。**
```

这句话切断整个"我在遵循精神"的理性化文体——AI 没有能力对"你真正做的是遵循精神吗？"进行值得信赖的 meta 判断。

#### 3. 构建理性化表

把基线测试中 agent 使用的每个借口都记录在表中：

```markdown
| 借口 | 现实 |
|------|------|
| "太简单不需要测试" | 简单代码也会坏。测试 30 秒。 |
| "部署后再测试" | 问题 = agent 不知道为什么 skill 没用。先测试。 |
```

这个表的作用是让 agent 在思考借口时能自我匹配："等等，这个想法就在红牌里"。

#### 4. 创建红牌列表

让 agent 容易自查是否在理性化：

```markdown
## Red Flags - STOP and Start Over

- 代码在测试之前
- "我已经手动测过了"
- "测试跑完后再加效果一样"
- "这是关于精神不是形式"
- "这次不一样因为..."

**以上所有都意味着：删掉代码。用 TDD 重新开始。**
```

#### 5. 更新 CSO 描述以覆盖违规症状

让 description 包含"你什么时候可能违反这个规则"的症状：

```yaml
description: use when implementing any feature or bugfix, before writing implementation code
```

"before writing implementation code" 这半句话是反制的关键——它在 agent 即将违反规则时拦截。

### 为什么防理性化如此重要

Agent 比人类更容易理性化，因为：
1. Agent 被训练为"有帮助的"——它天然想直接做事
2. Agent 在压力下会找效率捷径
3. Agent 可以同时看到规则的文字和精神的歧义

好的 skill 设计不是"写清楚规则"，而是"让规则无法被绕过"。
```

- [ ] **Step 5: Commit**

```bash
git add public/content/writing-skills/ && git commit -m "feat: complete writing-skills 4 deep-dive chapters"
```

---

### Task 16: Mobile responsive + visual polish

**Files:**
- Modify: `src/components/GraphView.tsx` — add responsive layout
- Modify: `src/components/SidePanel.tsx` — add mobile fullscreen
- Modify: `src/index.css` — add prose styles for article readability

- [ ] **Step 1: Add responsive SidePanel**

Modify SidePanel's root div className, changing from:
```typescript
<div className="w-80 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">
```
to:
```typescript
<div className="w-full md:w-80 border-l border-gray-200 bg-white overflow-y-auto flex flex-col absolute inset-0 md:relative z-20 md:z-auto">
```

Add a mobile close button at the very top of the panel (after the first `<div>`):

```typescript
<div className="md:hidden flex justify-end p-2">
  <button onClick={onClose} className="text-sm text-blue-500">关闭面板</button>
</div>
```

- [ ] **Step 2: Add responsive GraphView layout**

Modify GraphView's inner flex container, changing:
```typescript
<div className="flex flex-1 min-h-0">
```
to:
```typescript
<div className="flex flex-1 min-h-0 relative">
```

- [ ] **Step 3: Add prose styles for article readability**

Add to `src/index.css`:

```css
@import "tailwindcss";

/* Article prose styles */
article.prose h1 { font-size: 1.75rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #0f172a; }
article.prose h2 { font-size: 1.35rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
article.prose h3 { font-size: 1.1rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #334155; }
article.prose p { margin-bottom: 0.75rem; line-height: 1.75; color: #334155; }
article.prose ul, article.prose ol { margin-bottom: 0.75rem; padding-left: 1.5rem; }
article.prose li { margin-bottom: 0.25rem; line-height: 1.7; color: #334155; }
article.prose code { background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.875rem; color: #e11d48; }
article.prose pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
article.prose pre code { background: none; color: inherit; padding: 0; }
article.prose table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.9rem; }
article.prose th { background: #f8fafc; padding: 0.5rem 0.75rem; text-align: left; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
article.prose td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #f1f5f9; }
article.prose strong { color: #0f172a; font-weight: 600; }
article.prose blockquote { border-left: 4px solid #8b5cf6; padding: 0.5rem 1rem; margin: 1rem 0; background: #faf5ff; color: #6b21a8; font-style: italic; }
article.prose hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; }
article.prose a { color: #3b82f6; text-decoration: underline; }
```

- [ ] **Step 4: Add transition animations**

Add to `src/index.css`:

```css
/* Page transitions */
.side-panel-enter { opacity: 0; transform: translateX(20px); }
.side-panel-enter-active { opacity: 1; transform: translateX(0); transition: opacity 200ms, transform 200ms; }
```

- [ ] **Step 5: Commit**

```bash
git add src/components/GraphView.tsx src/components/SidePanel.tsx src/index.css && git commit -m "feat: mobile responsive layout and article prose styles"
```

---

### Task 17: Final verification — build and test

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with zero errors.

- [ ] **Step 2: Verify build output structure**

```bash
ls dist/ && echo "---" && ls dist/content/ | head -5
```

Expected: `index.html`, `assets/`, `content/` directory with markdown files.

- [ ] **Step 3: Run dev server for final smoke test**

```bash
npm run dev
```

- Open http://localhost:5173
- Verify: graph renders, click node → panel opens, filter works, search works, tour works, article pages load, deep-dive chapters load
- Responsive: resize browser to mobile width → panel goes fullscreen, graph still usable

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: P2 complete - full learning experience"
```

---

## Completion

P1 + P2 共 17 个任务。P1 产出可交互的完整图谱站点，P2 产出内容完整、有导游和专项章节的学习平台。

**部署**：运行 `npm run build` 后 `dist/` 目录可直接部署到 GitHub Pages 或 Vercel。
