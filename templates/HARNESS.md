# HARNESS.md — Agent Constraint Document

> 任何 agent 打开本仓库,**先读本文档**。
> 这些约束高于一切个人偏好或临时判断。
> Last updated: <YYYY-MM-DD · <PROJECT> 启动时填>
> Authority: Director(经用户同意)。与 `CLAUDE.md` 不冲突时,本文优先

<!--
═══════════════════════════════════════════════════════════════════════
  这是 game-team-kit 的 HARNESS 通用骨架。
  HARNESS 是「全 agent 硬约束」文档:§1 硬规矩跨项目不变(方法论价值所在),
  §4/§5 阶段与 scope 是项目专属、由 <PROJECT> 启动时填。

  填写方式:
  1. 把所有 <PROJECT> / <平台> / <品牌> / <YYYY-MM-DD> 占位符替换为本项目实情。
  2. §1 硬规矩:原则上不删。层隔离规则(§1.5)按本项目的代码分层契约改写。
  3. §5 Scope 表:每锁定一项 scope,在这里记一行 + 对应 DEC-NNN。
  4. §6 文档索引:随团队工作台实际产出的文档增补。
  保留中文叙述 + 英文命令/占位符的写法(与本 kit 一致)。
═══════════════════════════════════════════════════════════════════════
-->

## §0 启动前 3 步(无例外)

任何 session 启动,无论 agent 角色:

1. 读 `team/director/kanban.md` — 当前 sprint 状态
2. 读 `team/director/decisions.md` 最近 5 条 — scope 边界
3. 读 `team/<your-agent>/persona.md` + `tasks.md` — 你的角色与任务

不做这 3 步就操作 = 违反 harness。

## §1 不可越线(Hard Rules)

> 本节是 kit 的方法论核心,跨项目稳定。新项目原则上整段保留,仅按需调整 §1.5 / §1.7。

### §1.1 不替用户改 scope
所有用户决策记在 `decisions.md`。任何 scope 变更必经用户。发现 scope 不可行 →
在 `team/director/kanban.md` 集成日记加一条,等 director / 用户回话,**不自行调整**。

### §1.2 不跨 agent 私下协作
跨角色协调走 director。不在你的 task 里直接修改别人的产物。
需协作 → 集成日记 append 一条,等 director 调度。

### §1.3 不私自 commit / push / PR
本仓库默认 dry 操作 — 改本地文件 OK,git commit / push / PR **必须等用户明确请求**。
pre-commit hook 失败 → 调查根因,不 `--no-verify`。

### §1.4 不 mutate `decisions.md` 已有条目
append-only。新决策 → 新 DEC-NNN,旧条目 Status 改 `superseded by DEC-MMM`,内容保留。

### §1.5 层隔离 — 不跨越本项目的代码分层契约
<!--
  <PROJECT> 启动时填:写明本项目的核心代码分层边界,违反即被对应 agent 拒收。
  这是把「领域专属正确性」固化进 harness 的关键一条。举例:
  - 游戏项目:`src/game/`(纯逻辑)不得 import `src/ui/`(DOM)。
  - 后端项目:`domain/` 不得 import `infra/`;handler 不得直接碰 DB driver。
  - 数据/ML 项目:训练代码不得 import 服务层;feature 计算与 serving 隔离。
  填好后把下面这行替换为本项目实情,并指向 CLAUDE.md 中对应的架构说明。
-->
**<层 A> ⟂ <层 B>**:`<dir-a>/` 不得 import `<dir-b>/`。工程基线,违反 = engine 拒收。
详见 `CLAUDE.md`「<对应架构小节>」。

### §1.6 不在 `archive/` 写新文件
`archive/` 是只读历史。新增内容 → 放对应 active 目录。
从 archive 取出文件做参考 OK;移回 active 需 director 决策 + 一条 DEC-NNN。

### §1.7 玩家/用户可见层的语言策略
<!--
  <PROJECT> 启动时填:用户可见文案的语言规则。源项目是「EN only」,
  非该约束的项目按实际改写或整条删除。保留「内部文档语言」一条以稳定团队工作台风格。
-->
- **用户可见**(产品 UI / 商店或落地页 / 法务 / 客服):**<语言策略,如 EN only>**(DEC-NNN)
- **内部**(team/* / 设计文档 / decisions.md / 代码注释):<内部语言,如中文继续>
- 如有遗留待迁移文案:记一条 DEC + 一个迁移 task,期间**不新增违规 string**

## §2 必做项(Mandatory)

### §2.1 任何 task 状态变化 → 更新 `tasks.md`
Now → Done。不留悬置 task。

### §2.2 任何方向性判断 → 加 DEC-NNN
判断标准:"未来 6 个月后的我,读到当前代码会不会困惑这选择"。会 → 加 DEC。
类型/接口/契约层面的变更尤其要 codify 成 DEC(下游 agent 据此对齐)。

### §2.3 任何跨 agent 联动 → 写集成日记
位置:`team/director/kanban.md` 的「集成日记」section,append-only。

### §2.4 提交前必须本地验证
不依赖"看起来对"。最低标准(<PROJECT> 启动时按本项目工具链填四命令):
- 代码改:`<build 命令>` + `<test 命令>` 双绿
- 用户可见改:`<run/dev 命令>` 实测(浏览器 / CLI / 端到端)
- 领域资产:在产品内实际加载验证

<!--
  四命令验证:本项目的 build / typecheck / test / run 四条命令在 CLAUDE.md「Commands」里钉死,
  本节引用即可。这是 detection-gate 的人工兜底层。
-->
参考 `superpowers:verification-before-completion` 技能。

## §3 目录契约(分类隔离)

<!--
  <PROJECT> 启动时填:列出本项目的真实目录及其状态(active / gitignored / READ-ONLY)。
  五大类是通用骨架:代码 · 资产 · 构建产物 · 团队工作台 · 文档 · 归档。
  非游戏项目把「资产」替换为本领域产物(如 migrations / models / fixtures)。
-->

| 类别 | 目录 | 状态 |
|---|---|---|
| **代码** | `<src/>` `<tests/>` | active |
| **资产 - production** | `<asset-pipeline/>` | active |
| **资产 - runtime** | `<public/ 或运行期目录>` | active |
| **构建产物** | `<dist/>` `<node_modules/ 等>` | gitignored |
| **团队工作台** | `team/` | active |
| **项目文档** | `docs/` `<设计文档>` `CLAUDE.md` `HARNESS.md` | active |
| **历史归档** | `archive/` | READ-ONLY(§1.6) |

## §4 当前阶段速览

<!--
  <PROJECT> 启动时填:写当前 Phase / Sprint 的主线 + 并行支线 + 时间窗。
  随 sprint 推进刷新(本节是少数会频繁更新的段落)。
-->

**Phase <N> · <阶段名>**(<起始日> → <结束日>,~<时长>)
- 主线:<主线任务,如 engine 核心抽象 ENG-001/002/003>
- 并行:<并行支线 + 各 agent Sprint 启动状态>
- 详见 `team/director/kanban.md`

## §5 锁定的 Scope(<YYYY-MM-DD · 持续追加>)

<!--
  <PROJECT> 启动时填:这张表是「用户已拍板、不许 agent 私改」的 scope 清单。
  每行一项维度 + 状态 + 对应 DEC。下面给的是通用维度模板(混合软件/游戏例子),
  按本项目删改。每锁定一项就追加一行,并在 decisions.md 写对应 DEC-NNN。
-->

| 维度 | 状态 | DEC |
|---|---|---|
| 平台 / 运行环境 | `<如 Web / Mac+Win / iOS>` | DEC-NNN |
| 打包 / 部署方式 | `<如 Tauri / Docker / 静态托管>` | DEC-NNN |
| 用户可见语言 | `<如 EN only>` | DEC-NNN |
| 内容 / 功能规模 | `<如首版 N 个核心单元,可扩展>` | DEC-NNN |
| 数据 / 存储 | `<如 localStorage / Postgres,无云同步>` | DEC-NNN |
| 交互方式 | `<如 键鼠 / 触屏 / API only>` | DEC-NNN |
| 发行 / 交付主体 | `<如 个人 / 团队>` | DEC-NNN |
| 定价 / 商业模式 | `<如 一次性 / 免费 / 订阅>` | DEC-NNN |
| 投入强度 | `<如 全职 / 兼职>` | DEC-NNN |
| 交付节点 | `<如 不锁日,内部参考 YYYY-MM>` | DEC-NNN |
| 产品名 / 品牌 | `<PROJECT 品牌名>` | DEC-NNN |
| 核心方向 / USP | `<本项目核心卖点>` | DEC-NNN |
| 风格 / 设计方向 | `<视觉 / 体验方向>` | DEC-NNN |

## §6 重要文档索引

<!--
  <PROJECT> 启动时填:随团队工作台实际产出增补。下面是通用骨架,
  director/* 下的常驻文档(roadmap / kanban / decisions / handoff-protocol / active-board)
  是 kit 的标准件,建议保留。
-->

| 文件 | 用途 |
|---|---|
| `CLAUDE.md` | Claude Code 代码层约定 |
| `HARNESS.md` | 本文 — 全 agent 约束 |
| `<设计 / 复盘文档,如 MVP.md>` | <项目当前态 / 复盘> |
| `team/README.md` | 团队工作台说明 |
| `team/director/roadmap.md` | 总路线图 |
| `team/director/kanban.md` | 当前 sprint 看板 + 集成日记 |
| `team/director/decisions.md` | 决策日志(DEC-001 起,append-only) |
| `team/director/handoff-protocol.md` | Director 派工 → Agent 执行 标准流程 |
| `team/director/active-board.md` | 全队实时状态板(in-flight / done / blocked + 命令) |
| `team/director/phase-sprint-plan.md` | **常驻**:Phase × Sprint 节奏 + 每 Sprint 末用户可见物 |
| `team/director/agent-performance-review.md` | **常驻**:agent 绩效 + 反馈,每 Sprint 末刷新 |
| `team/<agent>/persona.md` | 角色定义 |
| `team/<agent>/tasks.md` | 角色 task 看板 |
| `archive/README.md` | 归档说明 |
