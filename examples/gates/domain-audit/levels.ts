/**
 * 关卡注册表 —— audit gate 的输入。
 *
 * 真实项目里这通常是 `src/game/registries/levels.ts` 之类的关卡数据。
 * 改动这个文件的任何任务,验收时都必须贴出 `node audit.ts` 的「N/N 可过」结果
 * (见 README + methodology §4「领域专属正确性 audit gate」)。
 */

export type Level = {
  id: string;
  n: number;
  scout: number;
  zombies: number[];
  /** mustBeSolvable=true 的关若搜不出解,audit 直接判 gate 失败(exit 2)。 */
  mustBeSolvable: boolean;
};

export const LEVELS: Level[] = [
  // 最小可解:一个 zombie 紧邻,后面有空格落点。
  { id: 'level-1', n: 3, scout: 0, zombies: [1], mustBeSolvable: true },
  // 需要先 walk(0→1)再 jump(越过 2 落到 3)。
  { id: 'level-2', n: 4, scout: 0, zombies: [2], mustBeSolvable: true },
  // 两端各一,需要来回。
  { id: 'level-3', n: 7, scout: 3, zombies: [2, 4], mustBeSolvable: true },
  // 稍大,链式清场。
  { id: 'level-4', n: 9, scout: 0, zombies: [1, 3, 5, 7], mustBeSolvable: true },
];
