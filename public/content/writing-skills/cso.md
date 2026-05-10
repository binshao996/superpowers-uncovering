## CSO (Claude Search Optimization) — 如何让 AI 找到你的 Skill

CSO 是 writing-skills 最精妙的设计之一。它的核心洞察：**skill 写得再好，如果 agent 不加载它，等于不存在**。

### 五条核心规则

#### 1. Description 只写触发条件，绝不写工作流

这是被实际测试验证过的关键设计。当 description 包含工作流摘要时，agent 会直接按 description 行动而不加载 skill 正文。

```yaml
# 错误：包含了流程摘要
description: Use for TDD - write test first, watch it fail, write minimal code, refactor

# 正确：只有触发条件
description: Use when implementing any feature or bugfix, before writing implementation code
```

**原理**：description 是"我该不该读这个 skill"的判断条件，不是"这个 skill 做什么"的摘要。把 description 想象成索引，不是 TL;DR。

#### 2. 关键词覆盖

使用 agent 会搜索的词：
- 错误消息："Hook timed out", "ENOTEMPTY"
- 症状："flaky", "hanging", "zombie"
- 同义词："timeout/hang/freeze", "cleanup/teardown/afterEach"
- 工具名：实际命令、库名、文件类型

#### 3. 描述性命名

- 主动语态，动词优先
- `creating-skills` 不是 `skill-creation`
- `condition-based-waiting` 不是 `async-test-helpers`
- 用核心洞察命名，不用分类名

#### 4. Token 预算意识

经常被加载的 skill（如 getting-started）目标 < 150 词。其他 skill < 500 词。

- 压缩示例：一个优秀的例子胜过多个平庸的
- 用交叉引用替代重复：`**REQUIRED BACKGROUND:** Use superpowers:xxx`
- 不要用 `@path/to/skill` 强制加载（会立即消费 200k+ 上下文）

#### 5. 交叉引用格式

```markdown
# 正确
**REQUIRED BACKGROUND:** You MUST understand superpowers:systematic-debugging

# 错误
@skills/testing/test-driven-development/SKILL.md
```
