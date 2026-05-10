# 第七章：从 0 到 1 设计 Skill 系统的通用方法论

读完前六章，你已经从源码层面理解了 superpowers 的四层架构、八个设计模式、三个铁律、以及 writing-skills 的自指循环。但还有最后一个问题：**如果让你从零设计一套全新的 skill 系统，你会怎么做？**

本章将 superpowers 中的具体设计决策提炼为**可迁移的通用方法论**。无论你是在为数据库迁移设计 skill、为代码审查设计 skill、还是为任何需要约束 AI agent 行为的领域设计 skill，这套方法论都适用。

---

## 核心认知：Skill 是什么？

在深入方法论之前，必须先对齐一个认知。这来自 writing-skills 的核心洞察：

```markdown
**Writing skills IS Test-Driven Development applied to process documentation.**
```

**Skill 不是"给 AI 的提示词"，Skill 是"给 AI 行为的约束程序"。**

| 传统认知 | 正确认知 |
|---------|---------|
| Skill = 写文档 | Skill = 写程序（AI 行为程序） |
| Skill 的好坏取决于文笔 | Skill 的好坏取决于测试覆盖和防绕过设计 |
| 写完就发布 | RED → GREEN → REFACTOR 循环 |
| AI 自然会遵守 | AI 会找漏洞——必须设计防绕过机制 |

这个认知转变是后面所有方法论步骤的前提。如果你把 skill 当文档写，你会写出"说得很对但 AI 不用"的 skill。如果你把 skill 当程序写，你会写出"AI 无法绕过"的 skill。

---

## 方法论总览：六个阶段

```mermaid
graph LR
    A["1. 领域分析<br/>问题是什么？"] --> B["2. 压测设计<br/>如何诱发违规？"]
    B --> C["3. 基线测量<br/>RED：agent 如何失败？"]
    C --> D["4. Skill 构建<br/>GREEN：最小化规则"]
    D --> E["5. 防绕过硬化<br/>REFACTOR：关闭漏洞"]
    E --> F["6. 部署与迭代<br/>持续发现新漏洞"]
    F -.->|"发现新借口"| B

    style A fill:#fef3c7,stroke:#d97706
    style B fill:#fecaca,stroke:#ef4444
    style C fill:#fecaca,stroke:#ef4444
    style D fill:#dcfce7,stroke:#16a34a
    style E fill:#dbeafe,stroke:#2563eb
    style F fill:#f3e8ff,stroke:#7c3aed
```

---

## 阶段 1：领域分析 — 你的 domain 需要什么约束？

### 步骤 1.1：定义 Agent 的任务场景

首先明确：**agent 在这个领域要完成什么任务？** 这是整个 skill 系统的输入。

以 superpowers 为例，agent 的任务场景是"软件开发的完整生命周期"——从想法到设计到实现到审查到合入。你的领域可能是：

- **数据库迁移**：从 schema 变更到数据迁移到回滚方案
- **代码审查**：从收到 PR 到审查到反馈到合入
- **故障响应**：从告警到定位到修复到复盘
- **文档编写**：从大纲到草稿到审查到发布

**关键操作**：把这个场景拆解为步骤序列。每个步骤都有一个输入和一个输出。

### 步骤 1.2：识别每个步骤的"失败模式"

对每个步骤，问三个问题：

1. **Agent 在没有任何约束时，最常见犯什么错？**
2. **这些错误的成本有多高？**（按风险排序——修复成本 × 发生频率）
3. **错误是"技能不足"还是"纪律不足"？**

以 superpowers 为例的源码证据——来自 `verification-before-completion/SKILL.md` 的设计动机：

```markdown
"should work" "probably" "seems to"——这些都是撒谎的信号。
```

这不是 agent "不会做"，而是 agent "偷懒不做"——纪律问题，不是能力问题。技能不足需要技法类 skill（how-to guide），纪律不足需要规则约束类 skill（iron law + red flags）。

**实操产出**：每个步骤的失败模式清单，标注类型（技能/纪律）和风险等级。

### 步骤 1.3：决定 Skill 的类型分布

| 失败类型 | Skill 类型 | 设计策略 | Superpowers 例子 |
|---------|-----------|---------|-----------------|
| 纪律不足 | 刚性规则类 | 铁律 + 红牌 + 理性化表 | TDD, verification |
| 技能不足 | 柔性技法类 | 步骤 + 示例 + checklist | systematic-debugging |
| 信息缺失 | 参考类 | 检索优化 + 覆盖测试 | API references |

**关键原则**：不是所有 skill 都需要铁律。如果你把参考文档写成刚性规则，agent 会对所有 skill 产生"狼来了"效应，真正重要的规则也被稀释了。

---

## 阶段 2：压测设计 — 如何可靠地诱发违规？

这是 writing-skills 方法论中最被低估的部分。如果你不能可靠地诱发违规，你就无法测量 skill 是否有效。

### 步骤 2.1：设计压测场景

来自 writing-skills 的源码——三种 skill 类型的测试策略：

```markdown
### Discipline-Enforcing Skills (rules/requirements)
Test with:
- Academic questions: Do they understand the rules?
- Pressure scenarios: Do they comply under stress?
- Multiple pressures combined: time + sunk cost + exhaustion
- Identify rationalizations and add explicit counters
Success criteria: Agent follows rule under maximum pressure
```

**对刚性规则类 skill，必须组合 3+ 种压力**：

| 压力类型 | 如何在 prompt 中制造 | Superpowers 中对应的测试场景 |
|---------|-------------------|--------------------------|
| **时间压力** | "这个很紧急，尽快完成" | "这个 bug 已经在生产环境了，用户正在受影响" |
| **沉没成本** | 让 agent 先做大量工作，再要求判断 | "你已经花了 2 小时分析这个问题" |
| **权威挑战** | "我是技术负责人，我说这样就行" | "不用写测试了，我手动测过了" |
| **疲惫模拟** | 长对话历史 + 多轮任务 | 连续执行 5+ 个任务后的第 6 个 |
| **模糊边界** | 任务在规则和不规则的灰色地带 | "这不是生产代码，只是一个脚本" |

**对柔性技法类 skill**：

```markdown
### Technique Skills (how-to guides)
Test with:
- Application scenarios: Can they apply the technique correctly?
- Variation scenarios: Do they handle edge cases?
- Missing information tests: Do instructions have gaps?
```

### 步骤 2.2：准备基线测试环境

```markdown
**核心原则:** 用 subagent 做测试——它不继承你的上下文，和你真正的用户（其他 agent）有相同的信息条件。
```

来自 writing-skills 的红牌："自己测自己的 skill = 无效。" 你写 skill 时的思维模式会污染测试——你知道"应该怎么做"，但其他 agent 不知道。

**实操**：为每个压测场景派发一个**没有目标 skill** 的 subagent，记录其完整行为。

---

## 阶段 3：基线测量 — RED 阶段

这是整个方法论中最关键的一步——也是 writing-skills 铁律的来源：

```markdown
NO SKILL WITHOUT A FAILING TEST FIRST
```

### 步骤 3.1：记录基线行为（逐字）

对每个压测场景，记录：

1. **Agent 做了什么？** — 具体行为序列
2. **Agent 说了什么？** — 逐字逐句的借口和解释
3. **什么触发了违规？** — 是压力？是模糊？是缺失信息？
4. **违规后的后果是什么？** — 产生了什么问题？

### 步骤 3.2：提取"借口清单"

这是后续构建理性化表的原材料。来自 `writing-skills/SKILL.md` 的例子：

```markdown
| Excuse | Reality |
|--------|---------|
| "Skill is obviously clear" | Clear to you ≠ clear to other agents. Test it. |
| "It's just a reference" | References can have gaps, unclear sections. Test retrieval. |
| "I'm confident it's good" | Overconfidence guarantees issues. Test anyway. |
```

**这些借口不是凭空想象的——每一条都是 RED 阶段 agent 的实际原话。**

### 步骤 3.3：确认 RED 基线有效

基线必须清晰展示"没有 skill = 出问题"。如果 agent 在没有任何约束的情况下已经做了正确的事，那这个 skill 就不需要存在（至少对你测试的场景不需要）。

**实操产出**：
- 行为日志（agent 做了什么）
- 借口清单（agent 说了什么——逐字原文）
- 失败模式确认（哪些步骤在哪种压力下失败）

---

## 阶段 4：Skill 构建 — GREEN 阶段

### 步骤 4.1：先搭建架构，再写具体规则

回到第一章的架构总览。不同层解决不同问题：

| 层 | 解决的问题 | 设计要素 |
|----|----------|---------|
| **入口层** | Agent 怎么发现该用哪个 skill？ | CSO 规则、触发条件、description 设计 |
| **过程层** | Agent 按什么流程执行？ | Terminal State、HARD-GATE、checklist |
| **约束层** | 什么规则绝对不能违反？ | Iron Law、理性化表、红牌列表 |
| **协作层** | Agent 需要什么物理环境？ | 隔离、并行、反馈处理 |

**关键洞察**：不是每个 skill 系统都需要四层。简单的领域可能只有约束层（一两个规则 skill）。但如果你发现自己在设计超过 5 个 skill，就应该考虑分层——分层降低认知负担，让每个 skill 的职责清晰。

### 步骤 4.2：从 Iron Law 开始

如果你是设计一个需要强制执行规则的 skill 系统，Iron Law 是第一步。

来自四个 skill 的铁律句式分析：

```markdown
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST         # TDD
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE  # verification
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST           # debugging
NO SKILL WITHOUT A FAILING TEST FIRST                     # writing-skills
```

**统一句式**：`NO [action] WITHOUT [precondition] FIRST`

这个句式的精妙之处：
1. **NO ... WITHOUT ... FIRST** — 清晰定义了"违规条件"：没有 X 就做 Y = 违规
2. **全大写** — 视觉上不可忽视，建立规则的物理存在感
3. **可验证性** — 每个铁律都有明确的二元检查方式。有没有先写测试？有没有先查根因？这些是有或没有的问题，不存在灰色地带。

**实操**：用这个句式写出你的第一个铁律。确保它是可二元验证的——"代码质量要高"不是铁律，"没有审查通过就不能合入"才是。

### 步骤 4.3：写最小化 Skill——只覆盖 RED 中发现的违规

这是 GREEN 阶段的核心约束：**只写针对基线测试中发现的具体违规行为的规则**。不为假设的情况添加内容。

writing-skills 的红牌直接体现了这一原则：

```markdown
Write skill before testing? Delete it. Start over.
Edit skill without testing? Same violation.
```

如果你添加了一条"以防万一"的规则，但没有对应的失败测试——你不知道这条规则是否真的需要，也不知道它是否真的有效。这不是严谨，这是浪费。

### 步骤 4.4：验证 GREEN——同样场景，带 skill 重跑

用同样的压测场景，但这次 agent 加载了你的 skill。确认：
- Agent 的行为符合规则
- Agent 没有找到新的绕过方式
- Skill 的措辞没有歧义（如果 agent 理解错了，说明措辞需要修正）

**如果 agent 仍然违规？** 回到步骤 4.3——检查 skill 是否足够具体。大多数首次 GREEN 失败是因为规则太模糊，agent 找不到"如果...就..."的明确逻辑。

---

## 阶段 5：防绕过硬化 — REFACTOR 阶段

这是 superpowers 方法论最独特的贡献，也是最难掌握的部分。

### 步骤 5.1：为什么需要防绕过

从第五章 writing-skills 的心理学家基础：

```markdown
**Psychology note:** Understanding WHY persuasion techniques work helps you
apply them systematically. See persuasion-principles.md for research foundation
(Cialdini, 2021; Meincke et al., 2025) on authority, commitment, scarcity,
social proof, and unity principles.
```

Agent 不是恶意地绕过规则——它被训练为"有帮助的"，在效率压力下会自然地找捷径。防绕过设计的本质是：**预测并封堵 agent 的理性化路径，在 agent 意识到自己正在绕过规则之前就拦截它。**

### 步骤 5.2：五种防绕过技术的通用模板

#### 技术 1：显式关闭每一个漏洞

**模板**：
```
# ❌ BAD（只说规则）
[违规行为]？[笼统的处理方式]。

# ✅ GOOD（逐条关闭漏洞）
[违规行为]？[具体处理方式]。

**没有例外：**
- 不能 [借口 1]
- 不能 [借口 2]
- 不能 [借口 3]
- [处理方式] 意味着 [处理方式]
```

来自 TDD skill 的源码示范——第四章模式 1：

```markdown
Write code before test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete
```

**深度分析**："Don't look at it" 是最极致的——不是"不能保留代码"，而是"连看都不能看"。为什么？因为 agent 看了之前写的代码后，会无意识地将后续实现偏向已有代码。即使文件删了，"看过"的代码还在 agent 的"上下文记忆"中。这不是技术问题——是心理学问题。

#### 技术 2：Letter = Spirit 声明

**模板**：
```markdown
**Violating the letter of the rules is violating the spirit of the rules.**
```

**为什么有效**：这句话封堵了 agent 最常见的绕过借口——"我遵循的是规则的精神，不是字面"。因为 agent 没有能力对自己做值得信赖的 meta 判断（"我真正做的是遵循精神吗？"），所以这个借口本质上是一个无穷递归的自我辩解。直接切断这条路径："字面就是精神，没有例外。"

#### 技术 3：理性化表

**模板**：
```markdown
| 借口 | 现实 |
|------|------|
| "[RED 阶段记录的具体借口 1]" | [简短反驳，15 词以内] |
| "[RED 阶段记录的具体借口 2]" | [简短反驳] |
```

**设计要素**：
- **左栏必须来自实测** — 不是凭空想象的借口，是 agent 的逐字原话
- **右栏短而有力** — 不给 agent 继续辩论的空间，每条 15 词内
- **"Always" 和 "Never" 的精确使用** — "Untested skills have issues. Always." 封堵了"但可能这次没问题"的侥幸

#### 技术 4：红牌列表

**模板**：
```markdown
## Red Flags - STOP and Start Over

- [思维模式 1]
- [思维模式 2]
- "[RED 阶段记录的具体话语]"
- "This is different because..."

**All of these mean: [统一的行动指令].**
```

**红牌 vs 理性化表的区别**（来自第四章模式 3 的分析）：

| | 理性化表 | 红牌列表 |
|---|---------|---------|
| **粒度** | 具体的借口 → 具体的反驳 | 思维模式 → 统一的行动指令 |
| **作用** | 让 agent 判断"这个想法对不对" | 让 agent 识别"我应该停下来吗" |
| **输出** | 改变 thinking | 触发 STOP 动作 |
| **响应** | "这个借口不成立，因为..." | "这是红牌 → 删掉重来" |

红牌的关键是 **"This is different because..."** — 这个思维模式是通用红牌，因为每个 agent 都会觉得自己的情况"不一样"。你不能被拖入"这次是否真的不一样"的辩论——直接 STOP。

#### 技术 5：CSO 覆盖违规症状

**模板**：
```yaml
description: Use when [正常触发条件], [在即将违规之前]
```

来自 writing-skills 的 CSO 规则：

```yaml
description: Use when implementing any feature or bugfix, before writing implementation code
```

**关键**："before writing implementation code" — 这半句话在 agent **即将违规之前**就拦截。agent 的思维是"我要实现这个功能 → 查 skill → 看到 'before writing implementation code' → 触发 → 加载 TDD skill → 先写测试"。如果 description 只写了 "Use for TDD"，agent 在写代码时不会想到要查这个 skill——因为 agent 在想的是"实现功能"，不是"做 TDD"。

### 步骤 5.3：REFACTOR 循环

REFACTOR 不是一次性的——它是一个循环：

1. 带 skill 运行压测
2. Agent 发现新的绕过方式 → 记录新的借口
3. 更新理性化表 + 红牌列表 + 漏洞关闭
4. 重新测试
5. 重复直到 agent 在压力下也无法绕过

来自 writing-skills 的警告：

```markdown
聪明的 agent 总能找到新的漏洞。
```

这个循环可能跑很多轮。做好心理准备。

---

## 阶段 6：部署与迭代

### 步骤 6.1：发布前最终检查清单

从 writing-skills 和 using-superpowers 的设计中提取的检查项：

- [ ] 每个规则都有对应的失败测试（RED 基线）
- [ ] 每个规则都有对应的通过测试（GREEN 验证）
- [ ] 理性化表的每一条借口都来自实测
- [ ] 红牌列表覆盖了最常见的绕过思维模式
- [ ] Description 只写触发条件，没有流程摘要
- [ ] 铁律使用 `NO ... WITHOUT ... FIRST` 句式，可二元验证
- [ ] HARD-GATE 只在最关键边界使用（不超过 2-3 个）
- [ ] Terminal State 明确指向下一步

### 步骤 6.2：用户反馈驱动的迭代

Skill 部署后，用户报告"agent 不遵守 skill"时，**不要直接改 skill**。回到方法论的第一步：

1. **复现**：用户遇到的具体场景是什么？
2. **RED**：在这个场景下不带 skill 运行 — agent 做了什么？
3. **分析**：agent 用的是什么新的借口/绕过模式？
4. **GREEN**：更新 skill，封堵这个新模式
5. **REFACTOR**：检查是否还有其他类似的未封堵路径

---

## 通用化：四个"总是"和四个"永不"

### 四个"总是"

1. **总是先看失败**：没看到 agent 如何失败之前，不要写任何规则
2. **总是用 subagent 测试**：自己测自己的 skill = 无效。上下文污染会让结果毫无意义
3. **总是逐字记录借口**：agent 的逐字原话就是理性化表的原材料，不要凭记忆复述
4. **总是分层思考**：入口/过程/约束/协作 — 即使只实现其中两层，分层思维帮你保持设计清晰

### 四个"永不"

1. **永不为假设的情况写规则**：只写 RED 阶段实际观察到的违规，不写"以防万一"
2. **永不把 description 写成摘要**：description 是索引，不是 TL;DR
3. **永不在没有测试的情况下编辑 skill**：编辑就是一次新的 RED → GREEN → REFACTOR
4. **永不跳过 REFACTOR**：第一次 GREEN 通过不代表 skill 完成了——那只是 agent 还没找到新的漏洞

---

## 完整案例：用这套方法论设计一个"数据库迁移"Skill 系统

让我们把方法论应用到一个完全不同的领域。

### 领域分析

**任务场景**：Agent 需要执行数据库迁移——schema 变更、数据回填、索引调整。

**步骤序列**：
1. 接收迁移需求 → 2. 设计迁移方案 → 3. 编写迁移脚本 → 4. 在 staging 验证 → 5. 执行生产迁移 → 6. 确认和回滚准备

**失败模式分析**（按风险排序）：

| 步骤 | 失败模式 | 风险 | 类型 |
|------|---------|------|------|
| 5. 执行生产 | 没有回滚方案就执行 | 极高：数据丢失 | 纪律 |
| 4. 验证 | 在 staging 跑了但没检查数据一致性 | 高：staging 和生产不一致 | 纪律 |
| 3. 编写脚本 | 写了不兼容的 ALTER（会导致锁表） | 高：生产停机 | 技能 |
| 2. 设计方案 | 遗漏了对大表的性能评估 | 中：迁移时间超预期 | 技能 |
| 5. 执行生产 | 不在低峰期执行 | 中：影响用户 | 纪律 |

### 架构设计

**约束层**（纪律问题 → 刚性规则类）：
```
NO PRODUCTION MIGRATION WITHOUT A VERIFIED ROLLBACK PLAN FIRST
```

**过程层**（流程问题 → 柔性技法类）：
```
design → staging-verify → pre-flight-check → execute → validate → cleanup
```

**协作层**（环境问题）：
```
- staging 环境验证 skill
- 迁移锁协调 skill（确保没有两个迁移同时跑）
```

### Iron Law 设计

```markdown
NO PRODUCTION MIGRATION WITHOUT A VERIFIED ROLLBACK PLAN FIRST

Execute migration before rollback plan? Stop. Write rollback plan. Test it. Then proceed.

**No exceptions:**
- Don't say "this migration is reversible by nature"
- Don't say "we can just restore from backup"
- Don't skip rollback verification because "it's obvious"
- A backup is not a rollback plan — a rollback plan is tested and timed
```

### 理性化表（来自 RED 阶段的实际借口）

```markdown
| 借口 | 现实 |
|------|------|
| "这个迁移很简单，不需要回滚方案" | 简单的迁移也可能意外删数据。Always。 |
| "有备份就够了" | 备份恢复可能需要2小时。回滚方案需要2分钟。 |
| "我在staging跑过了" | Staging没有生产数据量和并发。 |
```

### 红牌列表

```markdown
## Red Flags - STOP

- "这个迁移很简单"
- "不需要回滚方案"
- "备份就够了"
- "staging已经通过了"
- "这次不一样因为..."
- "只是加个索引" / "只是加个字段"

**All of these mean: Stop. Write and verify rollback plan first.**
```

---

## 总结：从 superpowers 学到的"元方法论"

Superpowers 教给我们的不是"这 14 个 skill 怎么用"，而是：

1. **Skill 是行为约束程序，不是文档**。把它当代码对待——有测试、有 CI、有迭代。
2. **任何规则都可以被绕过**。不是 agent 坏——是 agent 在压力下会找效率捷径。防绕过设计不是可选的。
3. **分层思考降低复杂度**。入口/过程/约束/协作——四层职责清晰，skill 不重叠、不冲突。
4. **TDD for 行为约束**。RED（不带 skill 看失败）→ GREEN（带 skill 验证）→ REFACTOR（关闭新漏洞）。这个循环是 skill 质量的基础。
5. **CSO 是所有设计的前提**。Skill 写得再好，agent 不加载就等于不存在。
6. **自指是所有元技能的终极目标**。Writing-skills 本身是通过 writing-skills 方法论创建的。你的"写 skill 的 skill"能做到自指吗？

**你现在不仅仅是理解了 superpowers——你掌握了创建类似系统的通用方法论。**

---

> **全文完。** 回到 [序章](#序章superpowers-解决了什么问题) 重新阅读，或访问 [知识图谱](/graph) 以交互方式探索 superpowers 的全貌。
