# writing-plans

## 解决的痛点

有设计文档但不知道从哪里开始写代码。实现时范围逐渐扩大（scope creep）。任务太粗糙导致 agent 执行走样。

## 核心工作流

1. 读取设计文档，理解完整需求
2. 设计文件结构——哪些文件创建/修改，每个职责是什么
3. 将工作分解为 2-5 分钟的任务（"写失败测试""运行验证失败""写最小实现""运行验证通过""提交"）
4. 每个任务包含：精确文件路径、完整代码、精确命令及预期输出
5. 自查（覆盖范围、占位符、类型一致性）
6. 保存到 `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`

## 关键设计决策

### "假设工程师零上下文"

编写计划时假设执行者完全不了解项目代码库和工具集——每个文件路径、每行代码、每个命令都必须显式给出。这确保了 plan 可以被 subagent 或其他 session 可靠执行。

### "无占位符"

TODO、TBD、"适当补充错误处理"——这些都是 plan 的失败模式。每一个步骤都必须包含实际内容。同样的代码在不同任务中出现就重复写，因为执行者可能不按顺序读。

### "文件结构先于任务分解"

在定义任务之前先设计文件结构。这是分解决策被锁定的地方。每个文件应该有明确的职责边界。

## 防理性化机制

写计划是一种纪律——没有铁律就无法强制执行。但全流程中对 plan 的格式化要求（精确路径、完整代码、命令+预期输出）本身就是一种防偷懒机制。

## 与其他 skill 的协作关系

- **前置 skill**：brainstorming（设计文档输入）
- **后置 skill**：executing-plans / subagent-driven-development
- **协作 skill**：verification-before-completion（计划自查阶段）

## 原始 SKILL.md 精读

> "Assume they are a skilled developer, but know almost nothing about our toolset or problem domain."

这是 plan 质量的核心标准。不是写给"理解上下文的人"看的，是写给"完全不了解项目的人"看的。
