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
