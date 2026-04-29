# AfricanxAdmiral.github.io

Personal portfolio and blog site.

Built with [Hugo](https://gohugo.io/) and a custom theme — dark retro video game aesthetic with Japanese visual elements. Deployed automatically to [africanxadmiral.github.io](https://africanxadmiral.github.io) via GitHub Actions on every push to `main`.

## Local development

```bash
hugo server --buildDrafts
```

Open [http://localhost:1313](http://localhost:1313). Changes hot-reload automatically.

## Adding content

**New blog post**
```bash
hugo new content blog/my-post-title.md
```
Set `draft: false` in the front matter when ready to publish.

**Update portfolio data** — edit the files in `data/`:
| File | Controls |
|---|---|
| `data/projects.toml` | Projects |
| `data/skills.toml` | Skill bars |
| `data/experience.toml` | Work history |
| `data/education.toml` | Education |

## Deployment

Push to `main` → GitHub Actions builds and deploys automatically (~1 min).

## Tech

- [Hugo](https://gohugo.io/) — static site generator
- Custom `retrojp` theme (no external dependencies)
- GitHub Pages + GitHub Actions
