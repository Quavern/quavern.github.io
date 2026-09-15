// SPDX-License-Identifier: LicenseRef-QOSL-1.0
// Copyright (c) 2026 Quavern
// This file is subject to the Quavern Open Source License, version 1.0.
// A copy is available at https://oss.quavern.com/licences/qosl/1.0/

import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// oss.quavern.com — what Quavern publishes, under which licence, and the rules
// it follows. Content is JSON and Markdown in this repository, built into
// static pages for GitHub Pages. No dependency and no third-party request; the
// only scripts are the Quavern theme bootstrap and its AUTO / LIGHT / DARK
// control.
//
//   node build.mjs                 → _site/
//   node build.mjs --check-github  → also fail when content/projects.json and
//                                    the public repositories of the Quavern
//                                    organisation disagree

const root = dirname(fileURLToPath(import.meta.url));
const out = resolve(root, "_site");
const siteUrl = (process.env.SITE_URL || "https://oss.quavern.com").replace(/\/+$/, "");
const org = "Quavern";
const checkGithub = process.argv.includes("--check-github");

const copy = {
  en: {
    locale: "en_GB",
    name: "English",
    skip: "Skip to content",
    languageNav: "Language",
    siteName: "Quavern — Open source",
    brandName: "Open source",
    title: "What Quavern publishes.",
    lede: `The repositories Quavern opens, the licence they use, and the rules it follows when it opens code. Every repository lives at <a href="https://github.com/${org}">github.com/${org}</a>.`,
    description: "The repositories Quavern opens, the licence they use, and the rules it follows when it opens code.",
    repositories: "Repositories",
    repositoriesNote: "Only the first repository is public today. The Observatory is listed at its real stage: a written specification, with no public code yet.",
    states: { public: "Public", preparing: "Specification written", studying: "Under study" },
    since: "since",
    licence: "Licence",
    licenceTitle: "Quavern Open Source License",
    licenceIntro:
      "Quavern's repositories use the Quavern Open Source License, version 1.0 (QOSL-1.0). It is written to meet the Open Source Definition; it is not OSI-approved.",
    licencePoints: [
      "Use, study, change and share the code for any purpose.",
      "A file of ours that you change stays under the licence when you distribute it or run it as a network service; the rest of your program stays yours.",
      "Patents held by contributors are licensed with their code.",
      "Credits to the producers of open data stay attached to the software."
    ],
    licenceStatus: "The text of 15 September 2026 is a draft under legal review. This site's repository is its first use; if the review changes the text, the change gets a new version number.",
    licenceRead: "Read QOSL-1.0",
    licenceOther: "Lire en français",
    rules: "How Quavern opens code",
    rulesList: [
      ["What stays closed", "Code is opened where people need to inspect it, reuse it or trust it. Marl, Marl Code and the hosted Quavsit API stay closed: running them is the part customers pay for."],
      ["Open data keeps its licence", "Open data keeps its licence and its credit: Licence Ouverte 2.0, ODbL, Licence Mobilités and the others named in each repository."],
      ["No secret in a repository", "Provider keys, share links and personal details stay out of published code. A repository starts with its own history, never a copy of Quavern's private one."],
      ["Security reports stay private", `Write to <a href="mailto:hello@quavern.com?subject=Security">hello@quavern.com</a> with "Security" in the subject, not in a public issue.`],
      ["Contributions", "Issues and pull requests are read. Each repository says what it accepts in its CONTRIBUTING file, and a contribution is received under the repository's licence."]
    ],
    upstream: "Built on",
    upstreamNote: "Open-source software that Quavern's products depend on, with the licence each project publishes.",
    colophon: (commit, date) =>
      `oss.quavern.com is built from <a href="https://github.com/${org}/quavern.github.io">github.com/${org}/quavern.github.io</a> with no dependency and served by GitHub Pages; GitHub receives visitors' IP addresses as the host. Built on ${date}${commit ? ` from commit <code>${commit}</code>` : ""}. Type: Lineal by Frank Adebiaye and Atkinson Hyperlegible Next, both under the SIL Open Font License 1.1. The Quavern name and logo are not licensed here.`,
    footerNav: "Quavern links",
    legal: "Legal notice",
    privacy: "Privacy",
    slogan: "Built below the noise.",
    licencePageTitle: "Quavern Open Source License, version 1.0",
    licenceBack: "What Quavern publishes",
    licenceRaw: "Markdown source",
    notFound: "This page does not exist.",
    notFoundBody: "The link may be incomplete, or the page has moved."
  },
  fr: {
    locale: "fr_FR",
    name: "Français",
    skip: "Aller au contenu",
    languageNav: "Langue",
    siteName: "Quavern — Open source",
    brandName: "Open source",
    title: "Ce que Quavern publie.",
    lede: `Les dépôts que Quavern ouvre, la licence qu’ils utilisent et les règles suivies pour ouvrir du code. Tous les dépôts sont sur <a href="https://github.com/${org}">github.com/${org}</a>.`,
    description: "Les dépôts que Quavern ouvre, la licence qu’ils utilisent et les règles suivies pour ouvrir du code.",
    repositories: "Dépôts",
    repositoriesNote: "Seul le premier dépôt est public aujourd’hui. L’Observatoire figure à son stade réel : une spécification écrite, sans code public pour l’instant.",
    states: { public: "Public", preparing: "Spécification écrite", studying: "À l’étude" },
    since: "depuis le",
    licence: "Licence",
    licenceTitle: "Licence open source Quavern",
    licenceIntro:
      "Les dépôts de Quavern utilisent la Licence open source Quavern, version 1.0 (QOSL-1.0). Elle est rédigée pour respecter la définition de l’open source ; elle n’est pas approuvée par l’OSI.",
    licencePoints: [
      "Utiliser, étudier, modifier et partager le code pour tout usage.",
      "Un de nos fichiers que vous modifiez reste sous la licence quand vous le distribuez ou l’exploitez en service réseau ; le reste de votre programme vous appartient.",
      "Les brevets des contributeurs sont concédés avec leur code.",
      "Les crédits des producteurs de données ouvertes restent attachés au logiciel."
    ],
    licenceStatus: "Le texte du 15 septembre 2026 est un projet en cours d’examen juridique. Le dépôt de ce site en est le premier usage ; si l’examen modifie le texte, la modification reçoit un nouveau numéro de version.",
    licenceRead: "Lire la QOSL-1.0",
    licenceOther: "Read in English",
    rules: "Comment Quavern ouvre du code",
    rulesList: [
      ["Ce qui reste fermé", "Le code est ouvert quand on a besoin de l’examiner, de le réutiliser ou de lui faire confiance. Marl, Marl Code et l’API Quavsit hébergée restent fermés : leur exploitation est ce que paient les clients."],
      ["Les données ouvertes gardent leur licence", "Les données ouvertes gardent leur licence et leur crédit : Licence Ouverte 2.0, ODbL, Licence Mobilités et les autres citées dans chaque dépôt."],
      ["Aucun secret dans un dépôt", "Clés de fournisseurs, liens de partage et informations personnelles restent hors du code publié. Un dépôt commence avec son propre historique, jamais une copie de l’historique privé de Quavern."],
      ["Les signalements de sécurité restent privés", `Écrivez à <a href="mailto:hello@quavern.com?subject=S%C3%A9curit%C3%A9">hello@quavern.com</a> avec « Sécurité » dans l’objet, pas dans un ticket public.`],
      ["Contributions", "Les tickets et les pull requests sont lus. Chaque dépôt indique ce qu’il accepte dans son fichier CONTRIBUTING, et une contribution est reçue sous la licence du dépôt."]
    ],
    upstream: "Construit sur",
    upstreamNote: "Les logiciels libres dont dépendent les produits de Quavern, avec la licence publiée par chaque projet.",
    colophon: (commit, date) =>
      `oss.quavern.com est construit à partir de <a href="https://github.com/${org}/quavern.github.io">github.com/${org}/quavern.github.io</a>, sans dépendance, et servi par GitHub Pages ; GitHub reçoit l’adresse IP des visiteurs en tant qu’hébergeur. Construit le ${date}${commit ? ` à partir du commit <code>${commit}</code>` : ""}. Caractères : Lineal de Frank Adebiaye et Atkinson Hyperlegible Next, tous deux sous SIL Open Font License 1.1. Le nom et le logo Quavern ne sont pas concédés ici.`,
    footerNav: "Liens Quavern",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    slogan: "Bâti sous le bruit.",
    licencePageTitle: "Licence open source Quavern, version 1.0",
    licenceBack: "Ce que Quavern publie",
    licenceRaw: "Source Markdown",
    notFound: "Cette page n’existe pas.",
    notFoundBody: "Le lien est peut-être incomplet, ou la page a été déplacée."
  }
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// French punctuation keeps its space, and that space never breaks.
const frenchSpacing = (text) =>
  String(text).replace(/ :/g, " :").replace(/ ([;!?»])/g, " $1").replace(/« /g, "« ");

const formatDate = (isoDate, lang) =>
  new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`)
  );

const home = (lang) => (lang === "fr" ? "/fr/" : "/");
const licencePath = (lang) => (lang === "fr" ? "/fr/licences/qosl/1.0/" : "/licences/qosl/1.0/");

// The Markdown the licence texts use: # and ## headings, paragraphs, fenced
// code, ---, **strong**, `code` and bare https links. Raw HTML is escaped.
function renderInline(text) {
  const codes = [];
  const html = escapeHtml(text)
    .replace(/`([^`]+)`/g, (_, code) => {
      codes.push(code);
      return ` ${codes.length - 1} `;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(https:\/\/[^\s<]+[^\s<.,;:)])/g, '<a href="$1">$1</a>');
  return html.replace(/ (\d+) /g, (_, i) => `<code>${codes[Number(i)]}</code>`);
}

function renderMarkdown(markdown, lang) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let title = "";
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
    } else if (line.startsWith("```")) {
      const code = [];
      for (i += 1; i < lines.length && !lines[i].startsWith("```"); i += 1) code.push(lines[i]);
      i += 1;
      blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
    } else if (/^---\s*$/.test(line)) {
      blocks.push('<hr class="licence-break">');
      i += 1;
    } else if (/^#\s/.test(line)) {
      title = line.replace(/^#\s+/, "");
      i += 1;
    } else if (/^##\s/.test(line)) {
      const text = line.replace(/^##\s+/, "");
      const id = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      blocks.push(`<h2 id="${id}">${renderInline(text)}</h2>`);
      i += 1;
    } else {
      const paragraph = [];
      while (i < lines.length && lines[i].trim() && !/^(#|```|---\s*$)/.test(lines[i])) paragraph.push(lines[i++].trim());
      blocks.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    }
  }
  const html = blocks.join("\n");
  return { title, html: lang === "fr" ? frenchSpacing(html) : html };
}

function shell({ lang, title, description, path, alternates, main }) {
  const t = copy[lang];
  const links = alternates.map(({ hreflang, href }) => `<link rel="alternate" hreflang="${hreflang}" href="${siteUrl}${href}">`).join("\n    ");
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    ${path ? `<link rel="canonical" href="${siteUrl}${path}">` : ""}
    ${links}
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f3eb" data-theme-color="light">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f0b07" data-theme-color="dark">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${t.siteName}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    ${path ? `<meta property="og:url" content="${siteUrl}${path}">` : ""}
    <meta property="og:locale" content="${t.locale}">
    <link rel="icon" href="/assets/logo/quavern-symbol-ink.svg" type="image/svg+xml">
    <link rel="icon" media="(prefers-color-scheme: dark)" href="/assets/logo/quavern-symbol-reverse.svg" type="image/svg+xml">
    <link rel="preload" href="/assets/fonts/LinealVF.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/AtkinsonHyperlegibleNext-Latin.woff2" as="font" type="font/woff2" crossorigin>
    <script src="/assets/theme.js"></script>
    <link rel="stylesheet" href="/tokens.css">
    <link rel="stylesheet" href="/oss.css">
    <script src="/assets/theme-control.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">${t.skip}</a>
    <div class="oss-shell">
${main}
    </div>
  </body>
</html>
`;
}

function header(lang, switchHref) {
  const t = copy[lang];
  const other = lang === "fr" ? "en" : "fr";
  return `      <header class="oss-header">
        <a class="oss-brand" href="${home(lang)}">
          <picture>
            <source media="(prefers-color-scheme: dark)" srcset="/assets/logo/quavern-primary-reverse.svg">
            <img src="/assets/logo/quavern-primary-ink.svg" alt="Quavern" width="${logo.width}" height="${logo.height}">
          </picture>
          <span class="oss-brand-name">${t.brandName}</span>
        </a>
        <div class="oss-tools">
          <nav aria-label="${t.languageNav}">
            <a class="oss-language" href="${switchHref}" hreflang="${other}" lang="${other}">${copy[other].name}</a>
          </nav>
          <div class="theme-toggle" data-theme-toggle-mount></div>
        </div>
      </header>`;
}

function footer(lang) {
  const t = copy[lang];
  const colophon = t.colophon(build.commit, formatDate(build.date, lang));
  return `      <footer class="oss-colophon">
        <p class="oss-colophon-text">${lang === "fr" ? frenchSpacing(colophon) : colophon}</p>
        <div class="oss-colophon-foot">
          <p><strong>Quavern</strong> — ${t.slogan}</p>
          <nav aria-label="${t.footerNav}">
            <a href="https://quavern.com/${lang === "fr" ? "?lang=fr" : ""}">quavern.com</a>
            <a href="https://github.com/${org}">GitHub</a>
            <a href="https://quavern.com/mentions-legales.html">${t.legal}</a>
            <a href="https://quavern.com/privacy.html">${t.privacy}</a>
          </nav>
        </div>
      </footer>`;
}

function indexPage(lang) {
  const t = copy[lang];
  const fr = (s) => (lang === "fr" ? frenchSpacing(s) : s);
  const rows = projects
    .filter((p) => p.list !== false)
    .map((p) => {
      const text = p[lang];
      const name = p.state === "public" ? `<a href="https://github.com/${org}/${p.repo}">${escapeHtml(text.name)}</a>` : escapeHtml(text.name);
      return `            <li class="repo repo--${p.state}">
              <div class="repo-head">
                <h3 class="repo-name">${name}</h3>
                <p class="repo-path"><code>${org}/${escapeHtml(p.repo)}</code></p>
              </div>
              <p class="repo-summary">${escapeHtml(fr(text.summary))}</p>
              <p class="repo-facts"><span class="repo-state">${fr(t.states[p.state])}</span><span>${t.since} <time datetime="${p.since}">${formatDate(p.since, lang)}</time></span><span>${escapeHtml(p.licence.replace(/^LicenseRef-/, ""))}</span></p>
            </li>`;
    })
    .join("\n");
  const rules = t.rulesList
    .map(([term, detail]) => `            <div class="rule"><dt>${fr(term)}</dt><dd>${fr(detail)}</dd></div>`)
    .join("\n");
  const software = upstream
    .map(
      (s) =>
        `            <tr><th scope="row"><a href="${s.url}">${escapeHtml(s.name)}</a></th><td>${escapeHtml(fr(s[lang]))}</td><td class="licence-cell">${escapeHtml(s.licence)}</td></tr>`
    )
    .join("\n");
  const other = lang === "fr" ? "en" : "fr";

  return shell({
    lang,
    title: lang === "fr" ? `${t.siteName} (Français)` : t.siteName,
    description: t.description,
    path: home(lang),
    alternates: [
      { hreflang: "en", href: "/" },
      { hreflang: "fr", href: "/fr/" },
      { hreflang: "x-default", href: "/" }
    ],
    main: `${header(lang, home(other))}
      <main id="main" tabindex="-1">
        <section class="oss-intro" aria-labelledby="intro-title">
          <h1 id="intro-title">${fr(t.title)}</h1>
          <p>${fr(t.lede)}</p>
        </section>

        <section class="oss-section" aria-labelledby="repositories-title">
          <div class="section-head">
            <h2 id="repositories-title">${t.repositories}</h2>
            <p>${fr(t.repositoriesNote)}</p>
          </div>
          <ol class="repos">
${rows}
          </ol>
        </section>

        <section class="oss-section" aria-labelledby="licence-title">
          <div class="section-head">
            <h2 id="licence-title">${t.licence}</h2>
            <p>${fr(t.licenceIntro)}</p>
          </div>
          <div class="licence-summary">
            <h3>${t.licenceTitle} <span class="licence-version">1.0</span></h3>
            <ul>
${t.licencePoints.map((point) => `              <li>${fr(point)}</li>`).join("\n")}
            </ul>
            <p class="licence-status">${fr(t.licenceStatus)}</p>
            <p class="licence-links"><a href="${licencePath(lang)}">${t.licenceRead}</a><a href="${licencePath(other)}" hreflang="${other}" lang="${other}">${t.licenceOther}</a></p>
          </div>
        </section>

        <section class="oss-section" aria-labelledby="rules-title">
          <div class="section-head">
            <h2 id="rules-title">${fr(t.rules)}</h2>
          </div>
          <dl class="rules">
${rules}
          </dl>
        </section>

        <section class="oss-section" aria-labelledby="upstream-title">
          <div class="section-head">
            <h2 id="upstream-title">${t.upstream}</h2>
            <p>${fr(t.upstreamNote)}</p>
          </div>
          <div class="table-scroll">
            <table class="upstream">
              <tbody>
${software}
              </tbody>
            </table>
          </div>
        </section>
      </main>
${footer(lang)}`
  });
}

function licencePage(lang, licence) {
  const t = copy[lang];
  const other = lang === "fr" ? "en" : "fr";
  return shell({
    lang,
    title: `${t.licencePageTitle} — ${t.siteName}`,
    description: t.licenceIntro,
    path: licencePath(lang),
    alternates: [
      { hreflang: "en", href: licencePath("en") },
      { hreflang: "fr", href: licencePath("fr") }
    ],
    main: `${header(lang, licencePath(other))}
      <main id="main" tabindex="-1">
        <p class="licence-back"><a href="${home(lang)}">${t.licenceBack}</a></p>
        <article class="licence" aria-labelledby="licence-page-title">
          <h1 id="licence-page-title">${escapeHtml(lang === "fr" ? frenchSpacing(licence.title) : licence.title)}</h1>
          <p class="licence-links"><a href="/licences/qosl/1.0/QOSL-1.0.${lang}.md">${t.licenceRaw}</a><a href="${licencePath(other)}" hreflang="${other}" lang="${other}">${t.licenceOther}</a></p>
          <div class="licence-body">
${licence.html}
          </div>
        </article>
      </main>
${footer(lang)}`
  });
}

async function write(path, text) {
  const target = resolve(out, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, text);
}

async function checkAgainstGithub() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "oss.quavern.com build" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com/orgs/${org}/repos?type=public&per_page=100`, { headers });
  if (!response.ok) throw new Error(`GitHub API answered ${response.status} for ${org}'s repositories`);
  const live = new Set((await response.json()).map((repo) => repo.name));
  const problems = [
    ...[...live].filter((name) => !projects.some((p) => p.repo === name)).map((name) => `${org}/${name} is public but missing from content/projects.json`),
    ...projects.filter((p) => p.state === "public" && !live.has(p.repo)).map((p) => `${org}/${p.repo} is marked public but no public repository has that name`)
  ];
  if (problems.length) throw new Error(problems.join("\n"));
}

// ---- read ------------------------------------------------------------------
const { projects } = JSON.parse(await readFile(resolve(root, "content/projects.json"), "utf8"));
const { software: upstream } = JSON.parse(await readFile(resolve(root, "content/upstream.json"), "utf8"));
for (const p of projects) {
  if (!["public", "preparing", "studying"].includes(p.state)) throw new Error(`${p.repo}: unknown state "${p.state}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.since)) throw new Error(`${p.repo}: since must be YYYY-MM-DD`);
  for (const lang of Object.keys(copy)) if (!p[lang]?.name || !p[lang]?.summary) throw new Error(`${p.repo}: ${lang} name and summary are required`);
}
if (checkGithub) await checkAgainstGithub();

const commitFromGit = () => {
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
};
const build = {
  commit: (process.env.GITHUB_SHA || "").slice(0, 12) || commitFromGit(),
  date: new Date().toISOString().slice(0, 10)
};

const svg = await readFile(resolve(root, "assets/logo/quavern-primary-ink.svg"), "utf8");
const [, , viewWidth, viewHeight] = (svg.match(/viewBox="([^"]+)"/)?.[1] || "0 0 1 1").split(/\s+/).map(Number);
const logo = { width: Math.round((viewWidth / viewHeight) * 26), height: 26 };

const licences = {};
for (const lang of Object.keys(copy)) {
  licences[lang] = renderMarkdown(await readFile(resolve(root, `licences/qosl/1.0/QOSL-1.0.${lang}.md`), "utf8"), lang);
}

// ---- write -----------------------------------------------------------------
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(resolve(root, "assets"), resolve(out, "assets"), { recursive: true });
await rm(resolve(out, "assets/tokens.css"));
await cp(resolve(root, "assets/tokens.css"), resolve(out, "tokens.css"));
await cp(resolve(root, "src/oss.css"), resolve(out, "oss.css"));
for (const lang of Object.keys(copy)) {
  await cp(resolve(root, `licences/qosl/1.0/QOSL-1.0.${lang}.md`), resolve(out, `licences/qosl/1.0/QOSL-1.0.${lang}.md`));
}

await write("index.html", indexPage("en"));
await write("fr/index.html", indexPage("fr"));
await write("licences/qosl/1.0/index.html", licencePage("en", licences.en));
await write("fr/licences/qosl/1.0/index.html", licencePage("fr", licences.fr));
await write(
  "404.html",
  shell({
    lang: "en",
    title: `404 — ${copy.en.siteName}`,
    description: copy.en.notFound,
    path: "",
    alternates: [],
    main: `${header("en", "/fr/")}
      <main id="main" tabindex="-1">
        <section class="oss-intro" aria-labelledby="intro-title">
          <h1 id="intro-title">${copy.en.notFound}</h1>
          <p>${copy.en.notFoundBody} <a href="/">${copy.en.licenceBack}</a></p>
          <p lang="fr">${frenchSpacing(`${copy.fr.notFound} ${copy.fr.notFoundBody}`)} <a href="/fr/">${copy.fr.licenceBack}</a></p>
        </section>
      </main>
${footer("en")}`
  })
);
const urls = ["/", "/fr/", licencePath("en"), licencePath("fr")];
await writeFile(
  resolve(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
await writeFile(resolve(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeFile(resolve(out, "CNAME"), `${new URL(siteUrl).host}\n`);
await writeFile(resolve(out, ".nojekyll"), "");

process.stdout.write(`Built ${copy.en.siteName}: ${projects.filter((p) => p.list !== false).length} entries, ${upstream.length} upstream projects, commit ${build.commit || "none"} → ${out}\n`);
