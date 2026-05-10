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
