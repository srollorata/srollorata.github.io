---
name: code-review-and-quality
description: Multi-axis code review for correctness, readability, architecture, security, and performance. Use before merging any change.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: review
---

# Code Review and Quality

## Overview

Multi-dimensional code review with quality gates. Every change gets reviewed before merge. Review covers five axes: correctness, readability, architecture, security, and performance. Approve when a change improves overall code health — perfect code doesn't exist, continuous improvement does.

## When to Use

- Before merging any PR or deploy
- After completing a feature or fix
- When refactoring existing code
- For any change touching HTML, CSS, JS, PHP, or 3D model assets

## The Five-Axis Review

### 1. Correctness
- Does the code do what it claims? Match the task requirements?
- Are edge cases handled (null, empty, boundary values, missing images)?
- Error paths handled (not just the happy path)?
- Are there off-by-one errors, race conditions, or state inconsistencies?

### 2. Readability & Simplicity
- Are names descriptive and consistent? (No `temp`, `data`, `result` without context)
- Is the control flow straightforward?
- Could this be done in fewer lines? Are abstractions earning their complexity?
- Any dead code artifacts (unused variables, commented-out blocks, backwards-compat shims)?
- Are there "clever" tricks that should be simplified?

### 3. Architecture
- Does the change follow existing patterns or introduce new ones? Justified?
- Are module boundaries clean (HTML/CSS/JS separation respected)?
- Is there code duplication that should be shared?
- Are dependencies flowing the right direction?

### 4. Security
- Is user input validated and sanitized? (See `security-and-hardening`)
- Are secrets kept out of code and version control?
- Are outputs encoded to prevent XSS?
- Are dependencies from trusted sources with no known vulnerabilities?

### 5. Performance
- Are images optimized (dimensions set, avif/webp used, lazy loading)?
- Are 3D models (.glb) sized reasonably for the web? Draco compressed?
- Any render-blocking resources that could be deferred?
- Any missing font-display swap or preconnect hints?

## Change Sizing

```
~100 lines changed   → Good. Reviewable quickly.
~300 lines           → Acceptable if a single logical change.
~1000+ lines         → Too large. Split it (by file, by feature slice).
```

Separate refactoring from feature work — submit them independently.

## Change Descriptions

Every change needs a description that stands alone in history. First line: short, imperative, informative. Body: what changed and why.

**Anti-patterns:** "Fix bug," "Fix build," "Add patch," "Moving code."

## Review Process

1. **Understand context** — what is this change trying to accomplish?
2. **Review tests first** — do tests exist? Do they cover edge cases?
3. **Review implementation** — walk through code with the five axes
4. **Categorize findings** — label every comment with its severity
5. **Verify the verification** — was the change tested? Screenshots for UI? Lighthouse before/after?

## Severity Labels

| Prefix | Meaning | Action |
|--------|---------|--------|
| *(none)* | Required change | Must address before merge |
| **Critical:** | Blocks merge | Security, data loss, broken functionality |
| **Nit:** | Minor, optional | Style preference, ignorable |
| **Optional:** / **Consider:** | Suggestion | Worth considering |
| **FYI** | Informational | No action needed |

This prevents treating all feedback as mandatory.

## Static Site Review Checklist

```markdown
### Correctness
- [ ] Change matches requirements / task
- [ ] Edge cases handled (empty state, missing images, mobile breakpoints)
- [ ] Cross-browser tested (Chrome, Firefox, Safari at minimum)

### HTML & Accessibility
- [ ] Semantic HTML used (not just divs)
- [ ] Alt text on all images
- [ ] Heading hierarchy (h1→h2→h3) logical
- [ ] ARIA attributes where needed
- [ ] Keyboard navigable

### CSS
- [ ] No unused styles
- [ ] Responsive (mobile, tablet, desktop)
- [ ] No !important overrides unless justified

### Performance
- [ ] Images optimized (compressed, correct format, explicit dimensions)
- [ ] 3D models within size budget (<5MB per .glb, Draco compressed)
- [ ] Font-display swap set on Google Fonts
- [ ] Render-blocking resources minimized

### Security
- [ ] No secrets in code
- [ ] Form input validated and sanitized
- [ ] No hardcoded internal paths exposed

### Verification
- [ ] Lighthouse score ≥ 90 (or improving)
- [ ] Visual diff reviewed (screenshots if UI change)
- [ ] Build / no broken links
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It works, that's good enough" | Unreadable or insecure code creates compound debt. |
| "We'll clean it up later" | Later never comes. The review is the quality gate. |
| "It's just CSS/HTML, no need for review" | CSS causes layout shifts, HTML affects accessibility — both deserve review. |
| "AI-generated code is probably fine" | AI code needs more scrutiny — it's confident even when wrong. |
| "The tests pass, so it's good" | Tests don't catch architecture, security, or readability issues. |

## Red Flags

- PR merged without review
- "LGTM" without evidence of actual review
- Large changes not split into reviewable chunks
- No Lighthouse or performance check for UI changes
- Review comments without severity labels
- Accepting "I'll fix it later"

## Verification

- [ ] All Critical/required issues resolved
- [ ] Tests pass
- [ ] No broken links or console errors
- [ ] UI changes verified visually
- [ ] Lighthouse score confirmed
