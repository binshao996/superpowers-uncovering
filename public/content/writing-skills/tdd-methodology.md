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
