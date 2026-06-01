/**
 * Hopper — 一个自包含的迷你关卡游戏(纯规则,无 I/O / 无渲染)。
 *
 * 这是 kit 的「领域正确性 audit gate」范例用的玩具领域。它刻意做小,
 * 但保留了真实项目(combo-hopper)的核心难点:**「这一关到底能不能通关」
 * 靠人眼根本审不出**——你得真的搜一遍解空间。solver.ts 就干这件事。
 *
 * 规则(一维棋盘,类似单人跳棋 / peg solitaire):
 *  - 棋盘是 cells 0..N-1。scout(玩家)占一格,若干 zombie 占其它格。
 *  - 一步只能四选一:
 *      walk-left / walk-right : 走到相邻空格(那格不能有 zombie、不能出界)。
 *      jump-left / jump-right : 越过紧邻的 zombie,落到它后面那格——
 *                               要求落点在界内且为空格;被越过的 zombie 被消灭。
 *  - 通关 = 消灭所有 zombie(zombies 清零)。
 *
 * 设计要点:状态完全由 (scout, zombies) 决定,确定性、可哈希、可穷举。
 * 这正是机器 gate 能成立的前提——可机器穷举的正确性维度。
 */

export type Cell = number;

export type State = {
  n: number;            // 棋盘格数
  scout: Cell;          // scout 当前位置
  zombies: Set<Cell>;   // 还活着的 zombie 位置
};

export type Move =
  | { kind: 'walk'; to: Cell }
  | { kind: 'jump'; over: Cell; to: Cell };

export function createState(n: number, scout: Cell, zombies: Cell[]): State {
  return { n, scout, zombies: new Set(zombies) };
}

export function cloneState(s: State): State {
  return { n: s.n, scout: s.scout, zombies: new Set(s.zombies) };
}

export function isWin(s: State): boolean {
  return s.zombies.size === 0;
}

/** 稳定哈希,供 solver 的 visited 去重用。 */
export function hash(s: State): string {
  return `${s.scout}|${[...s.zombies].sort((a, b) => a - b).join(',')}`;
}

function inBounds(s: State, c: Cell): boolean {
  return c >= 0 && c < s.n;
}

/** 枚举当前局面所有合法 move(不改原状态)。 */
export function legalMoves(s: State): Move[] {
  const moves: Move[] = [];
  for (const dir of [-1, 1]) {
    const adj = s.scout + dir;       // 相邻格
    const beyond = s.scout + 2 * dir; // 隔一格
    if (!inBounds(s, adj)) continue;
    if (s.zombies.has(adj)) {
      // 相邻是 zombie → 尝试越过
      if (inBounds(s, beyond) && !s.zombies.has(beyond)) {
        moves.push({ kind: 'jump', over: adj, to: beyond });
      }
    } else {
      // 相邻是空格 → 可以走过去
      moves.push({ kind: 'walk', to: adj });
    }
  }
  return moves;
}

/** 应用一步,返回新状态(不改原状态)。 */
export function applyMove(s: State, m: Move): State {
  const next = cloneState(s);
  next.scout = m.to;
  if (m.kind === 'jump') next.zombies.delete(m.over);
  return next;
}
