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
