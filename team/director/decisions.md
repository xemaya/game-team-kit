# Decision Log — game-team-kit

> 所有影响后续方向的决策,append-only。改决策不 edit,新增一条 superseding。

---

## DEC-001 · kit 自托管 director(dogfooding · 2026-06-01)
- Date: 2026-06-01
- Status: accepted
- 上下文:外部 AI review 落 issue #1,但 issue 不在 SessionStart 注入面里 → 新 session 不知道要优化 kit。
- 决定:给本仓根 `.claude/`(settings 默认 director + director agent + inject hook)+ `team/director/active-board.md`(seed issue #1 backlog)。裸 claude = director,开局自动看到 backlog。
- 后果:kit 用自己的方法论维护自己;持续性靠文件(board/decisions/issue)不靠记忆。

## 模板
\`\`\`
## DEC-NNN · <title>
- Date / Status / 上下文 / 决定 / 后果 / 关联
\`\`\`
