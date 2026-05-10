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

## 与其他 skill 的协作关系

- **前置 skill**：subagent-driven-development / executing-plans
- **后置 skill**：finishing-a-development-branch
- **协作 skill**：receiving-code-review（review 的另一半）
