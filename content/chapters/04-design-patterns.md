# 第四章：设计模式目录 — 八个贯穿模式的源码实现

读完前三章，你可能注意到了不同 skill 中有很多相似的结构。这不是巧合——这是 writing-skills 教的方法论的实际应用。本章从源码中提取八个可复用的设计模式。

---

## 模式 1：Iron Law（铁律）

### 形态

全大写 ASCII art，声明一条不可谈判的规则。

### 源码实例

来自 `test-driven-development/SKILL.md`：

```markdown
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

来自 `verification-before-completion/SKILL.md`：

```markdown
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

来自 `systematic-debugging/SKILL.md`：

```markdown
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

来自 `writing-skills/SKILL.md`：

```markdown
NO SKILL WITHOUT A FAILING TEST FIRST
```

### 设计要素

1. **全大写**：视觉上不可忽视。在密集的 markdown 文本中，全大写的 ASCII art 是最强的注意力信号之一。
2. **NO ... WITHOUT ... FIRST**：统一句式，确保每个铁律都有明确的"违反条件"——没有 X 就做 Y = 违规。
3. **可验证性**：每个铁律都有明确的"检查方式"。你不需要猜测是否违规——有没有先写测试？有没有先运行验证命令？这些都是二元的，有或没有。

### 什么时候用铁律

**用**：当你的 skill 需要强制执行行为约束时（刚性流程类）
**不用**：柔性指引类 skill——如 brainstorming、writing-plans 不需要铁律，因为它们靠 checklist 而非禁令来驱动行为。

---

## 模式 2：Rationalization Table（理性化表）

### 形态

表格：左栏 = agent 的借口（逐字），右栏 = 事实反驳。

### 源码实例

来自 `test-driven-development/SKILL.md`：

```markdown
| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is technical debt. |
| "Keep as reference, write tests first" | You'll adapt it. That's testing after. Delete means delete. |
```

来自 `writing-skills/SKILL.md`：

```markdown
| Excuse | Reality |
|--------|---------|
| "Skill is obviously clear" | Clear to you ≠ clear to other agents. Test it. |
| "It's just a reference" | References can have gaps, unclear sections. Test retrieval. |
| "Testing is overkill" | Untested skills have issues. Always. 15 min testing saves hours. |
| "I'll test if problems emerge" | Problems = agents can't use skill. Test BEFORE deploying. |
```

### 设计要素

1. **借口必须来源于实测**：左栏的内容来自 RED 阶段的压测记录——是 agent 真实的逐字借口，不是凭空想象的。
2. **右栏短而有力**：每条反驳在 15 词以内。不给 agent 继续辩论的空间。
3. **"Always" 和 "Never" 的使用**："Untested skills have issues. Always." —— 这种绝对措辞封堵了"但可能这次没问题"的侥幸心理。

### 什么时候用

**用**：当你的 skill 是规则约束类（刚性）时——需要预测和封堵 agent 可能的绕过借口。
**不用**：技法类和参考类 skill 不需要——它们不涉及行为约束，agent 没有绕过它们的动机。

---

## 模式 3：Red Flags List（红牌列表）

### 形态

标题 "Red Flags - STOP and Start Over"，列出触发自我中断的思维模式。

### 源码实例

来自 `test-driven-development/SKILL.md`：

```markdown
## Red Flags - STOP and Start Over

- Code before test
- Test after implementation
- Test passes immediately
- Can't explain why test failed
- Tests added "later"
- Rationalizing "just this once"
- "I already manually tested it"
- "Tests after achieve the same purpose"
- "It's about spirit not ritual"
- "Keep as reference" or "adapt existing code"
- "Already spent X hours, deleting is wasteful"
- "TDD is dogmatic, I'm being pragmatic"
- "This is different because..."

**All of these mean: Delete code. Start over with TDD.**
```

来自 `verification-before-completion/SKILL.md`：

```markdown
## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports
- Tired and wanting work over
- **ANY wording implying success without having run verification**
```

### 红牌 vs 理性化表的区别

| | 理性化表 | 红牌列表 |
|---|---------|---------|
| **粒度** | 具体的借口 → 具体的反驳 | 思维模式 → 统一的行动指令 |
| **作用** | 让 agent 判断"这个想法对不对" | 让 agent 识别"我应该停下来吗" |
| **输出** | 改变 thinking | 触发 STOP 动作 |
| **响应** | "这个借口不成立，因为..." | "这是红牌 → 删掉重来" |

关键区别：理性化表是**辩论**，红牌是**终结辩论**。"This is different because..." 为什么是红牌？因为每个 agent 都会觉得自己的情况"不一样"。不能被拖入辩论。

---

## 模式 4："Letter = Spirit" 声明

### 形态

一句话，位于 skill 的开头部分。

```markdown
**Violating the letter of the rules is violating the spirit of the rules.**
```

### 为什么放在开头

放在 skill 的 Overview 节中——agent 在处理 skill 正文之前先读到。这建立了一个前提：接下来的所有规则，字面就是精神，没有例外。

### 与红牌列表的协同

红牌列表中也有对应项：`"It's about spirit not ritual"`。这意味着 agent 想到"我在遵循精神"这个念头时：
1. 红牌列表触发——"这是红牌，停下来"
2. Letter=Spirit 声明提供理由——"因为违反字面就是违反精神"

两个机制互相增强。

---

## 模式 5：HARD-GATE（硬阻断）

### 形态

自定义 XML 标签 `<HARD-GATE>`，在关键边界处阻止 agent 行动。

### 源码实例

来自 `brainstorming/SKILL.md`：

```xml
<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project,
or take any implementation action until you have presented a design and the user
has approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>
```

### 为什么不用 markdown 标记

`<HARD-GATE>` 不是标准 HTML。它是自定义标签。选择 XML 格式而非 `### HARD GATE` 的原因：
1. 尖括号在 markdown 中视觉突出
2. 打开/闭合标签暗示"进入门"和"出门"
3. 不会被 agent 误解为普通标题

### 使用原则

- **只在最关键的边界使用**——整个 superpowers 体系中只有 brainstorming 用了 HARD-GATE，因为"设计→实现"是最关键的边界
- **不要滥用**——如果到处是 HARD-GATE，agent 会产生"狼来了"效应

---

## 模式 6：CSO（Claude Search Optimization）

### 核则：Description 只写触发条件，不写流程

这个规则本身来自测试——是观察到的 bug 驱动的设计。

来自 `writing-skills/SKILL.md` 的证据：

```markdown
**Why this matters:** Testing revealed that when a description summarizes the
skill's workflow, Claude may follow the description instead of reading the full
skill content. A description saying "code review between tasks" caused Claude to
do ONE review, even though the skill's flowchart clearly showed TWO reviews
(spec compliance then code quality).

When the description was changed to just "Use when executing implementation plans
with independent tasks" (no workflow summary), Claude correctly read the flowchart
and followed the two-stage review process.
```

### 实际例子

```yaml
# ❌ BAD: Summarizes workflow - Claude may follow this instead of reading skill
description: Use when executing plans - dispatches subagent per task with code review between tasks

# ❌ BAD: Too much process detail
description: Use for TDD - write test first, watch it fail, write minimal code, refactor

# ✅ GOOD: Just triggering conditions, no workflow summary
description: Use when executing implementation plans with independent tasks in the current session
```

### 为什么这是最容易被忽视的模式

大多数 skill 作者会自然地想 "description 应该总结这个 skill 做了什么"。这是人写文档的直觉。但 AI 的行为不同——它会把 description 当做 shortcut，跳过加载 skill 正文。

**把 description 想象成索引卡片，不是 TL;DR。**

---

## 模式 7：Terminal State（终结状态路由）

### 形态

每个过程 skill 的末尾明确指定下一步调用哪个 skill。

### 源码实例

来自 `brainstorming/SKILL.md` 结尾：

```markdown
**The terminal state is invoking writing-plans.**
Do NOT invoke frontend-design, mcp-builder, or any other implementation skill.
The ONLY skill you invoke after brainstorming is writing-plans.
```

来自 `subagent-driven-development/SKILL.md` 集成声明：

```markdown
## Integration

**Required workflow skills:**
- superpowers:using-git-worktrees
- superpowers:writing-plans
- superpowers:requesting-code-review
- superpowers:finishing-a-development-branch
```

### 两种形式

| 形式 | 用法 | 例子 |
|------|------|------|
| **主动路由** | "下一步只能是 X" | brainstorming → writing-plans |
| **依赖声明** | "我需要 Y 才能工作" | subagent-driven-development 需要 worktrees |

### 为什么是"terminal"不是"next step"

"Terminal state" 比 "next step" 更强——它暗示"只有这一个合法的下一步"。不是"建议"，不是"推荐"，是"终点站"。

---

## 模式 8：Subagent Isolation（子 Agent 隔离）

### 形态

每个 subagent 从零上下文开始，不继承主 session 的任何信息。

### 源码实例

来自 `subagent-driven-development/SKILL.md`：

```markdown
**Why subagents:** You delegate tasks to specialized agents with isolated context.
By precisely crafting their instructions and context, you ensure they stay focused
and succeed at their task. They should never inherit your session's context or
history — you construct exactly what they need.
```

### 核心洞察

上下文污染 > 上下文重复。Subagent 不被允许看到主 session 的上下文——只能看到你为这个 task 构造的 prompt。这意味着：

- 前面任务的错误决策不会传染
- 每个 agent 的思考是独立的
- 审查 agent 的视角是新鲜的（因为是另一个 agent）

---

## 模式关系全景

```mermaid
graph TB
    CSO["CSO<br/>确保 agent 加载 skill"] --> IL["Iron Law<br/>定义不可违反的规则"]
    IL --> RT["Rationalization Table<br/>封堵常见借口"]
    RT --> RF["Red Flags<br/>触发自我中断"]
    RF --> LS["Letter=Spirit<br/>封堵最后漏洞"]
    HG["HARD-GATE<br/>边界硬阻断"] --> IL
    TS["Terminal State<br/>确定性路由"] -->|"指向下一步"| SKILL["下一个 skill"]

    style CSO fill:#fef3c7,stroke:#d97706
    style IL fill:#fecaca,stroke:#ef4444
    style RT fill:#dcfce7,stroke:#16a34a
    style RF fill:#dcfce7,stroke:#16a34a
    style LS fill:#f3e8ff,stroke:#7c3aed
    style HG fill:#fecaca,stroke:#ef4444
    style TS fill:#dbeafe,stroke:#2563eb
```

**掌握这八个模式 = 掌握了创建 skill 的语言。**

---

> **下一章**：[元技能深度走读](#第五章元技能深度走读--writing-skills)——writing-skills 是上述所有模式的"模板"。它是如何用 TDD 方法创建 skill 的？
