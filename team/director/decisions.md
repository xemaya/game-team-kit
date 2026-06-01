# Decision Log — game-team-kit

> 所有影响后续方向的决策,append-only。改决策不 edit,新增一条 superseding。

---

## DEC-003 · README 定调:「SOP+脚手架,非一键工具」+ 软约束诚实标注 · 2026-06-01
- Date: 2026-06-01
- Status: accepted
- 上下文:issue #1 P1。外部 AI 评 README 浮夸(「开一家工作室把项目交付出来」「一键复用」),且把「适用/不适用」埋在底部 → 读者读完一堆吹捧才发现自己根本不该用。
- 决定(定位基线,后续编辑须守):
  1. **定位 = SOP + 脚手架,显式声明「不是一键工具 / 不替你写代码」**;副标题即点明。删「开工作室交付」「一键展开/复用」等话术。
  2. **《先看:适合你吗?》提到全文最前**(第二段),「别用」四条(单人小事 / 纯审美 / 没想清需求 / 单一领域无法并行)前置,让人先自我筛选再读细节。底部旧段删除,只留指回开头的一行。
  3. **软约束诚实标注**:加一条 ⚠️「除 SessionStart hook 外多数约束是软约束(靠 Director 自觉),降低跑偏概率不消除」。
  4. 链入 P0 的 [`examples/gates/`](机器守门一行 + 目录导览 + 表格)。
- 后果:README 从「推销」转「劝退式诚实」,与 methodology §「适合/不适合」一致。未来若有人想加营销话术,以本 DEC 为否决依据。
- 关联:issue #1 P1、methodology.md §「适合/不适合」、DEC-002。

## DEC-002 · 机器 gate 范例 = 自包含 + 可真跑(零安装)· 2026-06-01
- Date: 2026-06-01
- Status: accepted
- 上下文:issue #1 P0 —— methodology §4 把 4 类机器 gate 讲得很清楚,但 kit 里 **0 可跑代码**,这是「名不副实」的根。P0 原话「把 combo-hopper 的 solver.ts 放进来」。但 combo-hopper 的 solver 依赖其整套 game engine(`src/game/*`),直接搬进来 = 把外部项目耦合塞进通用 kit。
- 决定:
  1. **不直接搬 combo-hopper 代码**,而是照其 solver 的**模式**(turn-boundary BFS + 穷举 + 「连工具自身也要先被验证」)重写一个**自包含迷你关卡求解器**当范例(combo-hopper 的真 solver 仅在范例 README 里作引用案例)。
  2. 范例栈选 **Node 22 原生 TS 擦除 + `node --test`**:`node audit.ts` / `node --test *.test.ts` 零依赖零安装即跑。避免范例自己变成「又一堆没跑过的 markdown」。
  3. `examples/gates/` 覆盖 methodology §4 的 4 类:领域正确性 audit(centerpiece)/ schema·不变量校验 / API 契约 snapshot / e2e console-error probe。每类都带 **gate 自验测试**(证明它能识别已知 good + 已知 bad)。
- 后果:kit 的「灵魂」从文字变成可执行证据;读者 clone 即可 `node examples/gates/domain-audit/audit.ts` 看见机器门跑绿/跑红。
- 关联:issue #1 P0、methodology.md §4、combo-hopper `tools/solver.ts`(GAME-017)。

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
