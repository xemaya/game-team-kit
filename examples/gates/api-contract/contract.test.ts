/**
 * contract.test.ts — API 契约 gate。
 *   node --test examples/gates/api-contract/contract.test.ts
 *
 * 把当前响应的形状指纹和冻结的 snapshot 对比;不一致即契约漂移。
 * 要故意改契约时:改 contract.snapshot.json 并在 PR / DEC 里说明「为何破约」。
 *
 * 更新 snapshot(确认是有意变更后):
 *   node -e "import('./contract.ts').then(m=>console.log(JSON.stringify(m.shapeOf(m.getUserResponse('x')),null,2)))" > contract.snapshot.json
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getUserResponse, shapeOf } from './contract.ts';

const here = dirname(fileURLToPath(import.meta.url));
const snapshot = JSON.parse(readFileSync(join(here, 'contract.snapshot.json'), 'utf-8'));

test('getUser 响应形状未漂移(对比冻结 snapshot)', () => {
  const actual = shapeOf(getUserResponse('u1'));
  assert.deepEqual(actual, snapshot);
});

test('shapeOf 抓得到破坏性变更:字段类型从 number 变 string', () => {
  const drifted = { ...getUserResponse('u1'), age: '36' };
  assert.notDeepEqual(shapeOf(drifted), snapshot);
});

test('shapeOf 抓得到破坏性变更:字段消失', () => {
  const { email, ...rest } = getUserResponse('u1');
  assert.notDeepEqual(shapeOf(rest), snapshot);
});
