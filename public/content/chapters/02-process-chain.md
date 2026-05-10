# 第二章：过程管控链 — 从源码看流水线

过程管控链是 superpowers 的主干——6 个 skill 组成从"想法"到"代码合入"的完整流水线。每个 skill 的终点明确指向下一个。

---

## 1. brainstorming — "想法 → 设计"

### 核心机制：HARD-GATE

这是 brainstorming 最关键的设计。直接看源码：

```xml
<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project,
or take any implementation action until you have presented a design and the user
has approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>
```

**逐行分析**：

1. **`<HARD-GATE>` 标签**：这不是标准 HTML/XML——是自定义的语义标签。它的效果完全来自于视觉冲击力。全大写 + 尖括号 + 独占一行，让它在纯文本流中像一个"紧急信号"。Agent 在处理文本时对这种强烈的标记会分配更高的注意力权重。

2. **"Do NOT invoke any implementation skill"**：第一个禁令是禁止调用实现 skill。为什么？因为 agent 的本能是"用户说要做 X → 找到能做 X 的 skill → 调用它"。这条禁令拦截了这个本能的第一步。

3. **"write any code, scaffold any project"**：这三个动作覆盖了 agent 最常见的"直接动手"行为——写代码、脚手架项目、采取实现行动。注意它不禁止"读文件""分析项目""画图"——这些探索性动作可以帮 agent 理解上下文。

4. **"until you have presented a design and the user has approved it"**：禁令不是永恒的——有明确的解除条件："设计已呈现 + 用户已批准"。这引出了 brainstorming 的核心流程。

5. **"This applies to EVERY project regardless of perceived simplicity."**：封堵"但是这个项目太简单了"的借口。这句话就是防理性化设计的一个实例——提前预判 agent 可能的借口并直接否定。

### 还有一个反模式声明

```markdown
## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility,
a config change — all of them. "Simple" projects are where unexamined assumptions
cause the most wasted work.
```

**设计意图**：agent 常见的一个理性化是"这个任务太简单，不需要设计"。这段文字直接把这个借口定性为"反模式"——不是"可以接受的选择"，而是"错误做法"。列举了"todo list、单函数工具、配置修改"这些最小粒度的任务——agent 不能说"我的任务不在这个范围"。

### 终结状态：确定性路由

```markdown
**The terminal state is invoking writing-plans.**
Do NOT invoke frontend-design, mcp-builder, or any other implementation skill.
The ONLY skill you invoke after brainstorming is writing-plans.
```

**分析**：
- "The terminal state" — 定义了 brainstorming 完成后的唯一出口
- 显式禁止 frontend-design、mcp-builder — agent 容易跳到这些"看起来相关"的实现 skill
- "The ONLY skill" — 全大写 ONLY，确保没有歧义

### Checklist：把工作流变成 TodoWrite

```markdown
You MUST create a task for each of these items and complete them in order:

1. Explore project context — check files, docs, recent commits
2. Offer visual companion (if topic will involve visual questions)
3. Ask clarifying questions — one at a time
4. Propose 2-3 approaches — with trade-offs and your recommendation
5. Present design — in sections, get user approval after each section
6. Write design doc — save to docs/superpowers/specs/
7. Spec self-review — check for placeholders, contradictions, ambiguity, scope
8. User reviews written spec
9. Transition to implementation — invoke writing-plans skill
```

**设计意图**：要求 agent 用 TodoWrite 把每个步骤变成 checklist。这不是"参考列表"——是可追踪的任务。Agent 可以逐个完成和标记，确保没有跳过步骤。

---

## 2. writing-plans — "设计 → 计划"

### 核心机制：零上下文假设

```markdown
Write comprehensive implementation plans assuming the engineer has zero context
for our codebase and questionable taste.

Assume they are a skilled developer, but know almost nothing about our toolset
or problem domain. Assume they don't know good test design very well.
```

**为什么需要零上下文假设**：因为执行 plan 的可能是另一个 session 的 agent 或 subagent——它没有你的上下文。Plan 必须是自包含的。

"questionable taste" 是一个精心选择的措辞——它告诉 plan 作者"不要假设执行者会做出正确的判断"。因此 plan 必须精确到每个文件路径、每行代码、每个命令。

### 禁止占位符——精确到残酷

```markdown
## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures**:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how
- References to types, functions, or methods not defined in any task
```

**分析**：每一条禁令都是针对一个常见的偷懒模式：
- "TBD/TODO" → "后面再补细节"（永远不会补）
- "add appropriate error handling" → 听起来合理，但实际上什么都没说
- "Similar to Task N" → agent 读 task 时可能不按顺序，不能依赖上下文
- "describe what to do without showing how" → plan 必须有实际代码，不只是"做什么"

### 2-5 分钟的任务粒度

```markdown
## Bite-Sized Task Granularity

Each step is one action (2-5 minutes):
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step
```

**为什么是 2-5 分钟**：这是 TDD 循环的单位时长。每个步骤足够小到不会出大错，又足够大到有意义。如果 agent 在一个步骤中卡住了，损失最多 5 分钟的工作。

### 执行方式选择——设计博弈

```markdown
**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task,
   review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans,
   batch execution with checkpoints
```

**为什么提供两个选项**：不同的场景适用不同的执行方式。Subagent-driven 适合独立任务，inline 适合需要连续上下文的任务。给用户选择权而不是替用户决定。

---

## 3. subagent-driven-development — "每任务新大脑"

### 核心原则

```markdown
**Core principle:** Fresh subagent per task + two-stage review (spec then quality)
= high quality, fast iteration

**Continuous execution:** Do not pause to check in with your human partner between
tasks. Execute all tasks from the plan without stopping.
```

**分析**：
- "Fresh subagent per task" — 每个 task 一个新的 subagent，从零上下文开始。这不是浪费——上下文污染比上下文重复更危险
- "spec then quality" — 两阶段审查有严格的顺序：先 spec 合规，后代码质量。顺序不能反
- "Do not pause" — 要求连续执行，不给用户发"我完成了任务 3，要继续吗？"——因为那是一种浪费用户时间的理性化

### 两阶段审查源码证据

```markdown
[Dispatch spec compliance reviewer]
Spec reviewer: ✅ Spec compliant - all requirements met, nothing extra

[Dispatch code quality reviewer]
Code reviewer: Strengths: Good test coverage, clean. Issues: None. Approved.
```

**Spec 审查先于代码审查的源码证据**：在 skill 的 red flags 中明确写道：

```markdown
**Never:**
- Start code quality review before spec compliance is ✅ (wrong order)
```

**为什么要这样排序**：如果先看代码再看 spec → reviewer 会用"代码看起来合理"替代"代码做了该做的事"。必须先建立"该做什么"的基准（spec 审查），再检查"做得对不对"（代码审查）。

---

## 4. executing-plans — "新 session 执行"

```markdown
Execute the implementation plan task-by-task in a separate session.
```

**关键设计：为什么是 separate session**：和 subagent-driven-development 的区别在于角色分离。写 plan 的人 ≠ 执行 plan 的人。执行者从零上下文开始，必须严格按 plan 的指令行动。这模拟了软件开发中"设计者"和"实现者"的分离。

## 5. requesting-code-review — "独立审查"

```markdown
Dispatch a specialized code-reviewer agent to check that the work meets
requirements and code quality standards.
```

## 6. finishing-a-development-branch — "结构化终局"

```markdown
Guide completion of development work: merge, PR, or cleanup.
Provide structured options for closing out the branch.
```

**设计用心**：不直接问"你想怎么处理这个分支？"，而是给出明确的结构化选项——减少决策疲劳。

---

> **下一章**：[横切约束层](#第三章横切约束层--三个铁律)——如果没有 TDD、verification、debugging 这三个横切约束，上面的流水线每一步都可能出质量问题。
