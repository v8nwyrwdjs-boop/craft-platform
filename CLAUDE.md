@AGENTS.md

# Claude Code project entry point

The root AGENTS.md is the single source of truth for product intent, branch safety, security, cost boundaries, accessibility, design direction, implementation quality and validation.

Before editing, read the project documents linked from AGENTS.md and inspect the actual branch state. Keep CRAFT's dark-first product-story direction and native-scroll narrative. Do not replace product truth with generic landing-page copy.

For significant UI work, use the same closed loop:
1. Inspect source and current behavior.
2. Write a small, coherent implementation.
3. Run security tests, type/build checks and relevant UI regressions.
4. Review the diff against the Vercel Web Interface Guidelines and CRAFT's design/motion playbook.
5. Correct findings and repeat validation.
6. Record browser/device checks honestly; a passing build is not visual approval.

Never merge to main, publish Production, change secrets or infrastructure settings, or add a paid dependency/service without explicit owner approval.
