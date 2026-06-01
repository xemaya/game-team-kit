/**
 * audit.ts — 领域正确性 audit gate(一行命令)。
 *
 *   node examples/gates/domain-audit/audit.ts
 *
 * 对每一关跑 solver,断言所有 mustBeSolvable 的关都能搜出解。
 * 任何关搜不出解 → 打印红色清单 + exit 2(CI / 派工验收都能挂在这上面)。
 *
 * 这就是 methodology §4「领域专属正确性 audit gate」的可执行形态:
 *   可机器穷举的正确性 + 一行命令 + 强制贴结果 + 落 DEC。
 * 在真实项目里它对标 combo-hopper 的 `npx vite-node tools/solver.ts -- validate`。
 */

import { LEVELS } from './levels.ts';
import { createState } from './hopper.ts';
import { solve } from './solver.ts';

function main(): void {
  console.log('=== Domain audit gate: every level must be solvable ===\n');
  let failed = 0;

  for (const lv of LEVELS) {
    const start = createState(lv.n, lv.scout, lv.zombies);
    const res = solve(start);

    if (res.solved) {
      console.log(`  ✓ ${lv.id}: solved in ${res.steps} steps (${res.statesVisited} states)`);
    } else if (lv.mustBeSolvable) {
      console.log(`  ✗ ${lv.id}: NO SOLUTION (${res.reason}, ${res.statesVisited} states)`);
      failed++;
    } else {
      console.log(`  · ${lv.id}: unsolvable as expected (${res.reason})`);
    }
  }

  const total = LEVELS.filter((l) => l.mustBeSolvable).length;
  const ok = total - failed;
  console.log(`\n${failed === 0 ? '✓' : '✗'} gate: ${ok}/${total} must-be-solvable levels passed`);

  if (failed > 0) {
    console.log('\n机器门红了:有关卡通不了。改 levels.ts / 规则前,先让这条 gate 跑绿。');
    process.exit(2);
  }
}

main();
