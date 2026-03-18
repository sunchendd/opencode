# IPv6 Serve Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix invalid URL construction when `opencode` is started with an IPv6 hostname such as `::` or `::1`.

**Architecture:** Add one shared helper in the server module that formats hostnames for URL usage, then reuse it anywhere the CLI or SDK currently interpolates `hostname` and `port` into `http://...` strings. Keep network binding behavior unchanged so this patch only fixes URL construction and display regressions.

**Tech Stack:** TypeScript, Bun runtime APIs, `bun:test`

---

### Task 1: Add the regression test

**Files:**
- Create: `packages/opencode/test/server/url.test.ts`
- Modify: none
- Test: `packages/opencode/test/server/url.test.ts`

**Step 1: Write the failing test**

Add a test that imports `Server` and asserts IPv4 stays unchanged while IPv6 hostnames are bracketed when building URLs.

**Step 2: Run test to verify it fails**

Run: `bun test test/server/url.test.ts`
Expected: FAIL because the shared helper does not exist yet.

**Step 3: Write minimal implementation**

Add a helper in `src/server/server.ts` and export it from the `Server` namespace.

**Step 4: Run test to verify it passes**

Run: `bun test test/server/url.test.ts`
Expected: PASS

### Task 2: Reuse the helper in runtime call sites

**Files:**
- Modify: `packages/opencode/src/server/server.ts`
- Modify: `packages/opencode/src/cli/cmd/serve.ts`
- Modify: `packages/opencode/src/cli/cmd/workspace-serve.ts`
- Modify: `packages/opencode/src/cli/cmd/acp.ts`
- Test: `packages/opencode/test/server/url.test.ts`

**Step 1: Replace direct string interpolation**

Use the shared helper for `Server.url`, serve output, workspace serve output, and ACP client `baseUrl`.

**Step 2: Keep scope tight**

Do not change `network.ts` defaults or the plugin fallback URL in this patch.

**Step 3: Re-run the regression test**

Run: `bun test test/server/url.test.ts`
Expected: PASS

### Task 3: Verify package health

**Files:**
- Modify: none
- Test: `packages/opencode/test/server/url.test.ts`

**Step 1: Run targeted tests**

Run: `bun test test/server/url.test.ts`

**Step 2: Run package typecheck**

Run: `bun typecheck`

**Step 3: Summarize any remaining risks**

Call out that `::` as a browser destination in the `web` command is a separate behavior question and not part of this minimal fix.
