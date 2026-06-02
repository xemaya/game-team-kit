# Decision Log — game-team-kit

> 所有影响后续方向的决策,append-only。改决策不 edit,新增一条 superseding。

---

## DEC-004 · 合并 image-work-flow 思想:资产域「锚定—派生」纳入方法论(不搬工具) · 2026-06-02
- Date: 2026-06-02
- Status: accepted
- 上下文:用户要把 sibling 仓 `image-work-flow`(Manus 同款两阶段生图 CLI · Python · DeerAPI · 54 测试)的工作流「总结合并」进 kit。核心诉求是**思想**(根据游戏风格出概念图 → 派生角色图 → 资产不跑偏),非搬代码。
- 判断:image-work-flow 的反漂移机制 = kit 防漂移三件套 + 机器 gate 在**视觉资产域**的同构实例。映射:概念锚图≈decisions.md(宪法)· 每张重申不变量≈append-only 记忆 · 两阶段探索→生产≈DD-first/scope 锁 · anchor.md 机器抽取+人工 checkpoint≈视觉 detection-gate · manifest schema/chroma 残留/lock hash≈机器 gate+记账。
- 决定:
  1. **不把 Python 工具/CLI 细节(成本表、flag、chroma 阈值)搬进 kit** —— kit 是工具无关的 SOP 脚手架。只蒸馏可迁移思想。
  2. 新 SOP 文档 `workflow/asset-pipeline.md`(与 bootstrap-studio.md 平级):两阶段 + 锚定派生 + 重申不变量 + 一致性 gate,工具无关;`image-work-flow` 仅作「参考实现」末尾引用。换任何生图后端套路不变。
  3. methodology.md §4 加子节「资产一致性 gate:锚定—派生」,把它接回防漂移哲学(思想层,链向 workflow 文档)。
  4. 更新 art persona + art agent 模板,把 concept→asset 锚定工作流写进角色协议(方向锁 raise DEC、探索→生产、anchor 人工 checkpoint、同框比对 gate)。
- 后果:kit 多一个「资产域」防漂移实例,art 角色从抽象 persona 变成有可执行 SOP。强调四点不变量(两阶段 / 锚定派生 / 重申不变量 / 一致性 gate)即可换后端。
- 关联:`workflow/asset-pipeline.md`、methodology.md §4、templates/personas/art.md、templates/.claude/agents/art.md、sibling 仓 image-work-flow。

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
