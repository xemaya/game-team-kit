# Workflow · Bootstrap Studio(在新项目展开 AI 多 agent 工作室)

> 本文是 `skill/SKILL.md` 的 step-by-step 落地版:既能被 skill 引用,也能人肉照做。
> 目标:给定一个新项目,30 分钟内把「director 派工闭环 + 9 角色 + HARNESS 硬约束」展开成可开工的骨架。

---

## 先搞清楚:本方法论里「workflow」= 什么

**workflow 不是一条流水线,是一个循环**——**director 派工闭环**:

```
director 写 handoff doc(team/<role>/notes/<id>-*.md, Status: dispatched)
        │
        ▼
director 登记 active-board(In-Flight)
        │
        ▼
用户起角色 session:claude --agent <role> "<TASK-ID>: 一句话 · handoff 在 <path>"
        │  (SessionStart hook 自动注入 HARNESS + persona + tasks + decisions)
        ▼
agent 改 Status: in-progress → 执行 → append Execution Log → 跑验证命令
        │
        ▼
agent 填 Verification + Handback → Status: done → 更新自己 tasks.md(只动本 task)
        │
        ▼
director 按 §8.1 验收 SOP:grep status / 读完整 handback / 跑 AC 机器项 / 更新 board+kanban
        │
        ▼
director 派下一个 task ───────────────────► (回到顶部,循环到 Sprint 末)
```

bootstrap 做的事,就是把跑这个循环所需的**目录、角色、约束、hook、决策起点**一次性铺好。

---

## Step 0 · 前置

- 确认在新项目仓库根(下记 `$PROJ`)。建议是 git 仓库(commit 由用户决定,bootstrap 阶段只写文件不 commit)。
- 确认本 kit 路径(下记 `$KIT`,即 `game-team-kit/`)可读,`$KIT/templates/` 已就绪。

---

## Step 1 · 先聊产品,再据产品推荐配置(顺序:产品 → 推荐栈+角色 → 确认)

> **别上来就问技术栈/角色。** 用户常还没想清要做什么。先当创意搭档把产品聊透,director 再据产品**推荐**栈和员工(提案、用户拍)。

### Step 1a · 先聊「要做什么」(产品本身 · 开放对话)

先聊产品、不聊实现:
- **做什么**(游戏:类型 / 核心玩法循环 / 一句话卖点;其它:解决什么 / 给谁)
- **手感与风格 / 美术方向**(游戏尤其:像素 / 3D / 手绘 / 材质质感;参考作品)
- **规模与平台**(单机/联网 · web/桌面/移动 · 体量)
- **差异化 / 灵感 / 必须有的 / 绝不做的**

→ 聊到能一两句复述「这是个啥」且用户点头,再往下。**这步常常是用户想清楚需求的关键,别跳。**

### Step 1b · director 据产品「推荐」(提案,用户拍 · 不是问用户要)

基于 1a,director 主动给建议(各带一句为什么),用户确认/改:

1. **技术栈 + 验证命令**:据产品类型推荐(2D 网页游戏 → Vite+TS+vitest+GSAP;数据/ML → Python+pytest+mypy;CLI → 对应语言)。给 测试/类型检查/构建/e2e 命令。已有仓**先探测**(`package.json`/`Cargo.toml`/`pyproject.toml`/`Makefile`)再确认。
2. **角色集**:据产品从默认 9(`director engine ux art content gameplay qa release audio`)增删 + 说明。非游戏常 `art/audio/gameplay → backend/data/ml/design/docs/devops`。`director` 永远保留且唯一;`engine`(或同义核心层)、`qa` 建议留。
3. **领域专属正确性 gate**(机器 gate 理念):据产品找「能机器卡死、不靠肉眼」的核心正确性。游戏「关卡可通关」`audit`、数据「schema 校验」`validate`、web「无 console error」e2e probe、库「API 不破坏」api-snapshot。
4. **层隔离铁律**:据产品定「哪两层单向依赖」。游戏 逻辑层 ⟂ UI 层;web 业务/core ⟂ 框架/视图;库 `core/` 不依赖 `adapters/`。
5. **硬 scope**:据产品列(平台/语言/规模/不做什么/发布目标/时间线),每条 → 一条初始 DEC。

### Step 1c · 回读确认

**产出**:一张确认表(产品一句话 / 技术栈 / 验证命令 / 角色集 / gate 命令 / 层隔离规则 / scope 行)。**回读给用户拍板后再进 Step 2。**

---

## Step 2 · Scaffold(拷模板 + 定制)

### 2.1 建目录

```bash
mkdir -p $PROJ/team/director $PROJ/.claude/agents $PROJ/.claude/hooks
# 对每个选定角色 <role>:
mkdir -p $PROJ/team/<role>/notes
```

### 2.2 拷全局约束 + 协议 + 决策/看板

```bash
cp $KIT/templates/HARNESS.md            $PROJ/HARNESS.md
cp $KIT/templates/handoff-protocol.md   $PROJ/team/director/handoff-protocol.md
cp $KIT/templates/decisions.md          $PROJ/team/director/decisions.md
cp $KIT/templates/active-board.md       $PROJ/team/director/active-board.md
cp $KIT/templates/kanban.md             $PROJ/team/director/kanban.md
```

### 2.3 拷角色 persona + 建 tasks 看板(只拷选定角色)

```bash
# 对每个选定角色 <role>:
cp $KIT/templates/personas/<role>.md $PROJ/team/<role>/persona.md
printf '# %s · tasks\n\n## Now\n\n## Next\n\n## Done\n' "<role>" > $PROJ/team/<role>/tasks.md
```

### 2.4 拷 .claude(agents + hook + settings,只拷选定角色)

```bash
cp $KIT/templates/.claude/settings.json        $PROJ/.claude/settings.json
cp $KIT/templates/.claude/hooks/inject-role.sh $PROJ/.claude/hooks/inject-role.sh
chmod +x $PROJ/.claude/hooks/inject-role.sh
# 对每个选定角色 <role>:
cp $KIT/templates/.claude/agents/<role>.md $PROJ/.claude/agents/<role>.md
```

### 2.5 把派工模型贴进 CLAUDE.md

把 `$KIT/templates/CLAUDE-snippet.md` 的「派工模型」段落 merge 进 `$PROJ/CLAUDE.md`(没有就新建),并在顶部加一句「**先读 `HARNESS.md`**(全 agent 约束)」。

### 2.6 定制(用 interview 结果回填)

逐文件落定制,**这是 bootstrap 的真正工作量**:

- **HARNESS.md**
  - §5 scope 表 ← Step 1.4 的每条 scope(每行配 DEC 号)
  - §1 加项目专属层隔离硬规 ← Step 1.6
  - §2.4 验证命令 ← Step 1.2
  - §0 角色清单 ← Step 1.3 的选定角色
  - 加一条领域 gate 硬规 ← Step 1.5(如「关卡改动必过 `<gate 命令>`」)
  - 「当前阶段速览」改为「Sprint 0 · 工程地基」
- **decisions.md**:把每条 scope 写成 `DEC-001 .. DEC-N`(append-only 的起点,顶部最新)。
- **handoff-protocol.md**:§0 角色边界按选定角色集裁;**§8 全保留**(精简 = 砍掉方法论价值)。
- **personas/`<role>`.md**:每份顶部填项目专属「不归我管」边界。
- **.claude/agents/`<role>`.md**:frontmatter `name` 改对;body 验证命令段换成本项目命令(Step 1.2);若该角色对应领域 gate,在 body 写明「改 X → 必过 `<gate>`」;director.md §8 全保留。
- **inject-role.sh**:通用逻辑不动;若 decisions 注入行数/路径需调,改对应行。

### 2.7 genericize + 健全性检查

```bash
# 不该残留任何占位符或源项目专属词
grep -rn "<PROJECT>\|<role>" $PROJ/HARNESS.md $PROJ/team $PROJ/.claude   # 应为空(都已回填)
# 文件就位 + hook 可执行 + 角色对齐三处
test -f $PROJ/HARNESS.md && test -f $PROJ/.claude/settings.json \
  && test -x $PROJ/.claude/hooks/inject-role.sh \
  && ls $PROJ/.claude/agents/ && ls $PROJ/team/
```
确认每个选定角色在 **三处都在**:`team/<role>/`、`.claude/agents/<role>.md`、HARNESS §0 清单。少一处 = 角色起不来或越界。

---

## Step 3 · 第一步开工

1. **起 director**(裸 `claude` 即 director):
   ```bash
   cd $PROJ && claude
   ```
   `settings.json {"agent":"director"}` + SessionStart hook 会自动注入 HARNESS / director persona / handoff-protocol(§8)/ active-board。第一回合让 director:消化注入 → 跑 §8.9 task-ID grep → 写 Sprint 0 第一批 handoff doc → 登记 active-board → 把开工命令交给用户。
2. **开角色 session 执行**(每个被派 task 一个):
   ```bash
   claude --agent <role> "<TASK-ID>: 一句话 · handoff 在 team/<role>/notes/<id>-*.md"
   ```
3. **闭环**:agent 填 Handback + `Status: done` → 回 director session → director 按 §8.1 SOP 验收 → 派下一个。循环直至 Sprint 末。

---

## 示范 · 新项目第 1 个 Sprint 怎么排(Sprint 0 · 工程地基)

第 1 个 Sprint 的目标**不是堆功能**,是**把地基 + 工作流跑通**,让后续 Sprint 能并行高速派工。通用排法:

### Sprint 0 主线(由 director 第一回合 dispatch)

| Task | 角色 | 目的(为什么是 Sprint 0) |
|---|---|---|
| `ENG-001` 核心层骨架 + 验证基线 | engine | 把纯逻辑层(Step 1.6 的被隔离层)立起来,跑通测试/类型/构建四命令 — 后续一切派工的验收依赖它 |
| `QA-001` 测试/gate 骨架 | qa | 把验证命令 + 领域 gate(Step 1.5)接成可一键跑;**Coordination 字段须提示**会与现有测试 glob 冲突(§8.3 实证教训) |
| `REL-001` 构建/打包 spike | release/devops | 验证目标平台能 build 出可运行产物 — 早发现工具链坑 |
| `UX-001`(或 frontend-001)壳 + 渲染骨架 | ux | 立一个能跑起来、能肉眼看的最小壳(§8.8 detection-gate 的前提) |
| (设计类角色)`*-001` spec / 内容曲线 | gameplay/content/product | 出第一版 spec,**不写实现**,给后续实现 task 喂上下文 |

排布原则:
- **director idle 上限**:in-flight 同时 ≥ 上限(默认 6)就停派,转去验收 / 写文档 / 写 retro(§8.2)。
- **hook/接口提案攒批**:设计角色提的接口/扩展点,director 不逐个派,攒满一个语义域再用单个 engine handoff 批量实现(§8.4)。
- **detection-gate**:任何动视图层 / player-facing 文本的 task,AC 必含「director 肉眼 + 截图」两条 gate,别只信测试绿(§8.8)。
- **领域 gate 进 AC**:涉及核心正确性的 task,AC 直接写「必过 `<gate 命令>`」,把对错交给机器,不靠肉眼/嘴说(机器 gate 理念)。

### Sprint 0 退出标准(director 在 Sprint 末对账,§8.6)

- 四命令(测试 / 类型 / 构建 / e2e 或集成)全绿,且 `<领域 gate>` 全绿。
- 至少跑通**一整个**派工闭环(director 写 handoff → agent done → director §8.1 验收)— 证明工作流本身 work。
- decisions.md 有初始 DEC(每条 scope 一条),active-board / kanban 有真实状态。
- director 写完 `sprint-0-retro.md`(数字 / what worked / what didn't / 改进项 codify 进 §8 / 开放问题 ping 用户),拿到用户对开放问题的回答,**才**排 Sprint 1。

> 之后每个 Sprint 重复同样的 director 派工闭环;唯一在演化的是 §8 process(每次 retro 把踩到的坑 codify 成新条款)。这就是方法论从「手动启动咒」一路进化到「`claude --agent` + hook 注入 + §8 硬条款」的方式 —— **流程本身也是被持续 codify 的产物。**
