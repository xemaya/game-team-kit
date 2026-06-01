---
name: bootstrap-studio
description: 为一个新项目快速展开「AI 多 agent 虚拟工作室」工作流(director 派工闭环 + 9 角色 + HARNESS 硬约束 + decisions 纪律 + SessionStart 注入 hook)。当用户说「启动 AI 工作室 / setup studio / bootstrap multi-agent project / 把这套工作流搬到新项目 / 给这个项目配 director+agents / 展开虚拟工作室」时触发。功能:interview 项目需求 → 选角色 → 从 templates/ scaffold 进新项目 → 定制 HARNESS/角色集/验证命令 → 给出第一步开工命令。
---

# Bootstrap Studio — 给新项目展开 AI 多 agent 工作室

这个 skill 把一套**已在真实项目跑通的**「AI 虚拟工作室」方法论,在一个**新项目**里快速展开成可直接开工的目录骨架 + 角色 + 流程。

> **方法论一句话**:一个固定的 **director**(总监,只派工/验收/不写码)把目标拆成 handoff doc,用户用 `claude --agent <role>` 开各角色 session 执行,director 按 §8 硬性 process 验收闭环。所有 scope 决策走 `decisions.md`(append-only),所有跨域协调走 director,机器可验证的正确性用「gate」卡死。
>
> 完整背景见 kit 内 `docs/methodology.md`;本 skill 的 step-by-step 落地版见 kit 内 `workflow/bootstrap-studio.md`(本 SKILL 是它的可调用封装)。

## 何时用 / 不用

- **用**:新仓库或现有仓库**第一次**要引入这套多 agent 工作流;或把方法论从一个项目搬到另一个项目。
- **不用**:已经有 `team/` + `.claude/agents/` 的项目(那是日常派工,直接进 director session,不用 bootstrap)。

## 三阶段

### 阶段 1 · 先聊产品,再据产品推荐配置(顺序很重要:别上来就问技术栈/角色)

> 核心原则:**用户往往还没想清楚要做什么,更不知道该用什么栈、配哪些人。** 所以 director 先当「创意搭档」把产品聊透,再当「技术负责人」据产品**推荐**技术栈和员工(角色)——是 director 提案、用户拍板,不是甩一堆问题让用户填。

**1a · 先把「要做什么」聊清楚(产品本身 · 开放对话,不是填表)**

先聊产品、不聊实现:
- **做什么**(游戏:什么类型 / 核心玩法循环 / 一句话卖点 USP;其它产品:解决什么问题 / 给谁用)
- **手感与风格 / 美术方向**(游戏尤其重要:像素 / 3D / 手绘 / 某种材质质感…;参考作品)
- **规模与目标平台**(单机 or 联网 · web / 桌面 / 移动 · 内容体量大概多大)
- **差异化、灵感来源、必须有的 / 绝不做的**

> 聊到你能用一两句话复述「这是个啥」并让用户点头,再往下。**这一步常常正是用户靠它才想清楚要做什么——别跳过去直接问技术栈。**

**1b · director 据产品「推荐」技术栈 + 角色 + gate + 层隔离(提案,用户拍 · 不是问用户要)**

基于 1a 聊出的产品,director **主动给建议**(每条带一句「为什么」+ 必要时给 a/b 选项),用户确认或改:

- **技术栈 + 验证命令**(据产品类型推荐):
  - 例:2D 网页小游戏 → Vite + TS + vitest(+ GSAP 动画),web-first;数据/ML 管线 → Python + pytest + mypy;CLI 工具 → 对应语言 + 其测试。
  - 给出:测试命令 / 类型检查 / 构建 / e2e(可无)。**已有仓先自动探测**(`package.json` scripts、`Cargo.toml`、`pyproject.toml`、`Makefile`)再确认。
- **角色集**(据产品从默认 9 角色增删 + 说明为什么):
  - 默认:`director · engine · ux · art · content · gameplay · qa · release · audio`
  - 例:纯前端小游戏多半全留;纯后端服务砍掉 `art/audio/gameplay`,加 `backend / data / devops`;库/CLI 可能只要 `director/engine/qa/release/docs`。
  - `director` + `engine`(或同义)+ `qa` 几乎总保留;**`director` 永远保留且唯一**。
- **领域专属「正确性 gate」**(§8 机器 gate 理念):据产品找「能机器卡死、不靠肉眼」的核心正确性。
  - 例:游戏「关卡必须可通关」→ `audit` 命令;数据管线「schema 必须校验」→ `validate`;web「无控制台 error」→ e2e console probe。
- **层隔离铁律**(HARNESS §1 项目专属硬规):据产品定「哪两层必须单向依赖」。
  - 例:游戏 `逻辑层 不得 import UI 层`;web `业务/core 不得 import 框架/视图层`。
- **硬 scope**(据产品列,锁进 HARNESS §5):平台 / 语言策略 / 内容规模 / 不做什么 / 发布目标 / 时间线 —— 每条对应一条初始 `DEC-NNN`。

**1c · 回读确认**:把推荐整理成一张小表(产品一句话 / 技术栈 / 验证命令 / 角色集 / gate 命令 / 层隔离规则 / scope 行),**回读给用户拍板,再进阶段 2 scaffold**。

### 阶段 2 · Scaffold(从 templates/ 拷进新项目并定制)

源 = 本 kit 的 `templates/`;目标 = 新项目根(下记 `$PROJ`)。逐项拷贝 + 按 interview 定制:

| 拷什么(从 templates/) | 落到 $PROJ | 定制动作 |
|---|---|---|
| `HARNESS.md` | `$PROJ/HARNESS.md` | 填 §5 scope 表(阶段1.4)· 填 §1 层隔离硬规(1.6)· 填 §2.4 验证命令(1.2)· 填 gate(1.5)· 改阶段速览为「Sprint 0」 |
| `handoff-protocol.md` | `$PROJ/team/director/handoff-protocol.md` | 多为通用,§0 角色边界按选定角色集裁;§8 全保留(这是方法论核心) |
| `decisions.md` | `$PROJ/team/director/decisions.md` | 把每条 scope 写成 DEC-001..N(append-only 起点) |
| `active-board.md` | `$PROJ/team/director/active-board.md` | 留空骨架 |
| `kanban.md` | `$PROJ/team/director/kanban.md` | 留空骨架 + 「集成日记」section |
| `personas/<role>.md` | `$PROJ/team/<role>/persona.md` | **只拷选定的角色**;每份 persona 顶部填项目专属「不归我管」边界 |
| (新建空) | `$PROJ/team/<role>/tasks.md` | 每角色空 task 看板(Now / Next / Done)|
| (新建空目录) | `$PROJ/team/<role>/notes/` | handoff doc 落地处 |
| `.claude/settings.json` | `$PROJ/.claude/settings.json` | 保持 `{"agent":"director"}` |
| `.claude/agents/<role>.md` | `$PROJ/.claude/agents/<role>.md` | **只拷选定角色**;frontmatter 的 `name` 改对;body 的验证命令段换成本项目命令(1.2);director.md 的 §8 process 全保留 |
| `.claude/hooks/inject-role.sh` | `$PROJ/.claude/hooks/inject-role.sh` | `chmod +x`;若 decisions 注入行数/路径需调则改;通用逻辑不动 |
| `CLAUDE-snippet.md` 内容 | merge 进 `$PROJ/CLAUDE.md` | 把「派工模型」段落贴进新项目的 CLAUDE.md(若无则建),并加「先读 HARNESS.md」指引 |

**genericize 检查**:scaffold 完 grep 一遍新项目,确认没有把 kit 模板里的占位符 `<PROJECT>` / `<role>` 漏填,也没把任何源项目专属词(关卡/季节/具体技术名)带进来。

落盘后跑一次健全性检查:
```bash
test -f $PROJ/HARNESS.md && \
test -f $PROJ/.claude/settings.json && \
test -x $PROJ/.claude/hooks/inject-role.sh && \
ls $PROJ/.claude/agents/ && ls $PROJ/team/
```

### 阶段 3 · 第一步开工(交给用户)

scaffold 完,告诉用户**怎么开第一回合**(这就是「workflow = director 派工闭环」的起点):

1. **起 director**(裸 claude 即 director,因 settings.json `{"agent":"director"}` + hook 自动注入 HARNESS/persona/protocol/board):
   ```bash
   cd $PROJ && claude
   ```
   第一回合让 director 做:读注入上下文 → 跑 §8.9 task-ID grep → 写 Sprint 0 第一批 handoff doc(到 `team/<role>/notes/`)→ 登记 active-board。
2. **开角色 session 执行**(每个被派的 task 一个):
   ```bash
   claude --agent <role> "<TASK-ID>: 一句话 · handoff 在 team/<role>/notes/<id>-*.md"
   ```
   角色定位 / HARNESS / tasks / decisions 由 SessionStart hook 自动注入,只需传任务。
3. **闭环**:agent 填 Handback + 改 `Status: done` → 回 director session → director 按 **§8.1 验收 SOP** 验收(grep status / 读完整 handback / 跑 AC 的机器项 / 更新 board+kanban / 才派下一个)。

> 这个「director 写 handoff → agent 执行 → director 验收 → 再派」就是本方法论里的 **workflow** 本体,会一直循环到 Sprint/项目结束。第一个 Sprint 怎么排见 `workflow/bootstrap-studio.md` 的示范。

## 必须带进新项目的方法论「金条款」(别精简掉)

scaffold 时确保这些从 templates 完整落地——它们是 kit 的价值所在:

- **director 派工闭环**:director 不写码,只 handoff + 验收;唯一 + 固定。
- **HARNESS 硬规矩**:不改 scope(§1.1)/ 不跨域私下协作(§1.2)/ 不私自 commit·push·PR(§1.3)/ decisions append-only 不改旧条(§1.4)/ 项目专属层隔离(§1.x)/ 提交前必本地验证(§2.4)。
- **decisions.md 纪律**:append-only,新决策 = 新 DEC-NNN,旧条改 `superseded by DEC-MMM` 而非删改;DEC 号由 director 顺号分配。
- **§8 process 金条款**:§8.1 验收 SOP · §8.2 in-flight 上限则 director idle · §8.3 handoff 必含 Coordination 字段 · §8.4 同域 hook/接口提案攒批派 · §8.5 agent 后置 housekeeping(禁自 promote 别 task / 禁自写新 spec)· §8.6 Sprint 边界纪律(retro→codify→ping 用户→再排下 Sprint)· §8.8 UI/visual detection-gate(肉眼/截图,不只信测试绿)· §8.9 task-ID 防冲突 grep · §8.10 raise 问题必带 a/b/c + 倾向 · §8.11 类型/接口变更 codify DEC · §8.12 director inline fix 准入(字面量可 inline / 代码改派 agent)· §8.15 提交前多命令验证 · **领域专属正确性 gate(机器 gate 理念,举例:关卡 audit:levels / schema validate / e2e console)**。
- **SessionStart 注入 hook**:取代手动「启动咒」,角色 session 一起就自动拿到 HARNESS + 自己 persona/tasks + decisions 边界。
- **agent.md 模式 + 进化**:从「人肉贴整段启动咒」进化到 `claude --agent <role>`;启动咒降级为 hook 失效时的 fallback。

## 默认 9 角色速查(增删基准)

| 角色 | 管什么 | 非游戏项目可替换为 |
|---|---|---|
| director | 派工 / 验收 / 决策 / scope(不写码) | 永远保留 |
| engine | 核心逻辑层(纯、可测、不依赖视图) | backend / core |
| ux | 交互 / 渲染 / 视图层 | frontend / design |
| art | 视觉资产 | (web 可去掉或并入 design)|
| content | 文案 / 内容数据 | docs / content |
| gameplay | 玩法/数值设计 | product / domain-design |
| qa | 测试 / 质量 gate | 永远建议保留 |
| release | 打包 / 发布 / infra | devops / release |
| audio | 音乐 / 音效 | (非游戏多半去掉)|

> 增删后,必须同步三处:`team/<role>/`、`.claude/agents/<role>.md`、HARNESS §0 角色清单。少一处则角色起不来或越界。
