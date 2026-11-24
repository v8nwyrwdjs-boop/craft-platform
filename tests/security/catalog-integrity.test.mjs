import test from "node:test";
import assert from "node:assert/strict";
import { workshops, directions, products, statusLabel, workshopBySlug, directionBySlug, productBySlug, legacyTypeNearest } from "../../lib/catalog.ts";
import { legacyTypes, legacyConcepts } from "../../lib/catalog-legacy.ts";

const slugPattern = /^[a-z0-9-]{2,40}$/;
const unique = (items) => new Set(items).size === items.length;

test("catalogue has the documented size: 8 workshops, 40 directions, 14 wave-1 products", () => {
  assert.equal(workshops.length, 8);
  assert.equal(directions.length, 40);
  assert.equal(products.length, 14);
});

test("slugs are unique and safe for URLs and database rows", () => {
  for (const list of [workshops, directions, products]) {
    assert.equal(unique(list.map((item) => item.slug)), true);
    for (const item of list) assert.match(item.slug, slugPattern, item.slug);
  }
});

test("every direction, product and neighbour reference resolves", () => {
  for (const item of directions) assert.ok(workshopBySlug(item.workshop), `${item.slug} -> ${item.workshop}`);
  for (const item of products) assert.ok(directionBySlug(item.direction), `${item.slug} -> ${item.direction}`);
  for (const item of workshops) {
    assert.ok(directions.filter((d) => d.workshop === item.slug).length >= 3, `${item.slug} has too few directions`);
    for (const next of item.next) {
      assert.ok(workshopBySlug(next), `${item.slug} -> ${next}`);
      assert.notEqual(next, item.slug);
    }
  }
});

test("statuses are valid and only the existing base programme is open", () => {
  for (const item of products) assert.ok(item.status in statusLabel, item.slug);
  assert.deepEqual(products.filter((item) => item.status === "open").map((item) => item.slug), ["craft-foundation"]);
});

test("product pages only point at real products and open products carry a full page", () => {
  for (const item of products) {
    if (item.status === "open") assert.ok(item.page, `${item.slug} is open without a page`);
    if (!item.page) continue;
    for (const slug of [...item.page.next, ...item.page.related, ...(item.page.notForWhomSlug ? [item.page.notForWhomSlug] : [])]) {
      assert.ok(productBySlug(slug), `${item.slug} -> ${slug}`);
    }
    for (const field of ["lead", "forWhom", "notForWhom", "time", "needs", "boundaries", "help"]) {
      assert.ok(item.page[field].length > 10, `${item.slug}.${field}`);
    }
    assert.ok(item.page.inHands.length >= 3 && item.page.faq.length >= 3, item.slug);
  }
});

test("catalogue copy has no prices, guarantees or banned marketing phrases", () => {
  const text = JSON.stringify([workshops, directions, products, legacyTypes, legacyConcepts]).toLowerCase();
  for (const banned of ["₽", "руб", "раскройте потенциал", "погрузитесь", "инновационн", "передов", "уникальная возможность", "революци", "будущее уже здесь", "бесшовн", "безграничн", "присоединяйтесь к сообществу", "гарантирован", "заработаете"]) {
    assert.equal(text.includes(banned), false, banned);
  }
});

test("legacy types and concepts are kept and link to real directions", () => {
  assert.equal(legacyTypes.length, 6);
  assert.equal(legacyConcepts.length, 6);
  for (const item of legacyConcepts) assert.equal(item.id, item.slug);
  for (const item of legacyTypes) {
    const nearest = legacyTypeNearest[item.slug];
    assert.ok(nearest && nearest.length === 3, item.slug);
    for (const slug of nearest) assert.ok(directionBySlug(slug), `${item.slug} -> ${slug}`);
  }
});
