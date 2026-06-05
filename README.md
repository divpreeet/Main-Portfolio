# divpreet

personal portfolio. dark, minimal, t3.gg inspired.

## sections

- **about** — bio + social links
- **projects** — github repos (fetched from api)
- **blog** — markdown posts

## adding a blog post

1. create a `.md` file in `content/blog/` (e.g. `content/blog/my-post.md`)
2. add an entry to `content/blog/index.json`:

```json
{ "slug": "my-post", "title": "My Post Title", "date": "2026-06-04", "desc": "short description" }
```

the slug must match the filename (without `.md`).

## 88x31 buttons

custom buttons (netflix, papers) are generated via canvas. everything else loads from `https://88x31.nl/gifs/`. add/edit in `script.js` under the `BUTTONS` array.

## tech

- vanilla html/css/js (no build tools)
- github api for projects
- markdown blog (simple regex parser, no dependencies)
