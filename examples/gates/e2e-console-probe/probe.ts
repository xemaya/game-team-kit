/**
 * e2e console-error probe gate —— 真机/无头浏览器跑一遍页面,
 * **任何 console.error / 未捕获异常 / 404 都让 gate 红**(除非在 allowlist 里)。
 *
 * 为什么需要它:methodology §4 + §「真机才抓得到的坑」——
 * 「我点过了,能用」这种结论十句三句不能信;部署到子路径后资产 404、
 * 第三方脚本抛错、Promise rejection 没人接……这些在截图上看不出,但控制台全记着。
 * 把控制台当作机器可读的「健康信号」,做成 gate。
 *
 * 这个文件是 gate 的**可测纯逻辑核心**(分类器):给定一批捕获到的控制台消息,
 * 判定通过/失败。怎么把浏览器消息喂进来(Playwright / Puppeteer)见 README——
 * 那是 last mile,需要浏览器依赖;核心判定逻辑零依赖、可单测。
 */

export type ConsoleMsg = {
  type: 'log' | 'info' | 'warning' | 'error';
  text: string;
  source?: string; // 'console' | 'pageerror' | 'requestfailed'
};

export type ProbeResult = {
  passed: boolean;
  fatal: ConsoleMsg[];     // 触发失败的消息
  ignored: ConsoleMsg[];   // 命中 allowlist 被放行的
};

export type ProbeOptions = {
  /** 命中任一正则的 error 被放行(用于已知的、无害的第三方噪声)。每条都该有注释说明为何豁免。 */
  allowlist?: RegExp[];
};

/**
 * 判定一批控制台消息是否通过 gate。
 * 致命 = type==='error' 或 source 是 pageerror / requestfailed,且未命中 allowlist。
 */
export function classify(msgs: ConsoleMsg[], opts: ProbeOptions = {}): ProbeResult {
  const allow = opts.allowlist ?? [];
  const fatal: ConsoleMsg[] = [];
  const ignored: ConsoleMsg[] = [];

  for (const m of msgs) {
    const isError = m.type === 'error' || m.source === 'pageerror' || m.source === 'requestfailed';
    if (!isError) continue;
    if (allow.some((re) => re.test(m.text))) {
      ignored.push(m);
    } else {
      fatal.push(m);
    }
  }

  return { passed: fatal.length === 0, fatal, ignored };
}

/** 把结果格式化成 gate 输出。 */
export function report(res: ProbeResult): string {
  if (res.passed) {
    const note = res.ignored.length ? ` (${res.ignored.length} allowlisted)` : '';
    return `✓ console probe passed${note}`;
  }
  const lines = [`✗ console probe failed: ${res.fatal.length} fatal message(s)`];
  for (const m of res.fatal) lines.push(`  - [${m.source ?? m.type}] ${m.text}`);
  return lines.join('\n');
}
