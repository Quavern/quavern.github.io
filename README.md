# oss.quavern.com

What Quavern publishes, under which licence, and the rules it follows when it
opens code — in English (`/`) and French (`/fr/`). Every page is built from
this repository by `build.mjs`: no dependency, no third-party request, no
tracking. The only scripts are the Quavern theme bootstrap and its
AUTO / LIGHT / DARK control.

## Change the list

`content/projects.json` holds one entry per repository or prepared opening:

- `state`: `public` (a public repository exists), `preparing` (a written
  specification, no public code yet) or `studying` (nothing decided).
- `en` and `fr`: `name` and `summary`, both required. French text gets its
  non-breaking spaces at build time; write ordinary spaces.
- `list: false` keeps an entry out of the pages.

`content/upstream.json` lists open-source software Quavern's products depend
on. Add a row only for a dependency a shipped product really uses. `licence` is
an SPDX identifier, or `{ "en": …, "fr": … }` when the licence is named in
words.

## Build and preview

```sh
node build.mjs                  # → _site/
node build.mjs --check-github   # also compare the list with github.com/Quavern
python3 -m http.server -d _site 4175
```

Node 20 or later. `SITE_URL` changes the absolute address used in canonical
links, `hreflang`, the sitemap and `CNAME` (default `https://oss.quavern.com`).

## Publication

`.github/workflows/pages.yml` builds on every push to `main` and once a day,
fails when `content/projects.json` and the organisation's public repositories
disagree, and publishes `_site/` to GitHub Pages. The custom domain is
`oss.quavern.com`; because this is the organisation's site
(`Quavern/quavern.github.io`), a repository of the organisation that turns
Pages on is served at `https://oss.quavern.com/<repository>/`.

## Licence

The files of this repository are under the Quavern Open Source License,
version 1.0 (`LicenseRef-QOSL-1.0`), except the fonts (SIL Open Font License
1.1) and the Quavern name and logo (not licensed): see `LICENSE.md` and
`NOTICE`. The licence texts live in `licences/qosl/1.0/`, in English and
French, both equally authentic. The text of 15 September 2026 is a draft under
legal review, and this repository is its first use.
