/**
 * probe.test.ts — gate 自验:分类器对干净页面放行,对脏页面报警,allowlist 生效。
 *   node --test examples/gates/e2e-console-probe/probe.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, type ConsoleMsg } from './probe.ts';

test('干净页面:只有 log/info → 通过', () => {
  const msgs: ConsoleMsg[] = [
    { type: 'log', text: 'app booted' },
    { type: 'info', text: 'ws connected' },
  ];
  assert.equal(classify(msgs).passed, true);
});

test('console.error → 失败,且列入 fatal', () => {
  const msgs: ConsoleMsg[] = [{ type: 'error', text: 'Cannot read properties of undefined', source: 'console' }];
  const res = classify(msgs);
  assert.equal(res.passed, false);
  assert.equal(res.fatal.length, 1);
});

test('未捕获异常(pageerror)→ 失败', () => {
  const msgs: ConsoleMsg[] = [{ type: 'log', text: 'TypeError: x is not a function', source: 'pageerror' }];
  assert.equal(classify(msgs).passed, false);
});

test('资源 404(requestfailed)→ 失败', () => {
  const msgs: ConsoleMsg[] = [{ type: 'log', text: 'GET /assets/main.js 404', source: 'requestfailed' }];
  assert.equal(classify(msgs).passed, false);
});

test('allowlist:已知无害的第三方噪声被放行', () => {
  const msgs: ConsoleMsg[] = [
    { type: 'error', text: 'analytics.js: blocked by client', source: 'console' },
    { type: 'error', text: 'real app bug', source: 'console' },
  ];
  const res = classify(msgs, { allowlist: [/analytics\.js/] });
  assert.equal(res.passed, false);        // 还有一个真 bug
  assert.equal(res.ignored.length, 1);    // analytics 被放行
  assert.equal(res.fatal.length, 1);      // real app bug 仍致命
});

test('warning 不致命(避免噪声淹没 gate)', () => {
  const msgs: ConsoleMsg[] = [{ type: 'warning', text: 'deprecated API' }];
  assert.equal(classify(msgs).passed, true);
});
