# game-team-kit

> 把「AI 多 agent 虚拟工作室」方法论做成一套**可复用脚手架** —— 下一个项目启动时,几条命令就能展开一支由 Director 调度的 AI 工作室,直接进入开发。

## 这是什么

这不是「让一个 AI 帮你写代码」,而是「让 AI 开一家工作室,把项目交付出来」。

本 kit 抽自一个真实项目(一款 roguelite 小游戏)的完整开发流程 —— 它用 9 个固定角色的 AI 工作室、一套派工闭环、一组防漂移约束和机器质量门,从 0 做到了可玩、可上线。这里把其中**与具体项目无关的方法论骨架**剥离出来,做成模板 + skill + agent 定义,让你能在新项目里一键复用,而不必再从头摸索一遍。

核心理念:

- **9 个固定角色**,每个角色是一个独立会话,上下文干净,质量才稳。
- **Director 总监派工闭环**:写需求 / 定验收 / 派活 / 验收 / 记账,**自己不写代码**。
- **防漂移三件套**:`HARNESS.md`(全局铁律)+ `decisions.md`(append-only 决策日志)+ §8 process(流程金条款)。
- **机器守门**:验收尽量写成可机器检查的标准 —— 跑测试、grep、数量对账、领域正确性 audit。
- **从「启动咒」进化到一行命令**:`claude --agent <role>` + SessionStart hook 自动注入约束。

## 它解决什么

1. **新项目快速展开** —— 不用每次手搓角色、约束、派工模板;拷模板 + 跑 bootstrap 即可。
2. **防 AI 漂移** —— AI 会跑偏、会忘事、会自作主张改方向。HARNESS + DEC 日志 + §8 process 三层约束把它摁住。
3. **机器质量 gate** —— AI 张口就来「我测过了」,十句有三句不能信。用机器门(四命令验证 / 视觉亲眼看过 / 领域正确性 audit)替人守门,结论先过门再信。

## Quickstart

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
├── skill/SKILL.md                  # 可调用 skill:为新项目 bootstrap 这套工作室
├── workflow/bootstrap-studio.md    # bootstrap 流程(interview 需求 → 选角色 → scaffold)
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
| 在新项目里展开工作室 | [`skill/SKILL.md`](skill/SKILL.md) + [`workflow/bootstrap-studio.md`](workflow/bootstrap-studio.md) |
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

## 适用 / 不适用边界

**适合**:

- 边界清楚、能写出**可机器检查验收标准**的活(改数值、批量替换、加测试、出资产、按 spec 实现接口)。
- 多个**专业领域能并行**的项目(内核 / 前端 / 内容 / 发布互不挡道)。
- 你愿意花力气**把需求讲清楚**的场景 —— 这套打法省的是「亲手敲代码」,不省「管理 / 写需求 / 验收」。

**不适合**:

- 靠模糊审美直觉、你自己都说不清验收标准的活(「这手感对不对」最后还得人肉拍板)。
- 连「要做什么」都没想明白的早期探索(派工单都写不出来,先去 brainstorm)。
- 一个人 10 分钟能搞定的小事 —— 为它启动整套流水线纯属脱裤子放屁。

> 一句话总结成本面:全程**运营文档量可能是代码量的两倍多**。你不是省下了写代码的时间,是把它挪去写需求、定标准、做验收了。值不值,取决于项目能不能并行、需求能不能讲清。
