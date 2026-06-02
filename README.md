# game-team-kit

> 一套 AI 多 agent 协作开发的 **SOP + 脚手架**(模板 + skill + agent 定义 + 机器 gate 范例)。
> **不是一键工具。** 它不替你写代码,而是把开发组织成「Director 派工 → 多角色并行 → 机器守门」的流程。
> activation 成本不低 —— 先读下面《先看:适合你吗?》,再决定用不用。

## 先看:适合你吗?

这套打法的杠杆点是「**并行 + 可验证**」。这两个条件不满足,它的固定成本(写需求、定标准、做验收、维护一堆运营文档)就撬不动收益。所以先自我筛选:

**适合**:

- 边界清楚、能写出**可机器检查验收标准**的活(改数值、批量替换、加测试、出资产、按 spec 实现接口)。
- 多个**专业领域能并行**的项目(内核 / 前端 / 内容 / 发布互不挡道)。
- 你愿意花力气**把需求讲清楚** —— 这套省的是「亲手敲代码」,不省「管理 / 写需求 / 验收」。

**别用**(强行用 = 净亏):

- **单人 10 分钟能搞定的小事** —— 为它起整套流水线纯属脱裤子放屁。
- **纯审美 / 手感验收** —— 你自己都说不清验收标准的活,最后还得人肉拍板,机器 gate 失效。
- **连「要做什么」都没想明白** —— 派工单都写不出来,先去 brainstorm,别先搭班子。
- **单一领域、无法并行** —— 没有「多工种同时干」的结构,多 agent 的协调开销 > 收益。

> 成本面一句话:全程**运营文档量可能是代码量的两倍多**。你不是省下了写代码的时间,是把它挪去写需求、定标准、做验收了。

## 这是什么

本 kit 抽自一个真实项目(一款 roguelite 小游戏)的开发流程 —— 它用多个固定角色的 AI 会话、一套派工闭环、一组防漂移约束和机器质量门,做到了可玩、可上线。这里把其中**与具体项目无关的方法论骨架**剥离出来,做成模板 + skill + agent 定义 + 可跑的机器 gate 范例,省掉你从头摸索的功夫。它本质是一套**带脚手架的 SOP**,不是黑箱工具——所有约束、角色、gate 都是你能读懂、能改的纯文本/代码。

核心理念:

- **固定角色,各开独立会话**,上下文干净,质量才稳。
- **Director 派工闭环**:写需求 / 定验收 / 派活 / 验收 / 记账,**自己不写代码**。
- **防漂移三件套**:`HARNESS.md`(全局铁律)+ `decisions.md`(append-only 决策日志)+ §8 process(流程金条款)。
- **机器守门**:验收尽量写成可机器检查的标准 —— 跑测试、grep、数量对账、领域正确性 audit(可跑范例见 [`examples/gates/`](examples/gates/))。
- **启动咒 → 一行命令**:`claude --agent <role>` + SessionStart hook 自动注入约束。

> ⚠️ 诚实标注:除 SessionStart hook 外,上面这些约束**多数是软约束**(靠 Director 自觉执行 + 流程纪律),不是引擎层强制。它降低跑偏概率,不消除。

## 它解决什么

1. **新项目少手搓** —— 不用每次重写角色、约束、派工模板;拷模板 + 跑 bootstrap 起步(不是「一键展开」,bootstrap 会先跟你聊清产品再 scaffold)。
2. **防 AI 漂移** —— AI 会跑偏、会忘事、会自作主张改方向。HARNESS + DEC 日志 + §8 process 三层约束降低概率。
3. **机器质量 gate** —— AI 张口就来「我测过了」,十句有三句不能信。用机器门(四命令验证 / 视觉亲眼看过 / 领域正确性 audit)替人守门,结论先过门再信。

## Quickstart

> 这是 SOP + 脚手架,不是一键工具:下面几步会落出文件,但真正干活靠你和 Director 持续派工/验收。

```bash
# 1) 把模板拷进你的新项目根目录
cp -r game-team-kit/templates/* <your-project>/
cp -r game-team-kit/templates/.claude <your-project>/.claude

# 2) 让 Claude 跑 bootstrap skill —— 先聊产品(做什么)→ director 据产品推荐栈+角色 → 确认 → scaffold team/
#    (在新项目里启动 claude,调用 skill)
claude
> /bootstrap-studio        # 或直接说「帮我 bootstrap 这套 AI 工作室」

# 3) 裸启动 = Director(由 .claude/settings.json 的 {"agent":"director"} 决定)
#    Director 写派工单(handoff doc),不写代码
claude

# 4) 派工:一行命令起一个角色会话,SessionStart hook 自动注入约束/角色/看板
claude --agent engine "ENG-001: <一句话任务> · handoff 在 team/engine/notes/eng-001-*.md"
```

派工模型一句话:**裸 `claude` 是 Director(派工/验收),`claude --agent <role>` 是某个工种(执行)。** 二者通过 `team/` 下的 handoff doc 异步交接。

## 目录导览

```
game-team-kit/
├── README.md                       # 本文 —— 是什么 + quickstart + 派工模型
├── docs/methodology.md             # 方法论的「为什么」(深入版:防漂移/机器 gate/进化史/经验教训)
├── examples/gates/                 # 机器 gate 的可跑范例(4 类 · 零依赖 · node 直接跑)
├── skill/SKILL.md                  # 可调用 skill:为新项目 bootstrap 这套工作室
├── workflow/bootstrap-studio.md    # bootstrap 流程(interview 需求 → 选角色 → scaffold)
├── workflow/asset-pipeline.md      # 资产防漂移 SOP(锚定—派生:概念锚 → 派生角色/资产 → 一致性 gate)
└── templates/                      # 拷进新项目的脚手架(带 <PROJECT>/<role> 占位符)
    ├── HARNESS.md                  # 通用全局约束骨架(硬规矩 + 占位 + 填写指引)
    ├── CLAUDE-snippet.md           # 给新项目 CLAUDE.md 的「派工模型」段落
    ├── handoff-protocol.md         # 通用派工协议(角色边界 / handoff 模板 / §8 process 金条款)
    ├── decisions.md                # 空 DEC 日志 + 模板
    ├── active-board.md             # 实时状态板骨架
    ├── kanban.md                   # 看板骨架
    ├── personas/<role>.md          # 9 个通用角色 persona(项目无关)
    └── .claude/
        ├── settings.json           # {"agent":"director"} —— 裸启动即 Director
        ├── agents/<role>.md        # 9 个角色 agent 定义(frontmatter + 协议 body)
        └── hooks/inject-role.sh    # SessionStart 注入 hook(强塞约束/角色/看板)
```

| 你想做什么 | 去看 |
|---|---|
| 理解这套方法论为什么这么设计 | [`docs/methodology.md`](docs/methodology.md) |
| 看机器 gate 长什么样、怎么真跑 | [`examples/gates/`](examples/gates/) |
| 在新项目里展开工作室 | [`skill/SKILL.md`](skill/SKILL.md) + [`workflow/bootstrap-studio.md`](workflow/bootstrap-studio.md) |
| 出一整套风格不跑偏的美术资产 | [`workflow/asset-pipeline.md`](workflow/asset-pipeline.md) |
| 看全局铁律怎么写 | [`templates/HARNESS.md`](templates/HARNESS.md) |
| 看派工协议 / §8 process 金条款 | [`templates/handoff-protocol.md`](templates/handoff-protocol.md) |
| 看某个角色定位 | [`templates/personas/<role>.md`](templates/personas/) |
| 看一行命令派工怎么落地 | [`templates/.claude/`](templates/.claude/) |

## 默认 9 角色(可按项目定制)

| 角色 | 职责 | 非游戏项目可换成 |
|---|---|---|
| **director** | 派工 / 验收 / 记账,**不写码** | (固定,不可省) |
| **engine** | 核心逻辑内核 | backend / core |
| **ux** | 渲染 / 交互 / 动画 / 样式 | frontend |
| **art** | 视觉资产生成 | design / data-viz |
| **content** | 内容数据 / 文案 | data / content-ops |
| **gameplay** | 数值 / 平衡 / 求解器 | ml / algorithms |
| **qa** | 测试 / 质量门 | qa(通用) |
| **release** | 打包 / 部署 / 对外 | devops / release |
| **audio** | 音乐 / 音效 | (非游戏项目通常去掉) |

bootstrap 时按项目需求增删:director 固定保留;其余角色按「这个项目有哪几个能并行的专业领域」来选。

> 适用 / 不适用边界见本文开头《先看:适合你吗?》—— 那是决定要不要用这套 kit 的第一道闸。
