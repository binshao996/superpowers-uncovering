# using-git-worktrees

## 解决的痛点

在一个分支上做一半，突然需要切回 main 修紧急 bug。stash → 切换 → 修完 → 切回来 → pop → 冲突。

## 核心工作流

1. 为 feature 工作创建独立的 git worktree
2. 每个 worktree 有独立的工作目录和分支
3. 不需要 stash/checkout/冲突解决
4. 完成后清理 worktree

## 关键设计决策

### "隔离而非切换"

worktree 的核心思想：不是在不同分支间切换，而是让不同分支同时存在。这从根本上消除了 stash/pop 的痛点。

### "与 subagent 协作"

每个 subagent 可以拥有自己的 worktree，彻底隔离文件系统操作。这也是 executing-plans 推荐的前置步骤。

## 与其他 skill 的协作关系

- **嵌入者**：executing-plans、subagent-driven-development（隔离工作环境）
- **协作技能**：finishing-a-development-branch（清理 worktree）
