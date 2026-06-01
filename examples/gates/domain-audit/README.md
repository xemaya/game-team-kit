# domain-audit — 领域专属正确性穷举 gate ★

> kit 方法论的「灵魂」:找到项目里**靠人眼根本审不出、错了就致命**的正确性维度,
> 写工具穷举它,做成一行命令的 gate。这里的玩具领域是 **Hopper**(一维跳棋小游戏),
> 守的维度是「**这一关到底能不能通关**」。

## 文件

| 文件 | 作用 |
|---|---|
| `hopper.ts` | 纯游戏规则(状态 / 合法 move / 应用 move / 通关判定),无 I/O |
| `solver.ts` | BFS 穷举解空间,诚实区分 `win` / `no-path`(证明无解)/ `budget-exhausted`(没搜完) |
| `levels.ts` | 关卡注册表 = gate 的输入;改它的任务验收必须贴 audit 结果 |
| `audit.ts` | **gate 本体**:所有 `mustBeSolvable` 关必须可解,否则 `exit 2` |
| `solver.test.ts` | **gate 自验**:证明 solver 在已知可解关说「能解」、已知死局说「无解」 |

## 跑

```bash
node examples/gates/domain-audit/audit.ts          # gate:打印 N/N、失败 exit 2
node --test examples/gates/domain-audit/solver.test.ts   # 先验证验证器
```

预期 audit 输出:

```
✓ level-1: solved in 1 steps (1 states)
...
✓ gate: 4/4 must-be-solvable levels passed
```

## 怎么搬到你的项目

把 Hopper 换成你的领域,模式不变:

- **棋盘游戏 / 关卡** → 通关求解器(本例)。
- **排程 / 约束系统** → 可满足性检查(每个约束集都有可行解吗)。
- **状态机 / 工作流** → 可达性(每个目标态都能从初态到达吗)。

关键纪律:**solver 自己也得先过门**(`solver.test.ts`)。一个永远返回「可解」的求解器
会放过一切坏关卡——所以必须用已知死局证明它会说「无解」。这是 methodology §4
「连你自己写的校验工具,也要先证明它能识别已知正确样本」的可执行形态。
