# Garro website

One-page public website for Garro: records and payment instructions for farmer cooperatives.
Amharic first, with an English switch. Static site (Vite, React, Tailwind). It sends no data anywhere.

## Run it

```powershell
npm.cmd ci
npm.cmd run dev
```

## Publish

Every push to `main` builds the site and publishes it with GitHub Pages
(see `.github/workflows/deploy.yml`). `npm.cmd run build` also writes the same files to `dist/`
for upload to any ordinary web host.

## Edit the words

All text lives in `src/copy.ts`, Amharic and English side by side. Lines still marked
`[... to confirm]` are hidden on the page until they are filled in. The registration form is a
preview and is not connected yet.

## Fonts

Noto Sans Ethiopic is included under the SIL Open Font License (`src/fonts/OFL-NotoSansEthiopic.txt`).
