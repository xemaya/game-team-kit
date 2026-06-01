/**
 * api-contract gate —— 把 API 响应的「契约」(字段集 + 类型)冻成 snapshot,
 * 任何让响应形状漂移的改动都会被测试抓到。
 *
 * 关键点:契约测的是**形状**(有哪些字段、各是什么类型),不是具体值。
 * 值会变(price=9.9 → 10.1 正常),但「price 字段消失 / 从 number 变 string /
 * 新增未声明字段」必须报警——这些是会悄悄打挂下游消费方的破坏性变更。
 *
 * 对标 methodology §4「API 的契约测试」。snapshot 见 contract.snapshot.json。
 */

/** 被测系统:这里用纯函数模拟一个 handler;真实项目里换成 fetch(API) 即可。 */
export function getUserResponse(id: string) {
  return {
    id,
    name: 'Ada',
    email: 'ada@example.com',
    age: 36,
    active: true,
    roles: ['admin', 'user'],
  };
}

/** 递归推导一个值的「形状指纹」:对象→字段名+各字段类型;数组→element 类型。 */
export function shapeOf(v: unknown): unknown {
  if (Array.isArray(v)) {
    return [v.length > 0 ? shapeOf(v[0]) : 'unknown'];
  }
  if (v !== null && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v).sort()) {
      out[k] = shapeOf((v as Record<string, unknown>)[k]);
    }
    return out;
  }
  return typeof v; // 'string' | 'number' | 'boolean' | ...
}
