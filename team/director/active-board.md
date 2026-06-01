# Active Board — game-team-kit

> 这个仓自托管(dogfooding):裸 `claude` = director,开局自动看到这块 backlog。
> Last refreshed: 2026-06-01(仓创建 + 自托管 director · 接外部 AI review)

## 🔜 backlog(源自外部 AI review · GitHub issue #1)

外部 AI 评 kit「名不副实」:本质 = markdown SOP + 47 行 hook;**方法论灵魂「机器 gate」kit 里 0 实现**。用户认可。按优先级修:

| P | 任务 | 内容 | 状态 |
|---|---|---|---|
| **P0** | **补真机器 gate 范例** | 把 combo-hopper 的 `tools/solver.ts`(关卡通关求解器)当范例放进 `examples/gates/` + 给通用骨架(schema 校验 / API contract snapshot / e2e console-error probe 模板)。**这条补完,灵魂才落地** | ⬜ todo |
| **P1** | README 去浮夸 | quickstart 老实说"SOP+脚手架,非一键工具";「适用/不适用」提到最前(单人/单领域/纯审美验收/没想清需求=别用) | ⬜ todo |
| **P2** | hook 自测 | inject-role.sh + bootstrap 0 测试;给 hook 一个 smoke test | ⬜ todo |
| **P3** | 非游戏角色模板 | 9 角色太游戏化;给 backend/data/ml/devops 的 persona+agent.md 变体 | ⬜ todo |

**固有限制(诚实标注 · 非 bug)**:§8 除 hook 外全软约束(靠 director 自觉)· 多 agent 协调开销对单人/小项目 > 收益(methodology.md 已认,README 该前置)。

> 详见 GitHub issue #1:https://github.com/xemaya/game-team-kit/issues/1
> 开工:`gh issue list` 扫 issues → 按 P0→P3 改 → 改完更新 issue + 本 board。

## ✅ 已完成

- 2026-06-01 仓初始化(模板 + skill + bootstrap + 9 persona/agent + hook)· 公开发布 github.com/xemaya/game-team-kit · SKILL 改"先聊产品再推荐栈+角色"。
- 2026-06-01 自托管 director(根 .claude/ + 本 board)—— 让下个 session 一进来就知道 backlog。

## 集成日记

- 2026-06-01 · 外部 AI review → 用户认可 → 落 issue #1 + 自托管 director。教训:**只在对话里说的会丢;写进 board/issue/decisions 才活**。
