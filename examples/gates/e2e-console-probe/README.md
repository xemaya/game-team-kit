# e2e-console-probe — 真机控制台健康信号 gate

> 「我点过了,能用」十句三句不能信。部署到子路径后资产 404、第三方脚本抛错、
> 没人接的 Promise rejection……这些**截图上看不出,但控制台全记着**。把控制台当作
> 机器可读的健康信号:真机/无头跑一遍页面,**任何 console.error / 未捕获异常 / 404
> 都让 gate 红**(除非在 allowlist 里且注明了原因)。

## 文件

| 文件 | 作用 |
|---|---|
| `probe.ts` | gate 的**纯逻辑核心**:`classify(msgs, {allowlist})` 判定通过/失败;零依赖、可单测 |
| `probe.test.ts` | gate 自验:干净页放行、console.error/pageerror/404 报警、allowlist 生效、warning 不致命 |

```bash
node --test examples/gates/e2e-console-probe/probe.test.ts
```

## last mile:用 Playwright 把真实控制台喂进来

核心判定逻辑零依赖且已测;只差「从浏览器捕获消息」这一步,它需要浏览器依赖
(`npm i -D playwright && npx playwright install chromium`)。接线很短:

```ts
// probe.e2e.ts —— 需要 playwright,不在零依赖自验范围内
import { chromium } from 'playwright';
import { classify, report, type ConsoleMsg } from './probe.ts';

const url = process.argv[2] ?? 'http://localhost:5173/';
const msgs: ConsoleMsg[] = [];

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => {
  const t = m.type();
  if (t === 'error' || t === 'warning' || t === 'log' || t === 'info')
    msgs.push({ type: t, text: m.text(), source: 'console' });
});
page.on('pageerror', (e) => msgs.push({ type: 'error', text: String(e), source: 'pageerror' }));
page.on('requestfailed', (r) =>
  msgs.push({ type: 'error', text: `${r.method()} ${r.url()} ${r.failure()?.errorText ?? 'failed'}`, source: 'requestfailed' }),
);

await page.goto(url, { waitUntil: 'networkidle' });
// …可在此驱动关键交互路径(点开始、跑一局)再收集…
await browser.close();

const res = classify(msgs, {
  allowlist: [
    /analytics\.js/, // 第三方统计被广告拦截器挡,无害
  ],
});
console.log(report(res));
process.exit(res.passed ? 0 : 1);
```

跑:`npx tsx examples/gates/e2e-console-probe/probe.e2e.ts http://localhost:5173/`

## 为什么核心和接线分开

把**判定逻辑**(allowlist、什么算致命)和**浏览器捕获**解耦,好处:判定逻辑能零依赖单测
(`probe.test.ts`),浏览器那层只是把消息塞进同一个 `classify`。换 Puppeteer / Cypress
也只换接线、核心不动。
