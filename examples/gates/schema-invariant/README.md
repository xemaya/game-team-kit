# schema-invariant — 数据管线 schema + 不变量 gate

> 守数据管线里「人眼审不出」的两层:**单条记录的形状**(schema)+ **跨记录的业务不变量**
> (id 唯一、对账平、非负)。后者才是真正危险的——一条对不上账的记录混在十万条里,
> 人工根本翻不到。

## 文件

| 文件 | 作用 |
|---|---|
| `validate.ts` | 两层校验:`checkSchema`(形状/类型)+ `checkInvariants`(跨记录不变量);CLI 形态 `exit 2` |
| `validate.test.ts` | gate 自验:已知好数据 0 issue;缺字段/对账错/重复 id/负数都被抓 |

## 跑

```bash
node examples/gates/schema-invariant/validate.ts            # 内置 demo 数据
node examples/gates/schema-invariant/validate.ts data.json # 校验真实文件
node --test examples/gates/schema-invariant/validate.test.ts
```

## 搬到你的项目

- 把 `Record` 类型 + `checkSchema` 换成你的数据结构(或接 zod/ajv 等 schema 库)。
- **重点投资 `checkInvariants`** —— schema 库帮你管形状,但「lineTotal == qty×unitPrice」
  「子项之和 == 总计」「外键都存在」这类业务不变量,得你自己写。这正是 gate 的价值区。
- 接进管线:ETL / 导入 / 迁移的最后一步跑这道 gate,红了就别让脏数据落库。
