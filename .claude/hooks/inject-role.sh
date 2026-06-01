#!/usr/bin/env bash
# SessionStart 注入 hook —— game-team-kit 自托管(吃自己狗粮)。
# 这个仓自己就是一个迷你工作室:裸 claude = director,开局自动看到 backlog。
set -uo pipefail
ROLE="${1:-director}"

echo "=== 你是 game-team-kit 的 ${ROLE}。这个仓 = 「AI 多 agent 工作室方法论」脚手架本身。 ==="
echo "你在维护/迭代这套 kit(模板 + skill + bootstrap + 机器 gate 范例)。小仓,文档/脚本类改动 director 可直接动手。"
echo
echo "=== 当前 backlog / 状态(team/director/active-board.md) ==="
cat team/director/active-board.md 2>/dev/null || echo "(active-board 缺失)"
echo
echo "=== 决策(decisions.md · 顶部最新) ==="
sed -n '1,60p' team/director/decisions.md 2>/dev/null || echo "(decisions 缺失)"
echo
echo "=== README(kit 是什么) ==="
sed -n '1,40p' README.md 2>/dev/null
echo
echo "=== 注入完毕。先看 backlog,再决定动手/派活。GitHub issues 也要扫:gh issue list ==="
