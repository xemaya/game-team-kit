# Active Board — game-team-kit

> 这个仓自托管(dogfooding):裸 `claude` = director,开局自动看到这块 backlog。
> Last refreshed: 2026-06-01(P0 机器 gate 范例 + P1 README 去浮夸 完成)

## 🔜 backlog(源自外部 AI review · GitHub issue #1)

外部 AI 评 kit「名不副实」:本质 = markdown SOP + 47 行 hook;**方法论灵魂「机器 gate」kit 里 0 实现**。用户认可。按优先级修:

| P | 任务 | 内容 | 状态 |
|---|---|---|---|
| **P0** | **补真机器 gate 范例** | ~~把 combo-hopper solver 当范例 + 通用骨架~~ → **DONE**:`examples/gates/` 落 4 类**零依赖可真跑**范例(domain-audit solver / schema·不变量 / API 契约 snapshot / e2e console-probe),各带 gate 自验测试(19/19 过)。methodology §4 已链过去。**灵魂从文字变可执行**(DEC-002) | ✅ done |
| **P1** | README 去浮夸 | **DONE**:副标题改「SOP+脚手架,非一键工具」· 《先看:适合你吗?》提到全文最前(「别用」四条前置)· 软约束 ⚠️ 诚实标注 · 删底部重复段 · 链入 examples/gates(DEC-003) | ✅ done |
| **P2** | hook 自测 | inject-role.sh + bootstrap 0 测试;给 hook 一个 smoke test | ⬜ todo |
| **P3** | 非游戏角色模板 | 9 角色太游戏化;给 backend/data/ml/devops 的 persona+agent.md 变体 | ⬜ todo |

**固有限制(诚实标注 · 非 bug)**:§8 除 hook 外全软约束(靠 director 自觉)· 多 agent 协调开销对单人/小项目 > 收益(methodology.md 已认,README 该前置)。

> 详见 GitHub issue #1:https://github.com/xemaya/game-team-kit/issues/1
> 开工:`gh issue list` 扫 issues → 按 P0→P3 改 → 改完更新 issue + 本 board。

## ✅ 已完成

- 2026-06-01 仓初始化(模板 + skill + bootstrap + 9 persona/agent + hook)· 公开发布 github.com/xemaya/game-team-kit · SKILL 改"先聊产品再推荐栈+角色"。
- 2026-06-01 自托管 director(根 .claude/ + 本 board)—— 让下个 session 一进来就知道 backlog。
- 2026-06-01 **P0 机器 gate 范例落地**:`examples/gates/`(4 类 · Node22 原生 TS · 零安装 · 19 自验测试)+ methodology §4 双向链 + DEC-002。issue #1 P0 关。
- 2026-06-01 **P1 README 去浮夸**:定位改「SOP+脚手架,非一键」· 适用/不适用前置 · 软约束诚实标注(DEC-003)。issue #1 P1 关。

## 集成日记

- 2026-06-01 · 外部 AI review → 用户认可 → 落 issue #1 + 自托管 director。教训:**只在对话里说的会丢;写进 board/issue/decisions 才活**。
