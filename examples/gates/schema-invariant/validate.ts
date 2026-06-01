/**
 * schema-invariant gate —— 数据管线的「形状 + 不变量」校验。
 *
 *   node examples/gates/schema-invariant/validate.ts data.json
 *   node examples/gates/schema-invariant/validate.ts            # 用内置 demo 数据
 *
 * 两层校验:
 *   1. schema:每条记录的字段存在 + 类型对(单条形状)。
 *   2. invariant:跨记录的业务不变量(id 唯一、金额非负、总账对得上 …)。
 * 后者才是人眼审不出、却一旦错就致命的那层——机器 gate 的价值所在。
 *
 * 对标 methodology §4「数据管线的 schema/不变量校验」。
 */

export type Record = {
  id: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type Issue = { where: string; msg: string };

const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** 第 1 层:单条记录的 schema(形状 + 类型)。 */
export function checkSchema(rows: unknown): Issue[] {
  const issues: Issue[] = [];
  if (!Array.isArray(rows)) return [{ where: 'root', msg: 'expected an array of records' }];
  rows.forEach((r, i) => {
    const o = r as Record;
    if (!isStr(o?.id)) issues.push({ where: `[${i}].id`, msg: 'missing/!string' });
    if (!isNum(o?.qty)) issues.push({ where: `[${i}].qty`, msg: 'missing/!number' });
    if (!isNum(o?.unitPrice)) issues.push({ where: `[${i}].unitPrice`, msg: 'missing/!number' });
    if (!isNum(o?.lineTotal)) issues.push({ where: `[${i}].lineTotal`, msg: 'missing/!number' });
  });
  return issues;
}

/** 第 2 层:跨记录不变量(只在 schema 已过的数据上跑)。 */
export function checkInvariants(rows: Record[]): Issue[] {
  const issues: Issue[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.id)) issues.push({ where: r.id, msg: 'duplicate id' });
    seen.add(r.id);
    if (r.qty < 0) issues.push({ where: r.id, msg: `qty<0 (${r.qty})` });
    if (r.unitPrice < 0) issues.push({ where: r.id, msg: `unitPrice<0 (${r.unitPrice})` });
    // 对账:lineTotal 必须 == qty * unitPrice(浮点容差 1e-9)。
    const expected = r.qty * r.unitPrice;
    if (Math.abs(r.lineTotal - expected) > 1e-9) {
      issues.push({ where: r.id, msg: `lineTotal ${r.lineTotal} != qty*unitPrice ${expected}` });
    }
  }
  return issues;
}

/** 完整 gate:schema 先过,再查不变量。返回所有 issue。 */
export function validate(rows: unknown): Issue[] {
  const schemaIssues = checkSchema(rows);
  if (schemaIssues.length > 0) return schemaIssues; // 形状都不对,不必查不变量
  return checkInvariants(rows as Record[]);
}

// ---- CLI ----
async function main(): Promise<void> {
  const file = process.argv[2];
  let rows: unknown;
  if (file) {
    const { readFile } = await import('node:fs/promises');
    rows = JSON.parse(await readFile(file, 'utf-8'));
  } else {
    // 内置 demo:全绿数据。
    rows = [
      { id: 'A', qty: 2, unitPrice: 3, lineTotal: 6 },
      { id: 'B', qty: 1, unitPrice: 10, lineTotal: 10 },
    ];
  }
  const issues = validate(rows);
  if (issues.length === 0) {
    console.log('✓ schema + invariant gate passed');
  } else {
    console.log(`✗ ${issues.length} issue(s):`);
    for (const it of issues) console.log(`  - ${it.where}: ${it.msg}`);
    process.exit(2);
  }
}

// 仅作为脚本运行时执行 main(被 import 进测试时不跑)。
if (process.argv[1]?.endsWith('validate.ts')) main();
