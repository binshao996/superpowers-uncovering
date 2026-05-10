# systematic-debugging

## 解决的痛点

看到 bug → 猜原因 → 改代码 → bug 还在 → 再猜。这种"打地鼠"式调试在复杂系统中效率极低。

## 核心工作流

systematic-debugging 提供了三个递进的调试技术：

1. **condition-based-waiting**：不用 sleep(1000)，等待条件满足。处理时序问题——等待真正的原因（条件）而不是等待时间。
2. **root-cause-tracing**：不从症状直接跳到修复。沿着调用链逐层向上追溯，找到最初的触发点。
3. **defense-in-depth**：不在表面修 bug。修复根因 + 添加验证（测试/断言）防止复发 + 考虑同类问题是否在其他地方存在。

## 关键设计决策

### "技术是语言无关的"

condition-based-waiting 不是 setTimeout vs Promise vs asyncio——它是等待条件而非时间的思维模式。skill 的触发描述刻意避免使用语言特定的症状词。

### "三个技术递进使用"

不是并列选择——先掌握 condition-based-waiting，然后 root-cause-tracing，最后 defense-in-depth。每个技术都以前一个为基础。

## 防理性化机制

"加个 setTimeout 就行了""重启一下应该能好"——这些都是打地鼠，不是调试。skill 用具体的技术替换这些条件反射。

## 与其他 skill 的协作关系

- **被嵌入者**：TDD 流程中分析测试失败时触发
- **协作 skill**：verification-before-completion（验证修复）
