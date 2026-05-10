# 第五章：元技能深度走读 — writing-skills 源码分析

writing-skills 是 superpowers 体系的"编译器"——它定义了如何创建 skill。而且它是**自指的**：writing-skills 本身是通过 writing-skills 教的方法创建的。

---

## 核心理念：TDD 映射

```markdown
**Writing skills IS Test-Driven Development applied to process documentation.**

| TDD Concept | Skill Creation |
|-------------|----------------|
| Test case | Pressure scenario with subagent |
| Production code | Skill document (SKILL.md) |
| Test fails (RED) | Agent violates rule without skill (baseline) |
| Test passes (GREEN) | Agent complies with skill present |
| Refactor | Close loopholes while maintaining compliance |
```

**关键洞察**：这是对 TDD 的**概念移植**，不是简单的类比。每个 TDD 概念都被精确映射到了 skill 创建的对应步骤。这意味着一个熟悉 TDD 的工程师可以直接将测试方法论应用于文档创建。

---

## 铁律

```markdown
## The Iron Law (Same as TDD)

NO SKILL WITHOUT A FAILING TEST FIRST

This applies to NEW skills AND EDITS to existing skills.

Write skill before testing? Delete it. Start over.
Edit skill without testing? Same violation.

**No exceptions:**
- Not for "simple additions"
- Not for "just adding a section"
- Not for "documentation updates"
- Don't keep untested changes as "reference"
- Don't "adapt" while running tests
- Delete means delete
```

**分析**：
1. "Same as TDD" — 直接引用 TDD skill 的铁律。建立两个 skill 之间的语义连接——这不是新的规则，是同一个规则在不同的域中的表达。
2. "NEW skills AND EDITS" — 编辑已有 skill 也需要先有失败测试。这封堵了"我只是修改一下"的借口。
3. "Not for 'documentation updates'" — 直接针对最可能被用来绕过的情况。连"文档更新"也不例外。

---

## CSO 的源码级分析

### 核心规则：description ≠ 摘要

```markdown
**CRITICAL: Description = When to Use, NOT What the Skill Does**

The description should ONLY describe triggering conditions.
Do NOT summarize the skill's process or workflow in the description.
```

### 为什么：测试证据

```markdown
**Why this matters:** Testing revealed that when a description summarizes the
skill's workflow, Claude may follow the description instead of reading the full
skill content. A description saying "code review between tasks" caused Claude to
do ONE review, even though the skill's flowchart clearly showed TWO reviews
(spec compliance then code quality).
```

**这是整个 CSO 设计的核心证据**。不是理论——是一次实际测试中发现的 bug。description 中的"code review between tasks"被 agent 理解为"做一次 code review"，覆盖了 skill 正文中规定的两阶段审查。

这个发现驱动了 CSO 的核心规则：description 只能写触发条件。

### 正确 vs 错误对比

```yaml
# ❌ BAD: Summarizes workflow
description: Use when executing plans - dispatches subagent per task with code review between tasks

# ❌ BAD: Too much process detail
description: Use for TDD - write test first, watch it fail, write minimal code, refactor

# ✅ GOOD: Just triggering conditions
description: Use when executing implementation plans with independent tasks in the current session
```

---

## 三种 Skill 类型的测试策略

```markdown
### Discipline-Enforcing Skills (rules/requirements)
Test with:
- Academic questions: Do they understand the rules?
- Pressure scenarios: Do they comply under stress?
- Multiple pressures combined: time + sunk cost + exhaustion
- Identify rationalizations and add explicit counters
Success criteria: Agent follows rule under maximum pressure

### Technique Skills (how-to guides)
Test with:
- Application scenarios: Can they apply the technique correctly?
- Variation scenarios: Do they handle edge cases?
- Missing information tests: Do instructions have gaps?
Success criteria: Agent successfully applies technique to new scenario

### Reference Skills (documentation/APIs)
Test with:
- Retrieval scenarios: Can they find the right information?
- Application scenarios: Can they use what they found correctly?
- Gap testing: Are common use cases covered?
Success criteria: Agent finds and correctly applies reference information
```

**分析**：不同的 skill 类型需要不同的测试策略。规则约束类（Discipline）是最难测试的——因为 agent 在压力下会最大化理性化，所以需要组合 3+ 种压力。

---

## 防理性化五技术

### 1. 显式关闭每一个漏洞

```markdown
# ❌ BAD
Write code before test? Delete it.

# ✅ GOOD
Write code before test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete
```

**"Don't look at it" 为什么重要**：这条看起来极端——连看都不能看？因为 agent 看到了之前写的代码后，会无意识地将后续实现偏向已有代码。即使删掉了文件，"看过"的代码还在 agent 的"记忆"中影响判断。当然实际上 agent 没有记忆——但"Don't look at it"创造了一个强心理约束：你已经写了的东西和当前任务完全无关。

### 2. 封堵"精神 vs 文字"

```markdown
**Violating the letter of the rules is violating the spirit of the rules.**
```

### 3. 构建理性化表

```markdown
| Excuse | Reality |
|--------|---------|
| "Skill is obviously clear" | Clear to you ≠ clear to other agents. Test it. |
| "It's just a reference" | References can have gaps, unclear sections. Test retrieval. |
| "I'm confident it's good" | Overconfidence guarantees issues. Test anyway. |
```

### 4. 创建红牌列表

```markdown
## Red Flags - STOP and Start Over

- Code before test
- "I already manually tested it"
- "Tests after achieve the same purpose"
- "It's about spirit not ritual"
- "This is different because..."

**All of these mean: Delete code. Start over with TDD.**
```

### 5. CSO 覆盖违规症状

```yaml
description: Use when implementing any feature or bugfix, before writing implementation code
```

"before writing implementation code" 这半句是关键——它在 agent 即将违反规则之前拦截。agent 的思维是"我要实现这个功能 → 查 skill → 看到 'before writing implementation code' → 触发 → 加载 TDD skill → 先写测试"。如果 description 只写了"Use for TDD"，agent 在写代码时不会想到要查这个 skill。

---

## 心理学基础

```markdown
**Psychology note:** Understanding WHY persuasion techniques work helps you
apply them systematically. See persuasion-principles.md for research foundation
(Cialdini, 2021; Meincke et al., 2025) on authority, commitment, scarcity,
social proof, and unity principles.
```

防理性化设计不是随意写的——它有心理学基础。Cialdini 的说服原则被映射到 AI agent 环境：

| 原则 | AI Agent 应用 |
|------|-------------|
| 权威 (Authority) | skill 作为"系统注入的规则"具有天然权威 |
| 承诺 (Commitment) | 公开陈述的规则（红牌列表）更难违背 |
| 稀缺 (Scarcity) | "没有例外"增加规则的感知重要性 |
| 社会证明 (Social Proof) | "之前的 agent 都这样做过了" |

---

## 自指：writing-skills 的自我验证

writing-skills 本身是用 writing-skills 教的方法创建的：

1. **RED**：运行没有 writing-skills 的 agent → 发现 agent 写的 skill 有漏洞、被绕过、描述不当
2. **GREEN**：写了 writing-skills 初版——铁律、CSO 规则、防理性化技术
3. **REFACTOR**：多轮测试 + 添加了 persuasion-principles.md 和 testing-skills-with-subagents.md

**这是一个完整的自指循环**——创建 skill 的方法论经过了自身方法论的验证。

---

> **下一章**：[协作支撑层](#第六章协作支撑--基础设施)——为什么没有 worktree 隔离，上面的一切都可能崩溃？
