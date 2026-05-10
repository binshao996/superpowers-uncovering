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

## 与其他 skill 的协作关系

- **前置 skill**：executing-plans
- **后置 skill**：requesting-code-review
- **横切技能**：dispatching-parallel-agents（独立任务并行）、using-git-worktrees（隔离工作区）
