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
