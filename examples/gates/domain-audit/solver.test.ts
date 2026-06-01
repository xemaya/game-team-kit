/**
 * solver.test.ts — gate 自验(meta-gate)。
 *
 *   node --test examples/gates/domain-audit/solver.test.ts
 *
 * methodology §4 的金句:**「连你自己写的校验工具,也要先证明它能识别已知正确样本。」**
 * 一个永远返回 solved=true 的求解器毫无价值——它放过一切。所以 gate 工具本身
 * 必须先过一道门:在已知可解样本上说「能解」,在已知死局上说「不能解」。
 *
 * 这就是 methodology §4「先验证验证器」那段的可执行形态。
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createState } from './hopper.ts';
import { solve } from './solver.ts';
import { LEVELS } from './levels.ts';

test('已知可解:最小关能搜出解', () => {
  const res = solve(createState(3, 0, [1]));
  assert.equal(res.solved, true);
  assert.equal(res.reason, 'win');
  assert.ok(res.moves && res.moves.length >= 1);
});

test('已知死局:紧邻 zombie 对 + scout 被堵 → 求解器必须诚实说无解', () => {
  // scout@0, zombies@{1,2}, n=3:
  // 越过 1 需落到 2,但 2 是 zombie(非空);scout 也走不过 1。无任何合法 move。
  const res = solve(createState(3, 0, [1, 2]));
  assert.equal(res.solved, false);
  assert.equal(res.reason, 'no-path'); // 不是 budget-exhausted —— 是被证明无解
});

test('trivial:没有 zombie 即刻通关', () => {
  const res = solve(createState(5, 2, []));
  assert.equal(res.solved, true);
  assert.equal(res.reason, 'trivial');
  assert.equal(res.steps, 0);
});

test('解是可重放的:formatMoves 还原后 zombies 必须清零', async () => {
  const { formatMoves } = await import('./solver.ts');
  const start = createState(9, 0, [1, 3, 5, 7]);
  const res = solve(start);
  assert.equal(res.solved, true);
  const replay = formatMoves(start, res.moves!);
  assert.match(replay, /zombies left=0/);
});

test('registry 一致性:所有 mustBeSolvable 关确实可解(audit gate 的核心断言)', () => {
  for (const lv of LEVELS) {
    if (!lv.mustBeSolvable) continue;
    const res = solve(createState(lv.n, lv.scout, lv.zombies));
    assert.equal(res.solved, true, `${lv.id} 应可解但 solver 返回 ${res.reason}`);
  }
});
