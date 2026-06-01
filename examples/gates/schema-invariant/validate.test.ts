/**
 * validate.test.ts — gate 自验:校验器必须抓到已知坏数据,放过已知好数据。
 *   node --test examples/gates/schema-invariant/validate.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, checkSchema } from './validate.ts';

test('已知好数据:0 issue', () => {
  const rows = [
    { id: 'A', qty: 2, unitPrice: 3, lineTotal: 6 },
    { id: 'B', qty: 0, unitPrice: 5, lineTotal: 0 },
  ];
  assert.deepEqual(validate(rows), []);
});

test('schema:缺字段/类型错被抓', () => {
  const issues = checkSchema([{ id: 'A', qty: 'two', unitPrice: 3, lineTotal: 6 }]);
  assert.ok(issues.some((i) => i.where === '[0].qty'));
});

test('不变量:对账错(lineTotal != qty*unitPrice)被抓', () => {
  const issues = validate([{ id: 'A', qty: 2, unitPrice: 3, lineTotal: 7 }]);
  assert.ok(issues.some((i) => /lineTotal/.test(i.msg)));
});

test('不变量:重复 id 被抓', () => {
  const issues = validate([
    { id: 'A', qty: 1, unitPrice: 1, lineTotal: 1 },
    { id: 'A', qty: 1, unitPrice: 1, lineTotal: 1 },
  ]);
  assert.ok(issues.some((i) => i.msg === 'duplicate id'));
});

test('不变量:负数被抓', () => {
  const issues = validate([{ id: 'A', qty: -1, unitPrice: 1, lineTotal: -1 }]);
  assert.ok(issues.some((i) => /qty<0/.test(i.msg)));
});
