# Active Board

> Director 维护的全队实时状态板。**这是「现在发生什么」的快照**,粒度比 kanban 细。
> 与 kanban 的分工:kanban = Sprint 级泳道(Backlog→Done);active-board = 当下在飞的 task + 验收实录 + 集成日记。小项目可只用一个,二者择一。
>
> 用法:
> - 每次 director session 开头刷新顶部 `Last refreshed` 行(日期 + 一句话当前态)。
> - task 状态用 emoji 速记:🟢 进行中 / ⏳ 等待(阻塞/等用户) / ✅ 验收 PASS / 🔴 blocked / 🅿️ parked。
> - 验收 PASS 的 task 把**关键机器证据**贴进来(测试数 / tsc / build / 领域 gate 结论)—— 见 handoff-protocol §8 验收 SOP。

Last refreshed: <YYYY-MM-DD>(<一句话当前态>)

---

## 🟢 In-Flight(正在做)

> 当前已派出、agent 正在做或刚 handback 待验收的 task。

| Task | Owner | Status | 关键信息 / handoff |
|---|---|---|---|
| <TASK-001> | <role> | 🟢 doing | <handoff doc 路径 / 一句话> |

---

## ✅ Recently Done(近期验收 PASS)

> 验收通过的 task + 机器证据。滚动保留最近若干条,旧的归档到 kanban Done。

| Task | audit | 关键证据(测试 / tsc / build / 领域 gate) |
|---|---|---|
| <TASK-000> | ✅ | <`npm test` N/N · tsc 0 err · build OK · <领域 gate 结论>> |

---

## 🔴 Blocked / ⏳ Waiting

> 卡住的 task + 卡在什么上(等用户决策 / 等上游 agent / 等外部资源)。

| Task | Owner | 卡在 | 解法 / 下一步 |
|---|---|---|---|
| <TASK-002> | <role> | <等 DEC-NNN / 等 X agent 交付> | <...> |

---

## 🅿️ Parked(暂搁)

> 有价值但本 Sprint 不做的。记一笔免遗忘。

- <想法 / task · 为什么 park · 何时重审>

---

## 📓 集成日记(Integration Log)

> 验收时的关键观察、跨 task 的集成结论、踩到的坑、临时偏差(AC 偏差是否 reject)。
> 这是 retro 的素材来源。每条带日期。

- <YYYY-MM-DD> <一句话:谁验了什么 / 发现什么 / 怎么处理>
