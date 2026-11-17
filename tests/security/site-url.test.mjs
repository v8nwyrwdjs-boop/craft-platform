import test from "node:test";
import assert from "node:assert/strict";
import { getSiteOrigin } from "../../lib/site-url.ts";

const keys = ["NEXT_PUBLIC_SITE_URL", "VERCEL_URL", "NODE_ENV"];
function withEnv(values, run) {
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  try {
    run();
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
}

test("uses a configured HTTPS origin", () => {
  withEnv({ NEXT_PUBLIC_SITE_URL: "https://craft.example", NODE_ENV: "production" }, () => {
    assert.equal(getSiteOrigin(), "https://craft.example");
  });
});

test("rejects non-origin or insecure public site configuration", () => {
  for (const value of ["http://craft.example", "https://craft.example/path", "https://user:pass@craft.example"]) {
    withEnv({ NEXT_PUBLIC_SITE_URL: value, NODE_ENV: "production" }, () => {
      assert.throws(() => getSiteOrigin(), /valid HTTPS origin/);
    });
  }
});

test("uses the Vercel deployment hostname when no canonical origin is configured", () => {
  withEnv({ VERCEL_URL: "craft-preview.vercel.app", NODE_ENV: "production" }, () => {
    assert.equal(getSiteOrigin(), "https://craft-preview.vercel.app");
  });
});

test("fails closed in production when no trusted origin is available", () => {
  withEnv({ NODE_ENV: "production" }, () => {
    assert.throws(() => getSiteOrigin(), /Set NEXT_PUBLIC_SITE_URL/);
  });
});

test("uses localhost only outside production", () => {
  withEnv({ NODE_ENV: "development" }, () => {
    assert.equal(getSiteOrigin(), "http://localhost:3000");
  });
});
