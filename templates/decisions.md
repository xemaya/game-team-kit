# Decision Log

> 所有影响后续工作方向的决策,**append-only**。
> 改决策不 edit 旧条 —— 新增一条 superseding,并在旧条 Status 标 `superseded by DEC-NNN`。
> 编号单调递增(DEC-001, DEC-002, ...)。Director 维护,任何方向性判断必入此处。
>
> **为什么 append-only**:决策的「为什么」和「演化轨迹」本身是 kit 的资产。edit 掉旧决策 = 抹掉团队的推理过程,后来者(含 AI agent)会重复踩坑。保留 superseded 链 = 可追溯。
>
> **什么该进这里**(不止「重大」决策):
> - scope / 时间线 / 大方向变更
> - 跨 agent 冲突的裁决
> - 架构 / 技术选型(层边界、registry、构建链)
> - 流程 / process 改进(见 handoff-protocol §8 金条款)
> - **类型 / 契约变更**(改了共享类型 → codify 一条 DEC,防其它 agent 不知情)
> - 领域专属正确性 gate 的设立(如「内容改动必过 X 审计」)

---

<!-- 新决策追加在此线之上方、最新在最上(倒序),或最新在最下(顺序)—— 全队统一一种,别混。下方为模板,复制使用。 -->

## DEC-NNN · <一句话标题>(<日期>)
- Date: YYYY-MM-DD
- Status: accepted | superseded by DEC-NNN | rejected | parked
- 上下文:<为什么需要这个决策 · 触发它的问题 / 痛点 / 用户输入>
- 决定:
  - <具体决定 1>
  - <具体决定 2>
- 后果:
  - <这个决定带来什么 · 谁要改什么 · 有哪些已知 trade-off / 风险>
- 关联:<相关 DEC 编号 / task / 文件路径 / persona>

---

## DEC-001 · <示例:本项目的层架构边界>(YYYY-MM-DD)
- Date: YYYY-MM-DD
- Status: accepted
- 上下文:<把第一条真实决策填在这里,删除本示例>
- 决定:
  - <...>
- 后果:
  - <...>
- 关联:<...>
