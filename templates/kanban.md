# Kanban

> Director 维护的 Sprint 级看板。**这是「这个 Sprint 要做什么、做到哪」的泳道视图**。
> 与 active-board 的分工:kanban = Sprint 目标 + 泳道(Next/In Progress/Done);active-board = 当下逐 task 的飞行 + 验收实录。小项目可只用其一。
>
> 用法:
> - Sprint 开始定 `当前 Sprint 目标`(1-2 句可验收的目标,从 roadmap 取)。
> - task 在泳道间左→右移动:Backlog → Next → In Progress → Done。
> - Done 列只放本 Sprint 完成的,过 Sprint 切换 checklist 后归档。

## 当前 Sprint:<Sprint N>（<起 - 止日期>）

**Sprint 目标**:<1-2 句 · 可验收 · 服务 roadmap 的哪个 milestone>

---

## 🔵 In Progress

> WIP 上限建议 = agent 数或更少。一个 task 一行。

| Task | Owner | 备注 |
|---|---|---|
| <TASK-001> | <role> | <...> |

---

## 🟡 Next(本 Sprint 排队)

> 已规划进本 Sprint、还没开工的。

| Task | Owner | 依赖 |
|---|---|---|
| <TASK-002> | <role> | <等 TASK-001 / 等 DEC-NNN> |

---

## ⚪ Backlog

> 想做但未进 Sprint 的。粗粒度即可。

- <TASK-XXX> · <一句话> · <owner 倾向>

---

## ✅ Done(本 Sprint)

| Task | Owner | 验收证据 |
|---|---|---|
| <TASK-000> | <role> | <测试 N/N · tsc 0 · build OK · 领域 gate · 见 active-board 集成日记> |

---

## 📓 集成日记(Integration Log)

> 跨 task 的集成观察 / 坑 / 偏差。retro 素材。每条带日期。

- <YYYY-MM-DD> <...>

---

## 🔁 Sprint 切换 checklist

Sprint 结束、切下一个时,director 走一遍:

1. [ ] Done 列所有 task 已验收 PASS(机器 gate 绿 · 见 handoff-protocol §8)
2. [ ] 未完成 task 决定:滚入下个 Sprint / 回 Backlog / 砍掉(记 DEC 若涉及方向)
3. [ ] 本 Sprint 集成日记 → 写一份 retro(`sprint-N-retro.md`)
4. [ ] retro 里的 process 改进 → 该升格的写进 handoff-protocol §8 / decisions.md
5. [ ] 从 roadmap 取下个 Sprint 目标,清空泳道,归档 Done 列
6. [ ] 各 agent persona 的「当前焦点」更新到新 Sprint
7. [ ] milestone / Phase 边界:做一次 retrospective + 给用户准备 roadmap 调整选项
