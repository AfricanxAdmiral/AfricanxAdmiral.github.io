# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Hugo-based personal portfolio + blog site. Custom theme `retrojp` — dark, retro video game aesthetic with Japanese visual elements. Deployed to GitHub Pages via GitHub Actions.

## Commands

```bash
# Development server (live reload, drafts included)
hugo server --buildDrafts

# Production build
hugo --minify

# New blog post
hugo new content blog/my-post-title.md

# New portfolio page (rarely needed — portfolio uses data files)
hugo new content portfolio/project-name.md
```

## Architecture

```
content/
  _index.md          # Home page body text (about blurb)
  blog/              # Blog posts (.md files)
  portfolio/_index.md # Portfolio page (layout driven by data/)

data/
  projects.toml      # Featured projects shown on portfolio + home preview
  skills.toml        # Skill groups + per-skill percentage levels
  experience.toml    # Work history timeline
  education.toml     # Education timeline

themes/retrojp/
  layouts/
    _default/baseof.html     # Base HTML shell (nav, footer, scanline/noise overlays)
    index.html               # Home page: hero → about preview → portfolio preview → blog preview
    portfolio/list.html      # Portfolio/CV page (skills, experience, projects, education)
    blog/list.html           # Blog post listing
    blog/single.html         # Individual blog post
    partials/                # head.html, nav.html, footer.html
  static/
    css/main.css             # All styles — single file, CSS custom properties at top
    js/main.js               # Scroll fade-ins, skill bar animation, typewriter, mobile nav

.github/workflows/deploy.yml  # Builds with Hugo 0.160.1 extended, deploys to GitHub Pages
```

## How content works

**Blog posts** — create a `.md` file in `content/blog/`. Front matter:
```yaml
---
title: "Post Title"
date: 2025-01-15
tags: ["tag1", "tag2"]
summary: "Short summary shown in listings and home preview."
---
```

**Portfolio data** — edit `data/projects.toml`, `data/skills.toml`, `data/experience.toml`, `data/education.toml` directly. No content files needed; the portfolio page reads these TOML arrays.

**About text** — edit `content/_index.md` body. Rendered in the home page "WHO AM I" section.

**Site config** (author name, tagline, social links) — `hugo.toml` under `[params]`.

## Theme design tokens

All colors and fonts are CSS custom properties in `themes/retrojp/static/css/main.css` (`:root` block at the top). Key values:
- `--cyan: #00ffcc` — primary accent
- `--magenta: #ff2d78` — secondary accent / blog accent
- `--yellow: #ffd700` — tertiary (timeline companies, skill group titles)
- `--font-pixel: 'Press Start 2P'` — headings
- `--font-vt: 'VT323'` — large display / dates
- `--font-mono: 'Share Tech Mono'` — body text

## Deployment

Push to `main` → GitHub Actions builds Hugo and deploys to Pages. Go to **Settings → Pages → Source → GitHub Actions** in the repo to enable this (one-time setup on GitHub).
