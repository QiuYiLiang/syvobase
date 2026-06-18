#!/usr/bin/env bash
#
# 一键 pnpm link 本地依赖（数据驱动版，自包含，无外部脚本）
#
# 原理：
#   1. 内联 node 扫描仓库一级目录，建立「包名 -> 目录」映射（仅收集 name
#      以 @syvobase/ 开头的包）。
#   2. 读取每个 package.json 的 dependencies / devDependencies / peerDependencies，
#      凡是形如 @syvobase/xxx 且能在本地找到对应目录的，就执行 pnpm link <该目录>。
#   依赖关系完全由各 package.json 自动推导，无需在此维护。
#   Windows 下可用等价的 link.bat。
#
# 用法：
#   bash scripts/link.sh              建立全部 link
#   SCOPE=@some/ bash scripts/link.sh 指定作用域（默认 @syvobase/）
#   bash scripts/link.sh --unlink     拆除 link（best-effort，见文末说明）
#
set -euo pipefail

# ---- 定位仓库根目录（脚本位于 <root>/scripts/ 下）-----------------------------
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCOPE="${SCOPE:-@syvobase/}"

# ---- 颜色输出 ----------------------------------------------------------------
if [[ -t 1 ]]; then
  C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'
  C_RED=$'\033[31m'; C_BOLD=$'\033[1m'; C_GREY=$'\033[90m'; C_RESET=$'\033[0m'
else
  C_CYAN=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_BOLD=''; C_GREY=''; C_RESET=''
fi
log()  { printf '%s▶%s %s\n'  "$C_CYAN"   "$C_RESET" "$*"; }
ok()   { printf '%s✓%s %s\n'  "$C_GREEN"  "$C_RESET" "$*"; }
warn() { printf '%s!%s %s\n'  "$C_YELLOW" "$C_RESET" "$*"; }
err()  { printf '%s✗%s %s\n'  "$C_RED"    "$C_RESET" "$*" >&2; }
title(){ printf '\n%s== %s ==%s\n' "$C_BOLD" "$*" "$C_RESET"; }
dim()  { printf '%s%s%s\n' "$C_GREY" "$*" "$C_RESET"; }

# ---- 解析参数 ----------------------------------------------------------------
UNLINK=0
[[ "${1:-}" == "--unlink" ]] && UNLINK=1

command -v node >/dev/null 2>&1 || { err "未找到 node"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { err "未找到 pnpm"; exit 1; }

# ---- 依赖图分析（内联 node）-------------------------------------------------
#   输出（每行一条，'|' 分隔）：
#     LINK|<consumer>|<depName>|<depDir>   需要建立的 link
#     WARN|<consumer>|<depName>            声明了作用域内包但本地无对应目录
PLAN_OUTPUT="$(
SYVO_ROOT="$ROOT" SYVO_SCOPE="$SCOPE" node <<'NODE'
const fs = require('fs'), path = require('path');
const root = process.env.SYVO_ROOT, scope = process.env.SYVO_SCOPE || '@syvobase/';
const isDir = d => { try { return fs.statSync(path.join(root, d)).isDirectory(); } catch { return false; } };
const dirs = fs.readdirSync(root).filter(d => !d.startsWith('.') && d !== 'node_modules' && isDir(d));
const readPkg = d => { try { return JSON.parse(fs.readFileSync(path.join(root, d, 'package.json'), 'utf8')); } catch { return null; } };
const byName = {};
for (const d of dirs) {
  const p = readPkg(d);
  if (p && typeof p.name === 'string' && p.name.startsWith(scope)) byName[p.name] = d;
}
for (const d of dirs) {
  const p = readPkg(d); if (!p) continue;
  const names = new Set();
  for (const f of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const o = p[f]; if (!o) continue;
    for (const k of Object.keys(o)) if (k.startsWith(scope)) names.add(k);
  }
  for (const name of names) {
    const depDir = byName[name];
    if (!depDir) { console.log(`WARN|${d}|${name}`); continue; } // 本地无对应目录
    if (depDir === d) continue;                                  // 不 link 自己
    console.log(`LINK|${d}|${name}|${depDir}`);
  }
}
NODE
)" || { err "依赖图分析失败"; exit 1; }

LINKS=(); WARN_DEPS=()
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  IFS='|' read -r kind a b c <<< "$line"
  case "$kind" in
    LINK) LINKS+=("$a|$b|$c") ;;
    WARN) WARN_DEPS+=("$a|$b") ;;
  esac
done <<< "$PLAN_OUTPUT"

# ---- 依赖图分析总览 ----------------------------------------------------------
title "依赖图分析（作用域 $SCOPE，共 ${#LINKS[@]} 条 link）"
if [[ ${#LINKS[@]} -eq 0 && ${#WARN_DEPS[@]} -eq 0 ]]; then
  warn "未发现任何 $SCOPE 依赖关系，无需 link。退出。"
  exit 0
fi
for spec in "${LINKS[@]}"; do
  IFS='|' read -r consumer depName depDir <<< "$spec"
  dim "  $consumer  ←  $depName  ($depDir)"
done
for spec in "${WARN_DEPS[@]}"; do
  IFS='|' read -r consumer depName <<< "$spec"
  warn "$consumer 声明了 $depName，但本地一级目录中无对应包（已跳过）"
done

# ---- 工具函数 ----------------------------------------------------------------
has_pkg_json() { [[ -f "$ROOT/$1/package.json" ]]; }

# 校验 consumer 的 node_modules/<depName> 是否符号链接指向 depDir
# （pnpm 可能因 ERR_PNPM_IGNORED_BUILDS 返回非零，故用文件系统做权威判定）
is_linked() {
  SYVO_NM="$ROOT/$1/node_modules/$2" SYVO_DEP="$ROOT/$3" \
    node -e 'let ok=false;try{const f=require("fs");ok=f.realpathSync(process.env.SYVO_NM)===f.realpathSync(process.env.SYVO_DEP)}catch(e){}process.exit(ok?0:1)' \
    >/dev/null 2>&1
}

# ---- 执行 link / unlink ------------------------------------------------------
if [[ "$UNLINK" == "1" ]]; then title "拆除本地 link（best-effort）"
else                            title "建立本地 pnpm link"; fi

linked=0; failed=0
declare -A seen_consumer

for spec in "${LINKS[@]}"; do
  IFS='|' read -r consumer depName depDir <<< "$spec"

  if ! has_pkg_json "$consumer"; then
    warn "跳过 $consumer ← $depName：$consumer/package.json 不存在"; continue
  fi
  if ! has_pkg_json "$depDir"; then
    err  "跳过 $consumer ← $depName：$depDir/package.json 不存在"; continue
  fi

  if [[ "$UNLINK" == "1" ]]; then
    # 内部包未发布到 registry，pnpm install 可能失败；失败时提示手动清理。
    if [[ -z "${seen_consumer[$consumer]:-}" ]]; then
      log "unlink $consumer (pnpm install)"
      if ( cd "$ROOT/$consumer" && pnpm install >/dev/null 2>&1 ); then
        ok "已尝试恢复 $consumer"; linked=$((linked+1))
      else
        err "恢复 $consumer 失败（内部包未发布？请手动删除符号链接）"; failed=$((failed+1))
      fi
      seen_consumer[$consumer]=1
    fi
    continue
  fi

  log "link  $consumer  ←  $depName  ($depDir)"
  # 消费者首次操作前先 install，确保 node_modules/lockfile 就绪
  if [[ -z "${seen_consumer[$consumer]:-}" ]]; then
    ( cd "$ROOT/$consumer" && pnpm install >/dev/null 2>&1 ) || true
    seen_consumer[$consumer]=1
  fi
  # 执行 link（pnpm 可能因 ERR_PNPM_IGNORED_BUILDS 返回非零，忽略其退出码）
  ( cd "$ROOT/$consumer" && pnpm link "$ROOT/$depDir" >/dev/null 2>&1 ) || true
  # 用文件系统校验是否真的 link 成功（权威判定）
  if is_linked "$consumer" "$depName" "$depDir"; then
    ok "$consumer  ←  $depName"; linked=$((linked+1))
  else
    err "link 失败：$consumer ← $depName（$depName 未能指向 $depDir）"
    failed=$((failed+1))
  fi
done

# ---- 汇总 --------------------------------------------------------------------
title "完成"
if [[ "$UNLINK" == "1" ]]; then
  ok "恢复: $linked  失败: $failed"
else
  ok "成功 link: $linked  失败: $failed"
  cat <<'TIP'
提示：
  * 新增/删除某个 package.json 里的 @syvobase/ 依赖后，重跑本脚本即可自动同步。
  * 包名以各 package.json 的 name 字段为准（如 syvobase-core 目录的包名为 @syvobase/schema）。
TIP
  [[ "$failed" -gt 0 ]] && { err "存在失败项，请检查上方日志。"; exit 1; }
fi
exit 0
