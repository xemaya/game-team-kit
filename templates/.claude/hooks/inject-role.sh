#!/usr/bin/env bash
# SessionStart context injector for role agents (claude --agent <role>).
# Arg1 = role name. Stdout is added to the session context by Claude Code.
#
# 取代手动「启动咒」里「读 HARNESS / persona / tasks / decisions」那几步 ——
# 角色 session 一启动就自动拿到:全局约束 + 自己的定位/看板 + scope 边界。
# director 额外拿到派工协议 + 实时状态板。
#
# 通用 kit 版:角色集由本项目 team/ 下实际存在的目录决定;hook 只 cat 存在的文件,
# 不强依赖某个具体角色(art/audio/gameplay 这类游戏角色可换成 backend/data/ml)。
set -uo pipefail
ROLE="${1:-unknown}"

echo "=== 你是 ${ROLE} agent。以下是自动注入的固定上下文(必读) ==="
echo

echo "=== HARNESS.md (全 agent 约束 · 高于一切 · 必守) ==="
cat HARNESS.md 2>/dev/null || echo "(HARNESS.md 缺失)"
echo

if [ -f "team/${ROLE}/persona.md" ]; then
  echo "=== team/${ROLE}/persona.md (你的角色定位) ==="
  cat "team/${ROLE}/persona.md"
  echo
fi

if [ -f "team/${ROLE}/tasks.md" ]; then
  echo "=== team/${ROLE}/tasks.md (你的任务看板) ==="
  cat "team/${ROLE}/tasks.md"
  echo
fi

echo "=== team/director/decisions.md 最近决策 (scope 边界 · 顶部最新) ==="
sed -n '1,90p' team/director/decisions.md 2>/dev/null || echo "(decisions.md 缺失)"
echo

# Director 额外需要派工流程 + 实时状态板
if [ "${ROLE}" = "director" ]; then
  echo "=== team/director/handoff-protocol.md (§0 边界 / §4 启动 / §8 process / §9 director 持续性) ==="
  cat team/director/handoff-protocol.md 2>/dev/null
  echo
  echo "=== team/director/active-board.md (实时状态板 · 头部) ==="
  sed -n '1,140p' team/director/active-board.md 2>/dev/null
  echo
fi

echo "=== 上下文注入完毕。按 agent.md 的执行协议开工。 ==="
