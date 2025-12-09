# Technical Specification: DeksdenFlow Integration

> **Version:** 1.0.0
> **Status:** Draft
> **Author:** Claude Code
> **Date:** 2025-11-27

---

## Executive Summary

Интеграция лучших практик из deksden-flow (Memory Bank, Protocol System) в Claude Code Orchestrator Kit с **нулевым влиянием на базовый расход токенов**.

**Ключевой принцип: Lazy Knowledge Loading** — информация загружается только когда нужна.

---

## Problem Statement

### Текущие ограничения

1. **Отсутствие проектной карты** — агенты не знают структуру проекта, тратят токены на Glob/Grep
2. **Потеря контекста между сессиями** — при смене сессии оркестратора весь прогресс теряется
3. **Нет истории решений** — почему сделали так, а не иначе, нигде не фиксируется

### Решения из deksden-flow

| Проблема | Решение в deksden-flow | Наша адаптация |
|----------|------------------------|----------------|
| Структура проекта | Memory Bank index.md | project-index.md (опциональный) |
| Потеря контекста | Protocol context.md | session-context.md |
| История решений | Protocol log.md | session-log.md |

---

## Token Budget Analysis

### Baseline (без изменений)

```
CLAUDE.md:           ~3,500 токенов (читается всегда)
MCP BASE:            ~600 токенов
─────────────────────────────────────
ИТОГО при старте:    ~4,100 токенов
```

### После интеграции

```
CLAUDE.md:           ~3,500 токенов (БЕЗ ИЗМЕНЕНИЙ)
MCP BASE:            ~600 токенов (БЕЗ ИЗМЕНЕНИЙ)
project-index.md:    0 токенов (не читается автоматически)
session-context.md:  0 токенов (не читается автоматически)
─────────────────────────────────────
ИТОГО при старте:    ~4,100 токенов (БЕЗ ИЗМЕНЕНИЙ)
```

### При использовании фич (on-demand)

| Операция | Токены | Когда используется |
|----------|--------|-------------------|
| `load-project-context` skill | +100-200 | Explore агент, сложные задачи |
| Чтение session-context.md | +50-100 | Resume после смены сессии |
| Запись session-log.md | 0 | Write-only операция |

**Вывод: ZERO overhead при обычной работе.**

---

## Scope

### In Scope

1. **Project Index System** — компактная карта проекта
2. **Session Context System** — сохранение/восстановление состояния
3. **Skills для работы с контекстом** — load-project-context, resume-session
4. **Интеграция в Health Workflows** — автоматическое использование

### Out of Scope

1. Full Memory Bank structure (слишком много файлов)
2. Duo Files для агентов (избыточно)
3. C4 Model формализация (уже есть в ARCHITECTURE.md)
4. Изменения CLAUDE.md (сохраняем baseline)
5. Protocol System с нумерацией (у нас другой подход)

---

## Technical Design

## Component 1: Project Index

### Файл: `.claude/project-index.md`

**Назначение:** Компактная карта проекта с аннотированными ссылками.

**Формат:**

```markdown
# Project Index

> Quick navigation for AI agents. Updated: YYYY-MM-DD

## Architecture

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — System design, C4 diagrams, data flow
- **[CLAUDE.md](CLAUDE.md)** — Behavioral rules, orchestration patterns

## Core Domains

### API Layer
- **[packages/api/](packages/api/)** — tRPC routers, auth middleware
  - Key: `src/routers/` — all API endpoints
  - Key: `src/middleware/` — auth, rate limiting

### Database
- **[packages/db/](packages/db/)** — Supabase schema, migrations
  - Key: `migrations/` — SQL migrations
  - Key: `src/schema.ts` — TypeScript types

### Frontend
- **[apps/web/](apps/web/)** — Next.js 15 application
  - Key: `src/app/` — App Router pages
  - Key: `src/components/` — UI components

## Patterns & Conventions

- **Auth:** Supabase Auth + RLS policies
- **State:** React Query for server state
- **Styling:** Tailwind CSS + shadcn/ui
- **Testing:** Vitest for unit, Playwright for E2E

## Recent Changes (last 7 days)

- 2025-11-27: Added reuse-hunting workflow agents
- 2025-11-26: Updated agent configurations
```

**Ограничения:**
- Максимум 150 строк
- Только ключевые директории и файлы
- Аннотации в 1 строку
- Обновляется вручную или через skill

### Skill: `load-project-context`

**Файл:** `.claude/skills/load-project-context/SKILL.md`

```yaml
---
name: load-project-context
description: Load project structure and navigation for complex tasks
trigger: When exploring unfamiliar parts of codebase or starting complex multi-file tasks
---
```

**Алгоритм:**
1. Проверить существование `.claude/project-index.md`
2. Если есть — прочитать и вернуть
3. Если нет — сгенерировать базовый через анализ структуры

**Использование:**
- Explore агент вызывает в начале работы
- Orchestrator вызывает при планировании сложных задач
- Пользователь может вызвать явно

---

## Component 2: Session Context System

### Структура: `.tmp/current/session/`

```
.tmp/current/session/
├── context.md      # Текущее состояние сессии
└── log.md          # История решений и находок
```

### Файл: `context.md`

**Назначение:** Быстрое восстановление контекста при смене сессии.

**Формат:**

```markdown
# Session Context

> Auto-generated. Do not edit manually.

## Current State

- **Workflow:** health-bugs
- **Phase:** 3/7 (Staged Fixing)
- **Priority:** HIGH (5 of 12 fixed)
- **Last Action:** Fixed auth validation in `src/auth.ts`

## Active Files

- `src/auth.ts` — Modified, not committed
- `src/utils/validate.ts` — Modified, not committed

## Next Steps

1. Fix remaining HIGH priority bugs (7 left)
2. Run quality gate (type-check, build)
3. Move to MEDIUM priority

## Git State

- **Branch:** fix/health-bugs-2025-11-27
- **Uncommitted:** 2 files
- **Last Commit:** abc1234 "fix: auth validation"

## Resume Command

To continue this session, read this file and session-log.md
```

### Файл: `log.md`

**Назначение:** История решений, проблем, находок.

**Формат:**

```markdown
# Session Log

## 2025-11-27T14:30:00

### Decision: Auth validation approach

**Problem:** Multiple auth checks scattered across codebase
**Options considered:**
1. Middleware-based (centralized)
2. Per-route validation (current)
3. HOC wrapper

**Chosen:** Option 1 (middleware)
**Reason:** Single source of truth, easier to maintain

---

## 2025-11-27T15:00:00

### Issue: TypeScript error after fix

**Error:** Type 'string | undefined' not assignable to 'string'
**Root cause:** Optional chaining without nullish coalescing
**Fix:** Added `?? ''` fallback

---
```

### Skill: `save-session-context`

**Триггер:** Автоматически при завершении фазы оркестратора.

**Алгоритм:**
1. Собрать текущее состояние (фаза, прогресс, файлы)
2. Получить git status
3. Записать в `.tmp/current/session/context.md`

### Skill: `resume-session`

**Триггер:** При старте оркестратора, если существует context.md.

**Алгоритм:**
1. Проверить `.tmp/current/session/context.md`
2. Если есть и свежий (<24h) — предложить resume
3. Прочитать context.md + последние 10 записей log.md
4. Вернуть состояние для продолжения

---

## Component 3: Integration Points

### Health Orchestrators

**Изменения в:** `bug-orchestrator.md`, `security-orchestrator.md`, etc.

```markdown
## Phase 0: Session Check (NEW)

1. Check for existing session context
2. If exists and fresh:
   - Ask user: "Found previous session. Resume or start fresh?"
   - If resume: load context, continue from last phase
3. If not exists or stale:
   - Start fresh session
   - Create session context files

## Phase N: After each phase (MODIFIED)

1. ... existing logic ...
2. **NEW:** Save session context via `save-session-context` skill
3. **NEW:** Append significant decisions to session log
```

### Explore Agent

**Изменения в:** Описание агента в settings

```markdown
## Context Loading (NEW)

Before exploring:
1. Call `load-project-context` skill
2. Use project index to narrow search scope
3. Prefer annotated paths over blind Glob/Grep
```

---

## Implementation Plan

### Phase 1: Project Index (Priority: HIGH)

| Task | Deliverable | Effort |
|------|-------------|--------|
| 1.1 | Create `project-index.template.md` | 1h |
| 1.2 | Create skill `load-project-context` | 2h |
| 1.3 | Update Explore agent description | 30m |
| 1.4 | Document in TUTORIAL | 1h |

**Acceptance Criteria:**
- [ ] Template exists with clear format
- [ ] Skill correctly reads and returns index
- [ ] Skill handles missing file gracefully
- [ ] Explore agent uses index when available

### Phase 2: Session Context (Priority: HIGH)

| Task | Deliverable | Effort |
|------|-------------|--------|
| 2.1 | Create skill `save-session-context` | 2h |
| 2.2 | Create skill `resume-session` | 2h |
| 2.3 | Integrate into `bug-orchestrator` | 1h |
| 2.4 | Integrate into other health orchestrators | 2h |
| 2.5 | Test resume flow | 1h |

**Acceptance Criteria:**
- [ ] Context saved after each phase
- [ ] Resume correctly restores state
- [ ] Log captures decisions with timestamps
- [ ] Works across session restarts

### Phase 3: Documentation (Priority: MEDIUM)

| Task | Deliverable | Effort |
|------|-------------|--------|
| 3.1 | Update TUTORIAL-CUSTOM-AGENTS.md | 1h |
| 3.2 | Add section to FAQ.md | 30m |
| 3.3 | Update README.md features section | 30m |

---

## File Structure After Implementation

```
.claude/
├── project-index.md              # NEW: Project navigation
├── skills/
│   ├── load-project-context/     # NEW
│   │   └── SKILL.md
│   ├── save-session-context/     # NEW
│   │   └── SKILL.md
│   └── resume-session/           # NEW
│       └── SKILL.md
├── agents/
│   └── health/
│       └── orchestrators/
│           └── bug-orchestrator.md  # MODIFIED: session integration

.tmp/
└── current/
    ├── plans/                    # Existing
    ├── reports/                  # Existing
    └── session/                  # NEW
        ├── context.md
        └── log.md
```

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Project index becomes stale | Medium | Low | Add "last updated" date, remind to update |
| Session context too verbose | Low | Medium | Enforce 100-line limit in skill |
| Users don't use new skills | Medium | Low | Auto-integrate into orchestrators |
| Overhead in simple tasks | Low | High | Skills are opt-in, not auto-loaded |

---

## Success Metrics

1. **Token efficiency:** Baseline не изменился (verify via sampling)
2. **Context recovery:** Resume успешен в >90% случаев
3. **Search efficiency:** Explore agent находит файлы за меньше итераций (when using index)
4. **User adoption:** Skills используются в >50% health workflows

---

## Appendix A: Template Files

### project-index.template.md

```markdown
# Project Index

> Quick navigation for AI agents. Updated: YYYY-MM-DD

## Architecture

- **[ARCHITECTURE.md](path)** — [1-line description]
- **[CLAUDE.md](CLAUDE.md)** — Behavioral rules, orchestration patterns

## Core Domains

### [Domain 1]
- **[path/](path/)** — [description]
  - Key: `subpath/` — [what's there]

### [Domain 2]
- **[path/](path/)** — [description]

## Patterns & Conventions

- **[Pattern]:** [How it's implemented]

## Recent Changes (last 7 days)

- YYYY-MM-DD: [Change description]
```

---

## Appendix B: Comparison with Full deksden-flow

| Feature | deksden-flow | Our Implementation | Reason for difference |
|---------|--------------|-------------------|----------------------|
| Memory Bank structure | Full hierarchy | Single index file | Token efficiency |
| Duo Files | summary.md + detail.md | YAML frontmatter | Simpler structure |
| Protocol numbering | XXXX-name | Timestamp-based | Less overhead |
| Context preparation | Pre-warmed sessions | On-demand loading | Zero baseline cost |
| C4 Model enforcement | Strict | Flexible | Already have ARCHITECTURE.md |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-27 | Initial specification |
