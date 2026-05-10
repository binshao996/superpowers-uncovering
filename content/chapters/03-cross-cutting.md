# 第三章：横切约束层 — 三个铁律的源码级分析

过程管控链定义了"做什么"，但不保证质量。横切约束层的三个 skill 嵌入在流水线的每一步中，当特定条件触发时强制介入。

---

## test-driven-development — 无测试不代码

### 铁律全貌

```markdown
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

Write code before the test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete

Implement fresh from tests. Period.
```

**逐条分析**：

1. **"NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"**：全大写 ASCII art——视觉上不可忽视。"FAILING" 不只是 "test"，是 "failing test"——测试必须先失败（验证它真的在测缺失的功能），然后才能写代码。

2. **"Write code before the test? Delete it. Start over."**：两个短句，没有解释余地。"Delete it" 是动作指令，"Start over" 是重置指令。

3. **"Don't keep it as 'reference'"**：agent 最常见的绕过——"我写的代码留著作参考，重新用 TDD 写"。这是自我欺骗——有"参考"代码在眼前，后面的实现会被污染。

4. **"Don't 'adapt' it while writing tests"**：另一种绕过——"我不保留代码，我边写测试边修改它"。本质上还是测试后于代码。

5. **"Don't look at it"**：最极端的一条。不只是不能保留，连看都不能看。因为看了就会影响后续实现的方向。

6. **"Delete means delete"**：针对 agent 对"delete"一词的可能曲解——"delete 意味着移到一个临时文件""delete 意味着注释掉"——不是，delete 就是 delete。

### "Letter = Spirit" 声明

```markdown
**Violating the letter of the rules is violating the spirit of the rules.**
```

**这是整个防理性化体系中最关键的一句话**。它切断了 agent 最常用的绕过方式："我在遵循规则的精神——虽然跳过了步骤 X，但质量是一样的。"

**为什么有效**：Agent 无法对"你是否真正在遵循精神？"做出可信的 meta 判断。一旦字面 = 精神的等式建立，"遵循精神"就不再是合法借口。

### 理性化表——逐条封堵

```markdown
| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is technical debt. |
| "Keep as reference, write tests first" | You'll adapt it. That's testing after. Delete means delete. |
| "Need to explore first" | Fine. Throw away exploration, start with TDD. |
| "TDD will slow me down" | TDD faster than debugging. Pragmatic = test-first. |
| "TDD is dogmatic" | TDD IS pragmatic: finds bugs before commit. |
| "Tests after achieve the same" | Tests-after = "what does this do?" Tests-first = "what should this do?" |
```

**设计模式**：左栏是 agent 产生的文字思维，右栏是事实反驳。当 agent 的思维恰好匹配左栏时，右栏提供了即时的自我纠正。

### "Why Order Matters"——最深层的论证

```markdown
**"I'll write tests after to verify it works"**

Tests written after code pass immediately. Passing immediately proves nothing:
- Might test wrong thing
- Might test implementation, not behavior
- Might miss edge cases you forgot
- You never saw it catch the bug

Test-first forces you to see the test fail, proving it actually tests something.
```

**分析**：这段不是简单的"应该这样做"而是论证了**为什么顺序至关重要**。"Passing immediately proves nothing"——测试通过了不代表测试正确，只代表它和当前代码的行为一致。只有先看测试失败，才知道这个测试真的是在验证期望的行为。

---

## verification-before-completion — 无验证不声称

### 铁律

```markdown
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

### Gate Function——源码级实现

```markdown
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

**核心设计**：把"声称完成"从一个简单动作变成了**5 步检查流程**。每一步都是具体的、可执行的动作——不是模糊的"想一想"，而是"运行命令""读取输出""检查退出码"。

### 来源于真实失败

```markdown
## Why This Matters

From 24 failure memories:
- your human partner said "I don't believe you" - trust broken
- Undefined functions shipped - would crash
- Missing requirements shipped - incomplete features
- Time wasted on false completion → redirect → rework
```

**设计意图**：不把 motivation 建立在外部的"最佳实践"，而是建立在**具体的失败记忆**上。"24 条失败记忆"给出了证据——这些不是假设的警告，是真实发生过的。

### 红旗词——禁止模糊措辞

```markdown
## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Trusting agent success reports
- Tired and wanting work over
- **ANY wording implying success without having run verification**
```

**关键是最后一条**："ANY wording implying success without having run verification"——这是一个**闭合规则**，封堵了任何未来可能出现的新的模糊措辞。

---

## systematic-debugging — 无根因不修复

### 铁律

```markdown
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

If you haven't completed Phase 1, you cannot propose fixes.
```

### 四阶段流程

```markdown
Phase 1: Root Cause Investigation
  1. Read Error Messages Carefully
  2. Reproduce Consistently
  3. Check Recent Changes
  4. Gather Evidence in Multi-Component Systems
  5. Trace Data Flow

Phase 2: Pattern Analysis
  1. Find Working Examples
  2. Compare Against References
  3. Identify Differences
  4. Understand Dependencies

Phase 3: Hypothesis and Testing
  1. Form Single Hypothesis
  2. Test Minimally
  3. Verify Before Continuing
  4. When You Don't Know, Say So

Phase 4: Implementation
  1. Create Failing Test Case
  2. Implement Single Fix
  3. Verify Fix
  4. If Fix Doesn't Work → Return to Phase 1
  5. If 3+ Fixes Failed: Question Architecture
```

### "3 次修复失败"规则——对抗打地鼠

```markdown
**If 3+ Fixes Failed: Question Architecture**

STOP and question fundamentals:
- Is this pattern fundamentally sound?
- Are we "sticking with it through sheer inertia"?
- Should we refactor architecture vs. continue fixing symptoms?

**Discuss with your human partner before attempting more fixes**

This is NOT a failed hypothesis - this is a wrong architecture.
```

**为什么这个规则至关重要**：Agent 在修复 bug 时倾向于无限循环——"试试这个 → 不行 → 试试那个 → 不行 → ..."。每个新修复都是合理的（"可能这次不一样"）。3 次失败的规则强制跳出循环，从更高层次重新审视问题。

### 红旗——自我中断清单

```markdown
## Red Flags - STOP and Follow Process

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "One more fix attempt" (when already tried 2+)
- Each fix reveals new problem in different place

**ALL of these mean: STOP. Return to Phase 1.**
```

---

> **下一章**：[设计模式目录](#第四章设计模式目录--八个贯穿模式)——这三个横切 skill 使用了哪些共同的模式？这些模式如何被实现？