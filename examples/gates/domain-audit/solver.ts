/**
 * Hopper 求解器 — BFS 穷举解空间,回答「这一关到底能不能通关」。
 *
 * 这是 kit「领域正确性 audit gate」的核心范例。它对标真实项目 combo-hopper 的
 * `tools/solver.ts`(GAME-017):那份 solver 在每个 turn 边界做 BFS,递归枚举
 * combo 链的所有终态,用 visited 去重 + 预算兜底,穷举出「现役 buff 池能否通关」。
 * 这里把同样的模式缩到一个一维玩具领域,好让范例**自包含、零依赖、能真跑**。
 *
 * 模式(可迁移到任何「可机器穷举的正确性」维度):
 *   1. 状态可哈希 → visited 去重,避免指数爆炸。
 *   2. BFS → 找到的就是最短解(给人复盘用)。
 *   3. 预算(maxStates)兜底 → 搜不动时明确返回 budget-exhausted,而不是假装无解。
 *   4. 区分三种 not-solved:no-path(真无解)/ budget-exhausted(搜不动)/ trivial。
 *      —— 机器 gate 必须诚实区分「证明无解」和「没搜完」。
 */

import {
  type State,
  type Move,
  applyMove,
  hash,
  isWin,
  legalMoves,
} from './hopper.ts';

export type SolveResult = {
  solved: boolean;
  moves: Move[] | null;
  steps: number;          // 解的步数
  statesVisited: number;
  reason: 'win' | 'trivial' | 'no-path' | 'budget-exhausted';
};

export type SolveOptions = {
  maxStates?: number;     // visited 上限,防解空间爆炸
};

const DEFAULT_MAX_STATES = 200_000;

export function solve(start: State, opts: SolveOptions = {}): SolveResult {
  const maxStates = opts.maxStates ?? DEFAULT_MAX_STATES;

  if (isWin(start)) {
    return { solved: true, moves: [], steps: 0, statesVisited: 1, reason: 'trivial' };
  }

  type Item = { state: State; moves: Move[] };
  const visited = new Set<string>([hash(start)]);
  const queue: Item[] = [{ state: start, moves: [] }];

  while (queue.length > 0) {
    if (visited.size > maxStates) {
      return { solved: false, moves: null, steps: 0, statesVisited: visited.size, reason: 'budget-exhausted' };
    }
    const item = queue.shift()!;
    for (const m of legalMoves(item.state)) {
      const next = applyMove(item.state, m);
      const moves = [...item.moves, m];
      if (isWin(next)) {
        return { solved: true, moves, steps: moves.length, statesVisited: visited.size, reason: 'win' };
      }
      const h = hash(next);
      if (visited.has(h)) continue;
      visited.add(h);
      queue.push({ state: next, moves });
    }
  }

  return { solved: false, moves: null, steps: 0, statesVisited: visited.size, reason: 'no-path' };
}

/** 把解的 move 序列还原成人类可读的复盘(给 review 用)。 */
export function formatMoves(start: State, moves: Move[]): string {
  let s: State = start;
  const lines: string[] = [];
  moves.forEach((m, i) => {
    if (m.kind === 'walk') {
      lines.push(`  ${i + 1}. walk ${s.scout} → ${m.to}`);
    } else {
      lines.push(`  ${i + 1}. jump over zombie@${m.over}: ${s.scout} → ${m.to}  (kills@${m.over})`);
    }
    s = applyMove(s, m);
  });
  lines.push(`  → final: scout@${s.scout}, zombies left=${s.zombies.size}`);
  return lines.join('\n');
}
