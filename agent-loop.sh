#!/usr/bin/env bash
#
# agent-loop.sh — run Cursor's CLI agent unattended for a bounded stretch of
# hours, checkpointing progress so it can be reviewed (or rolled back) after
# the fact instead of trusted blindly.
#
# WHY A LOOP OF SHORT RUNS INSTEAD OF ONE LONG CALL
# Cursor's non-interactive mode (`-p` / `--print`) runs one bounded request to
# completion and exits — it doesn't loop internally for hours on its own. So
# "keep circling for a few hours" has to be built as an outside loop: many
# short, focused agent calls, each one tested and committed before the next
# starts. That's also what makes "test often" and "refactor often" actually
# enforceable — a single giant multi-hour call would produce one huge,
# unreviewable diff with no checkpoints along the way.
#
# WHERE THE AGENT'S MEMORY OF PROGRESS LIVES
# Each iteration is a fresh call — continuity across iterations comes from
# the repo itself (git history + docs/06_ROADMAP/next-actions.md), not from
# chat/session memory. That's deliberate: it's more robust across a
# multi-hour unattended run than one accumulating session, and it means you
# can read the docs afterward and see exactly what happened and why.
#
# SAFETY DEFAULTS — READ BEFORE RUNNING
# This uses --force (a.k.a. --yolo), which lets the agent edit files and run
# shell commands with no y/n prompts. That's required for anything unattended
# — but it also means an unsupervised agent can run arbitrary commands in
# your working tree for hours. Two guardrails are on by default:
#   1. USE_WORKTREE=true — edits happen in an isolated git worktree, not your
#      real working tree, so "main" is untouched until you review and merge.
#      This script then verifies and commits *inside that worktree* (otherwise
#      git status here would always look empty).
#   2. Circuit breakers below stop the loop on repeated no-op or failing
#      iterations instead of grinding on for the full duration regardless.
# Start this on a clean git working tree, ideally in a container/sandbox or
# a disposable VM if you have one — not on a machine with anything else
# unsaved.
#
# THIS REPO
# App code lives in web/. Root has no package.json. Verification is
# `cd web && npm run build` plus lint/test if those scripts exist.
# The clickable slice is allowed; eight-step assembly, Galaxy, Neon, and
# extra routes are not. After the slice stop condition, iterations should
# no-op rather than invent the next product.

set -uo pipefail   # NOT -e: one failed step inside an iteration shouldn't
                    # kill the whole multi-hour run; each step below handles
                    # its own failure explicitly.

# ---------------------------------------------------------------------------
# Configuration — override any of these via environment variables, e.g.:
#   DURATION_HOURS=6 USE_WORKTREE=false ./agent-loop.sh
# ---------------------------------------------------------------------------

DURATION_HOURS="${DURATION_HOURS:-4}"                 # how long to keep circling
MODEL="${MODEL:-}"                                    # empty = cursor-agent's default
USE_WORKTREE="${USE_WORKTREE:-true}"                  # isolate edits from your real tree
WORKTREE_NAME="${WORKTREE_NAME:-agent-loop}"
ITERATION_SLEEP_SECS="${ITERATION_SLEEP_SECS:-10}"     # brief pause between iterations
MAX_CONSECUTIVE_NOOPS="${MAX_CONSECUTIVE_NOOPS:-3}"    # stop if N iterations change nothing
MAX_CONSECUTIVE_TEST_FAILS="${MAX_CONSECUTIVE_TEST_FAILS:-3}"  # stop if tests keep failing

RUN_DIR=".agent-loop"
LOG_DIR="$RUN_DIR/logs"
STATUS_FILE="$RUN_DIR/status.md"
STOP_FILE="$RUN_DIR/STOP"

# The brief every iteration gets. Paths match this repo (2026-08-20).
read -r -d '' ITERATION_PROMPT << 'EOF' || true
You are continuing unattended, multi-hour work on second-pen. Before
touching anything, read:

- AGENTS.md
- docs/06_ROADMAP/CLICKABLE_SLICE.md
- docs/06_ROADMAP/next-actions.md
- docs/03_DECISIONS/PROTOTYPE_GUARDRAILS.md
- docs/02_ARCHITECTURE/ARCHITECTURE.md
- docs/03_DECISIONS/ADR/README.md (ADR-001 through ADR-005 — there are no
  ADR-001a/b/c candidates)

Pick ONE concrete next task from next-actions.md — small enough to finish,
verify, and leave ready to commit in this single pass. Implement it in web/
only unless the task is a doc update. Do not overwrite root README.md or
AGENTS.md unless the punch list explicitly says to.

Run verification from web/: `npm run build`, plus `npm run lint` and
`npm run test` if those scripts exist. Fix what you broke before moving on.
Refactor as you go rather than letting rough edges accumulate, but don't
gold-plate.

Guardrails (also in AGENTS.md): no new nav item, tab, or browsable list
without flagging it in your summary; audience stays inferred, not a
home-screen setting; Galaxy stays visualization-only (do not build it);
do not copy the kickoff baseline's repo tree; no dashboard/library/
profiles/evaluations; no eight-step context assembly; no Neon; no CLI
spawn on Vercel; no critic loop in this slice. After speak/type → draft →
listen → download .md works, stop adding product features.

If you hit a decision that's genuinely open (named under "needs a human
decision" in next-actions.md, or STACK_DECISIONS.md vendor rows), don't
guess — leave it in that section and stop touching that area for this
iteration.

Do not git push. The outer loop commits locally.

Before finishing, update docs/06_ROADMAP/next-actions.md with what you
just did, whether the slice is complete, and what the sensible next task
is, so the next iteration (which starts with no memory of this one beyond
the repo itself) can pick it up correctly. End your response with a
one-line summary of what changed.
EOF

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "error: run this from inside a git repository." >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "error: working tree isn't clean. Commit or stash first — this script" >&2
  echo "       needs a clean baseline to tell real progress from noise." >&2
  exit 1
fi

CURSOR_BIN=""
for candidate in cursor-agent agent; do
  if command -v "$candidate" > /dev/null 2>&1; then
    CURSOR_BIN="$candidate"
    break
  fi
done
if [ -z "$CURSOR_BIN" ]; then
  echo "error: couldn't find 'cursor-agent' or 'agent' on PATH." >&2
  echo "       install with: curl https://cursor.com/install -fsS | bash" >&2
  exit 1
fi

ORIGIN_ROOT="$(git rev-parse --show-toplevel)"
mkdir -p "$ORIGIN_ROOT/$LOG_DIR"
rm -f "$ORIGIN_ROOT/$STOP_FILE"

START_EPOCH=$(date +%s)
END_EPOCH=$(( START_EPOCH + DURATION_HOURS * 3600 ))
ITERATION=0
CONSECUTIVE_NOOPS=0
CONSECUTIVE_TEST_FAILS=0

# Where this iteration's git/verify should run. Cursor --worktree isolates
# edits; committing in ORIGIN_ROOT would then always look like a no-op.
resolve_work_root() {
  if [ "$USE_WORKTREE" != "true" ]; then
    printf '%s\n' "$ORIGIN_ROOT"
    return
  fi
  local candidate path
  for candidate in \
    "$HOME/.cursor/worktrees/$WORKTREE_NAME" \
    "$HOME/.cursor/worktrees/"*"/$WORKTREE_NAME" \
    "$HOME/.cursor/worktrees/"*"$WORKTREE_NAME"*; do
    if [ -d "$candidate" ] && { [ -d "$candidate/.git" ] || [ -f "$candidate/.git" ]; }; then
      printf '%s\n' "$candidate"
      return
    fi
  done
  path="$(git -C "$ORIGIN_ROOT" worktree list 2>/dev/null | awk -v n="$WORKTREE_NAME" '$0 ~ n { print $1; exit }')"
  if [ -n "$path" ] && [ -d "$path" ]; then
    printf '%s\n' "$path"
    return
  fi
  printf '%s\n' "$ORIGIN_ROOT"
}

write_status() {
  local elapsed_min=$(( ( $(date +%s) - START_EPOCH ) / 60 ))
  local work_root
  work_root="$(resolve_work_root)"
  {
    echo "# agent-loop status"
    echo
    echo "- started: $(date -r "$START_EPOCH" 2>/dev/null || date -d "@$START_EPOCH")"
    echo "- elapsed: ${elapsed_min} min"
    echo "- iterations completed: $ITERATION"
    echo "- consecutive no-op iterations: $CONSECUTIVE_NOOPS"
    echo "- consecutive test failures: $CONSECUTIVE_TEST_FAILS"
    echo "- work root: $work_root"
    echo "- last commit: $(git -C "$work_root" log -1 --format='%h %s' 2>/dev/null || echo 'none yet')"
    echo
    echo "To stop gracefully after the current iteration: touch $STOP_FILE"
  } > "$ORIGIN_ROOT/$STATUS_FILE"
}

run_verification() {
  # Best-effort: run whatever test/build/lint scripts actually exist in web/.
  # Returns 0 if everything that ran passed, 1 if anything failed.
  local ok=0
  local work_root="$1"
  local pkg="$work_root/web/package.json"
  if [ -f "$pkg" ]; then
    local pm=npm
    [ -f "$work_root/web/pnpm-lock.yaml" ] && pm=pnpm
    [ -f "$work_root/web/yarn.lock" ] && pm=yarn
    (
      cd "$work_root/web" || exit 1
      for script in lint typecheck test build; do
        if node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts['$script'] ? 0 : 1)" 2>/dev/null; then
          echo "--- running: $pm run $script ---"
          if ! "$pm" run "$script"; then
            exit 1
          fi
        fi
      done
    ) || ok=1
  else
    echo "(no web/package.json found yet — skipping automated verification for this iteration)"
  fi
  return $ok
}

trap 'echo; echo "interrupted — writing final status"; write_status; exit 130' INT TERM

echo "Starting agent-loop: up to ${DURATION_HOURS}h, using '$CURSOR_BIN', worktree=${USE_WORKTREE}"
echo "Status file: $STATUS_FILE   |   stop gracefully any time with: touch $STOP_FILE"
write_status

# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

while [ "$(date +%s)" -lt "$END_EPOCH" ]; do
  if [ -f "$ORIGIN_ROOT/$STOP_FILE" ]; then
    echo "stop file found — ending gracefully."
    break
  fi

  ITERATION=$((ITERATION + 1))
  TS="$(date +%Y%m%d-%H%M%S)"
  ITER_LOG="$ORIGIN_ROOT/$LOG_DIR/iter-${ITERATION}-${TS}.log"
  echo "=== iteration $ITERATION — $(date) ==="

  WORK_ROOT="$(resolve_work_root)"
  BEFORE_HASH="$(git -C "$WORK_ROOT" rev-parse HEAD)"

  CURSOR_ARGS=(-p --force --output-format text)
  [ -n "$MODEL" ] && CURSOR_ARGS+=(--model "$MODEL")
  if [ "$USE_WORKTREE" = "true" ]; then
    CURSOR_ARGS+=(--worktree "$WORKTREE_NAME")
  fi

  if (cd "$ORIGIN_ROOT" && "$CURSOR_BIN" "${CURSOR_ARGS[@]}" "$ITERATION_PROMPT") > "$ITER_LOG" 2>&1; then
    echo "agent call: ok (log: $ITER_LOG)"
  else
    echo "agent call: failed (log: $ITER_LOG) — continuing to next iteration"
  fi

  WORK_ROOT="$(resolve_work_root)"
  AFTER_HASH="$(git -C "$WORK_ROOT" rev-parse HEAD)"
  CHANGED="$(git -C "$WORK_ROOT" status --porcelain)"

  if [ -n "$CHANGED" ] || [ "$BEFORE_HASH" != "$AFTER_HASH" ]; then
    CONSECUTIVE_NOOPS=0

    if [ -n "$CHANGED" ]; then
      if run_verification "$WORK_ROOT" 2>&1 | tee -a "$ITER_LOG"; then
        CONSECUTIVE_TEST_FAILS=0
        git -C "$WORK_ROOT" add -A
        git -C "$WORK_ROOT" commit -q -m "agent-loop: iteration $ITERATION — $(date +%Y-%m-%d\ %H:%M)" \
          -m "Automated, unattended commit. See $ITER_LOG for the full transcript."
        echo "verification passed — committed."
      else
        CONSECUTIVE_TEST_FAILS=$((CONSECUTIVE_TEST_FAILS + 1))
        echo "verification FAILED (${CONSECUTIVE_TEST_FAILS}/${MAX_CONSECUTIVE_TEST_FAILS} in a row)."
        git -C "$WORK_ROOT" add -A
        git -C "$WORK_ROOT" commit -q -m "agent-loop: iteration $ITERATION (FAILING verification) — $(date +%Y-%m-%d\ %H:%M)" \
          -m "Committed so the failure is inspectable; see $ITER_LOG."
        if [ "$CONSECUTIVE_TEST_FAILS" -ge "$MAX_CONSECUTIVE_TEST_FAILS" ]; then
          echo "too many consecutive failures — stopping for a human to look."
          write_status
          break
        fi
      fi
    else
      echo "agent already committed ($BEFORE_HASH → $AFTER_HASH) — skipping a second commit."
    fi
  else
    CONSECUTIVE_NOOPS=$((CONSECUTIVE_NOOPS + 1))
    echo "no changes this iteration (${CONSECUTIVE_NOOPS}/${MAX_CONSECUTIVE_NOOPS})."
    if [ "$CONSECUTIVE_NOOPS" -ge "$MAX_CONSECUTIVE_NOOPS" ]; then
      echo "agent produced nothing new for $CONSECUTIVE_NOOPS iterations in a row — stopping."
      write_status
      break
    fi
  fi

  write_status
  sleep "$ITERATION_SLEEP_SECS"
done

echo
echo "=== agent-loop finished after $ITERATION iteration(s) ==="
write_status
cat "$ORIGIN_ROOT/$STATUS_FILE"
if [ "$USE_WORKTREE" = "true" ]; then
  echo
  echo "Edits happened in an isolated worktree (name: $WORKTREE_NAME), not your"
  echo "real working tree. Look under ~/.cursor/worktrees/ for it, review the"
  echo "commits, and merge back manually once you're happy with them."
fi
