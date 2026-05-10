# verification-before-completion

## 解决的痛点

"应该可以了""看起来没问题""上次跑通了"——基于假设宣布完成，而不是基于证据。

## 核心工作流

1. 在做出任何完成声明前，问：什么命令能证明这个声明？
2. 运行完整命令（重新跑，不用缓存结果）
3. 读取完整输出，检查退出码，数失败数量
4. 输出是否真的证实了声明？
   - 否 → 报告实际状态 + 证据
   - 是 → 报告声明 + 证据
5. 只有这时才能做声明

## 关键设计决策

### "跳过任何一步 = 欺骗"

不是效率问题，是诚信问题。系统提示中记录了来自 24 条失败记忆的教训——用户说"我不信你"，信任破裂。

### "新鲜验证，不用缓存"

上次跑的结果不算。编译器和测试在上次跑和现在之间可能已经有了不同的输入。必须重新运行。

### "禁止模糊措辞"

"should work" "probably" "seems to"——这些都是撒谎的信号。只允许：命令 + 输出 + 结论。

## 防理性化机制

"这次例外""我太累了""agent 报告成功了所以应该没问题"——对疲惫和压力下的理性化尤其警惕。专门点出"tired and wanting work over"作为红牌。

## 与其他 skill 的协作关系

- **横切嵌入**：被 brainstorming、writing-plans、executing-plans、TDD 等几乎所有 skill 引用
- **触发面最广**：任何形式的完成/成功声明都会触发

## 原始 SKILL.md 精读

> "Claiming work is complete without verification is dishonesty, not efficiency."

这不是流程要求，是诚信要求。superpowers 的设计哲学中，verification 是最底层的纪律约束。
