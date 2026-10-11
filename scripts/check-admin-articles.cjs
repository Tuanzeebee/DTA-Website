const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

async function main() {
  const root = path.join(__dirname, "..");
  const newIds = [15404, 15393, 15384, 15376, 15368];
  const items = Array.from({ length: 1117 }, (_, i) => ({
    id: `article-${i}`,
    wpId: i >= 1112 ? newIds[i - 1112] : i,
    slug: `bai-${i}`, title: `Bài ${i}`, status: "PUBLISHED", date: null,
  }));
  // API orders by update time; the admin table must order by publication date.
  items[0].date = "2026-09-30T00:00:00Z";
  items[0].updatedAt = "2099-01-01T00:00:00Z";
  items[1].date = "2026-10-01T00:00:00Z";
  items[2].date = "2025-12-31T00:00:00Z";
  items[3].date = "2026-01-01T00:00:00Z";
  items[1116].date = "2026-10-11T00:00:00Z";
  let failPage = null;
  let notifications = 0;
  const calls = [];
  const api = {
    adminFetchArticles: async (params) => {
      const page = params.page ?? 1;
      calls.push(params);
      if (page === failPage) throw new Error("API unavailable");
      const rows = items.slice((page - 1) * params.pageSize, page * params.pageSize);
      // A repeated ID between pages must not create two table rows.
      if (page === 6) rows.push(items[0]);
      return { items: rows, page, pageCount: 6, total: items.length };
    },
  };
  const imports = {
    react: {},
    "@/lib/api": api,
    "@/lib/auth/service": { authService: { getAccessToken: () => "test-token" } },
    "@/newsData": {},
    "@/compenents/admin/richText": {},
  };
  const source = fs.readFileSync(path.join(root, "src/compenents/admin/adminStore.ts"), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const store = {};
  vm.runInNewContext(code, {
    exports: store,
    require: (name) => {
      if (Object.hasOwn(imports, name)) return imports[name];
      throw new Error(`Unexpected import: ${name}`);
    },
    console: { error: () => {} },
    window: { dispatchEvent: () => notifications++ },
    Event,
  });
  const loaded = await store.loadArticles();
  assert.equal(loaded.length, 1117);
  assert.deepEqual(Array.from(loaded.slice(0, 5), (row) => row.id),
    [items[1116].id, items[1].id, items[0].id, items[3].id, items[2].id]);
  assert.equal(loaded[0].date, "11/10/2026");
  assert.equal(loaded[loaded.length - 1].date, "");
  assert.deepEqual(calls.map((params) => params.page ?? 1), [1, 2, 3, 4, 5, 6]);
  for (let i = 1112; i < 1117; i++) {
    const article = loaded.find((row) => row.id === items[i].id);
    assert.equal(article.slug, items[i].slug);
  }
  assert.equal(notifications, 1);
  failPage = 3;
  const afterFailure = await store.loadArticles();
  assert.equal(afterFailure.length, 1117);
  assert.equal(notifications, 1);
  console.log("Admin list checked: 1,117 articles, newest publication first across pages/years, undated last, duplicate IDs, failed page.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
