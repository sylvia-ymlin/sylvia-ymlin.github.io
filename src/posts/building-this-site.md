---
title: "Building This Site with Eleventy"
date: 2025-01-15
description: "How I built a personal site inspired by innei.in using Eleventy and plain CSS."
category: Dev
tags: [posts, dev, eleventy, css]
readingTime: 5
---

## The Inspiration

I fell in love with the design of [innei.in](https://innei.in) — its cream background, minimal typography, and the quiet elegance of its layout. I wanted something that felt similar: airy, personal, and focused on words.

The original Shiro theme requires a backend (Mix Space CMS), which isn't compatible with GitHub Pages. So I built a static alternative using **Eleventy** (11ty) and plain CSS.

## Tech Stack

- **Eleventy** (11ty) — static site generator, processes markdown + Nunjucks templates
- **Plain CSS** — no frameworks, just custom properties and careful design
- **GitHub Pages** — free hosting with custom domain support
- **GitHub Actions** — auto-deploy on every push to `main`

## Key Design Decisions

### The Color Palette

The background is `#f7f6f3` — a barely-there warm cream. Not pure white, not gray. It gives the page texture and warmth without being distracting.

```css
:root {
  --bg: #f7f6f3;
  --text: #1a1a1a;
  --text-secondary: #888;
  --border: #e5e4e0;
}
```

### Typography

System fonts all the way. They render crisply on every device without loading overhead.

Section labels use spaced uppercase text — a simple trick that adds a lot of character:

```css
.section-label {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}
```

### The Blur Nav

The frosted glass navigation effect is done with a single CSS property:

```css
.nav {
  backdrop-filter: blur(12px) saturate(1.5);
  background: rgba(247, 246, 243, 0.85);
}
```

## What I Learned

Building your own theme from scratch, even a simple one, teaches you a lot about design fundamentals. Every spacing decision, every font size, every color choice — they all matter more than you'd expect.

The constraint of "match this specific aesthetic in static HTML/CSS" turned out to be a great creative challenge.

## Next Steps

- Add RSS feed
- Improve code syntax highlighting
- Maybe add a dark mode? (But the cream is so nice...)

---

*You can find the source code for this site on [GitHub](https://github.com/sylvia-ymlin/sylvia-ymlin.github.io).*
