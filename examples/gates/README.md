# examples/gates — 机器 gate 的**可跑**范例

> methodology [§4「机器 gate 理念」](../../docs/methodology.md) 讲了「让机器替人守门」,
> 但讲理念不等于给实现。这个目录把那一节落成**能真跑的代码** —— clone 下来
> `node …/audit.ts` 就能看见机器门跑绿/跑红,而不是又读一篇 markdown。

## 怎么跑(零安装)

范例用 **Node 22+ 原生 TypeScript 擦除 + 内置 `node --test`**,不需要 `npm install`、不需要构建:

```bash
node --version          # 需要 v22.6+(原生跑 .ts)

# 跑某个 gate(CLI 形态)
node examples/gates/domain-audit/audit.ts
node examples/gates/schema-invariant/validate.ts

# 跑所有 gate 的自验测试
node --test examples/gates/**/*.test.ts
```

> 不是 Node 22?把 `node x.ts` 换成 `npx tsx x.ts`、`node --test` 换成你的测试 runner 即可——
> gate 的**模式**与语言/runner 无关。

## 四类 gate(对应 methodology §4)

| 目录 | gate 类型 | 守的是什么「人眼审不出但错了就致命」的维度 | 自验(meta-gate) |
|---|---|---|---|
| [`domain-audit/`](domain-audit/) | **领域专属正确性穷举** ★灵魂 | 「这一关到底能不能通关」——靠人肉试玩审不全,得搜解空间 | 已知可解→solved、已知死局→no-path |
| [`schema-invariant/`](schema-invariant/) | 数据管线 schema + 不变量 | 跨记录的业务不变量(id 唯一、对账平、非负) | 抓得到缺字段/对账错/重复/负数 |
| [`api-contract/`](api-contract/) | API 契约 snapshot | 响应**形状**漂移(字段消失/类型变)悄悄打挂下游 | 抓得到类型变 string、字段消失 |
| [`e2e-console-probe/`](e2e-console-probe/) | 真机控制台健康信号 | console.error / 未捕获异常 / 资源 404——截图看不出 | 干净放行、脏报警、allowlist 生效 |

## 共同的「gate 配方」

每个范例都遵循 methodology §4 的同一套模式,换领域照搬即可:

1. **找到那个维度** —— 你项目里「靠人眼根本审不出、但一旦错了就致命」的正确性维度。
2. **可机器穷举/校验** —— 写工具去搜/去验它(BFS、schema、snapshot、控制台抓取)。
3. **一行命令** —— `node …/audit.ts`,CI 和派工验收都能挂上去(失败 `exit≠0`)。
4. **强制贴结果** —— 任何相关改动的验收必须贴出 gate 输出(「N/N 可过、0 死关」)。
5. **先验证验证器** —— 每个 gate 都带自验测试,证明它能识别**已知 good + 已知 bad**。
   一个永远说「通过」的 gate 毫无价值。这一步固化在各目录的 `*.test.ts` 里。
6. **落一条 DEC** —— 把「这道 gate 是强制的」写进 `decisions.md`,让它不可被随手绕过。

## 与源项目的关系

`domain-audit/` 的 solver 对标真实项目 **combo-hopper** 的 `tools/solver.ts`(GAME-017):
那份 solver 在每个 turn 边界做 BFS、递归枚举 combo 链终态、用 visited 去重 + 预算兜底,
穷举「现役 buff 池能否通关 30 关」,做成 `… -- validate` / `… -- audit` 两道 gate。
这里把同样的**模式**缩进一个一维玩具领域(Hopper),好让范例自包含、零依赖、能真跑——
而不是把外部项目的整套 game engine 耦合进通用 kit(见 DEC-002)。
