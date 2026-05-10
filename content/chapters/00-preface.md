# 序章：Superpowers 解决了什么问题？

## 一个日常场景

你让 AI 帮你实现一个登录功能。AI 说"好的"，然后：

1. 直接写代码 — 没有设计、没有计划、没有测试
2. 写到一半发现方向错了 — 删掉重来
3. 代码能跑了 — AI 说"完成了"，但没有运行过验证
4. 你一试 — 崩溃了

**这不是 AI 能力的问题。这是缺少工作流程约束。**

## Skill 是什么

**Skill 是给 AI agent 的行为约束程序。** 不是"建议"，不是"参考文档"。

它的本质和代码一样——有严格的执行逻辑、有防绕过设计、用 TDD 方法测试。

## 源码目录总览

在开始之前，先看全局。以下是 superpowers 插件（v5.1.0）中 14 个 skill 的完整目录结构：

```
superpowers/5.1.0/skills/
├── using-superpowers/          ← 入口：每句对话最先检查
│   └── SKILL.md
├── brainstorming/              ← 过程 1/6：想法 → 设计
│   ├── SKILL.md
│   └── visual-companion.md
├── writing-plans/              ← 过程 2/6：设计 → 计划
│   └── SKILL.md
├── executing-plans/            ← 过程 3/6：计划执行（新 session）
│   └── SKILL.md
├── subagent-driven-development/ ← 过程 3/6 分支：计划执行（同 session）
│   ├── SKILL.md
│   ├── implementer-prompt.md
│   ├── spec-reviewer-prompt.md
│   └── code-quality-reviewer-prompt.md
├── requesting-code-review/     ← 过程 4/6：代码审查
│   └── SKILL.md
├── finishing-a-development-branch/ ← 过程 5/6：合入决策
│   └── SKILL.md
├── test-driven-development/    ← 横切约束：无测试不代码
│   ├── SKILL.md
│   └── testing-anti-patterns.md
├── verification-before-completion/ ← 横切约束：无验证不声称
│   └── SKILL.md
├── systematic-debugging/       ← 横切约束：无根因不修复
│   ├── SKILL.md
│   ├── root-cause-tracing.md
│   ├── defense-in-depth.md
│   └── condition-based-waiting.md
├── receiving-code-review/      ← 协作支撑：审查反馈处理
│   └── SKILL.md
├── dispatching-parallel-agents/ ← 协作支撑：并行派发
│   └── SKILL.md
├── using-git-worktrees/        ← 协作支撑：工作区隔离
│   └── SKILL.md
└── writing-skills/             ← 元技能：创建 skill 的方法论
    ├── SKILL.md
    ├── anthropic-best-practices.md
    ├── persuasion-principles.md
    └── testing-skills-with-subagents.md
```

> **阅读提示**：本文按"由浅入深"组织——先建立全局架构认知，再逐层深入到源码级别。每个设计论述都会**引用原始 SKILL.md 源码**作为证据。建议按顺序阅读。
