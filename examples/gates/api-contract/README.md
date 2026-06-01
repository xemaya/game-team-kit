# api-contract — API 契约 snapshot gate

> 把 API 响应的**契约(字段集 + 各字段类型)**冻成 snapshot。值会变(正常),但
> 「字段消失 / 类型从 number 变 string / 多出未声明字段」是会悄悄打挂下游消费方的
> 破坏性变更——这道 gate 专抓形状漂移。

## 文件

| 文件 | 作用 |
|---|---|
| `contract.ts` | 被测 handler(范例用纯函数模拟,真实项目换成 `fetch`)+ `shapeOf`(递归形状指纹) |
| `contract.snapshot.json` | 冻结的契约形状 |
| `contract.test.ts` | gate:当前形状必须 == snapshot;并自验 `shapeOf` 抓得到类型变 / 字段消失 |

## 跑

```bash
node --test examples/gates/api-contract/contract.test.ts
```

## 有意改契约时

契约该演进,但要**显式**:

```bash
# 确认是有意变更后,重生成 snapshot:
node -e "import('./examples/gates/api-contract/contract.ts').then(m=>console.log(JSON.stringify(m.shapeOf(m.getUserResponse('x')),null,2)))" \
  > examples/gates/api-contract/contract.snapshot.json
```

然后在 PR / DEC 里写清「为什么破约 + 下游谁需要跟」。**gate 的意义不是禁止变更,
而是让破坏性变更无法悄悄溜过去。**

## 搬到你的项目

- 把 `getUserResponse` 换成真实 API 调用(`await fetch(url).then(r=>r.json())`)。
- 一个 endpoint 一个 snapshot;契约测试和单测放一起跑。
- 想更严:对值也加约束(如 `age` 必须 ≥0),但别把易变的具体值写进 snapshot,否则噪声淹没信号。
