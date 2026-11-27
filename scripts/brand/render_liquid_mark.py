#!/usr/bin/env python3
"""Pre-render the liquid-metal CRAFT mark to PNG (used by the header and Open Graph images).

The live component (components/liquid-mark.tsx) runs the same shader in the browser; the header only needs a
still, so a cached PNG avoids a WebGL context on every page. Run from the repository root:

    python3 scripts/brand/render_liquid_mark.py

Needs Python Playwright and a Chrome/Chromium binary (CHROME=/path/to/chrome, default /usr/bin/google-chrome).
It uses the software renderer, so no GPU is required. This is a design tool, not part of the site build.
"""
import base64, http.server, json, os, pathlib, socketserver, subprocess, sys, tempfile, threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "brand"
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
JOBS = [("mark-liquid-light.png", False, 128), ("mark-liquid-dark.png", True, 128)]  # 4x of the 32px header slot
TIME = 3.2  # the still frame: same value the component uses for reduced motion

TRANSPILE = """
const ts = require('typescript'); const fs = require('fs');
const [dir, tmp] = process.argv.slice(1);
for (const [name, imports] of [['liquid-logo-gl', true], ['brand-mark', false]]) {
  let out = ts.transpileModule(fs.readFileSync(dir + '/' + name + '.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  if (imports) out = out.replace('./brand-mark"', './brand-mark.mjs"');
  fs.writeFileSync(tmp + '/' + name + '.mjs', out);
}
"""

PAGE = """<!doctype html><meta charset="utf-8"><body><script type="module">
import { createLiquidLogo } from "./liquid-logo-gl.mjs";
window.render = (size, dark, time) => {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const m = createLiquidLogo(c, dark);
  if (!m) return null;
  m.draw(time, [0, 0]);
  const url = c.toDataURL("image/png");
  m.dispose();
  return url;
};
document.title = "ready";
</script>"""

def main() -> int:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = pathlib.Path(tmp)
        subprocess.run(["node", "-e", TRANSPILE, str(ROOT / "lib"), str(tmp_path)], cwd=ROOT, check=True)
        (tmp_path / "index.html").write_text(PAGE, encoding="utf-8")

        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *a, **k):
                super().__init__(*a, directory=str(tmp_path), **k)
            def log_message(self, *a):
                pass

        socketserver.TCPServer.allow_reuse_address = True
        server = socketserver.TCPServer(("127.0.0.1", 0), Handler)
        port = server.server_address[1]
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(executable_path=CHROME, args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"])
                page = browser.new_page()
                page.goto(f"http://127.0.0.1:{port}/index.html")
                page.wait_for_function("document.title === 'ready'", timeout=20000)
                OUT.mkdir(parents=True, exist_ok=True)
                for name, dark, size in JOBS:
                    url = page.evaluate("([s, d, t]) => window.render(s, d, t)", [size, dark, TIME])
                    if not url:
                        print("WebGL is not available: nothing rendered", file=sys.stderr)
                        return 1
                    data = base64.b64decode(url.split(",", 1)[1])
                    try:  # optional: Pillow re-compresses the PNG; the raw canvas output is already valid
                        import io
                        from PIL import Image
                        buf = io.BytesIO()
                        Image.open(io.BytesIO(data)).save(buf, "PNG", optimize=True)
                        data = buf.getvalue()
                    except ImportError:
                        pass
                    (OUT / name).write_bytes(data)
                    print("wrote", (OUT / name).relative_to(ROOT), size, "px")
                browser.close()
        finally:
            server.shutdown()
    return 0

if __name__ == "__main__":
    sys.exit(main())
