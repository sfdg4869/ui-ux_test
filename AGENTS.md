# Playwright Harness Operating Model

This file defines the reusable operating model for this standalone Playwright harness.
It should remain product-neutral.

Product-specific instructions must live in `docs/agent-profiles/`.

Current active product profile:

- `docs/agent-profiles/exemble.md`

## Purpose

- keep one shared harness structure that can be reused across multiple products
- separate common orchestration rules from product-specific UI and document assumptions
- make it easy to clone the harness for another target without rewriting the core process

## Role Model

- `harness-orchestrator`
  - maps source documents to executable scope, priorities, and deliverables
- `manual-analyst`
  - normalizes manuals, checklists, and feature lists into testable steps
- `playwright-engineer`
  - builds and maintains `playwright.config.ts`, `fixtures/`, `pages/`, and `tests/`
- `case-reviewer`
  - reviews checklist accuracy, marks mismatches, and updates working test artifacts
- `security-sanity-reviewer`
  - adds negative-path and security-oriented checks that are safe to automate

## Common Rules

- put source documents in `manual/`
- put generated outputs and working artifacts in `_workspace/`
- inject credentials only through environment variables
- never modify or delete the currently configured login account; any future write flow must stay blocked unless a disposable test account is explicitly configured
- keep production-impacting write flows as `manual`, `blocked`, or separately gated specs until a disposable account and cleanup strategy are confirmed
- handle private certificates in Playwright configuration when the target environment requires it
- preserve original source documents and write updates to working copies only

## Shared Deliverables

- `playwright.config.ts`
- `fixtures/`
- `pages/`
- `tests/`
- `_workspace/00_input.md`
- `_workspace/01_manual_module_map.md`
- `_workspace/02_test_catalog.md`
- `_workspace/03_execution_report.md`
- `_workspace/04_excluded_cases.md`
- `_workspace/05_tc_execution_matrix.json`
- `_workspace/05_tc_execution_matrix.md`
- `_workspace/06_tc_execution_summary.md`
- `_workspace/test-catalog.json`
- working spreadsheet copies generated from source files

## Product Profile Contract

Each file under `docs/agent-profiles/` should define:

- target product name
- base URL or environment target
- source document list
- product-specific environment variables
- module or menu mapping assumptions
- priority rules such as `P0`, `P1`, `P2`
- blocked/manual conditions
- known exceptions, risks, or profile-specific review notes

## Reuse Workflow

1. Keep `AGENTS.md` unchanged unless the shared harness process itself changes.
2. Add a new file under `docs/agent-profiles/` for each product.
3. Update only the product profile, page objects, module scenarios, and parsing rules needed for that target.
4. Leave shared harness conventions, output structure, and orchestration roles intact.
