# Deployment

## Overview

The Soundwise landing page is deployed as a static Vite build to GitHub Pages and served at:

```text
https://getsoundwise.co
```

The production deployment artifact is the generated `dist/` directory.

## GitHub Pages Workflow

Deployment is defined in:

```text
.github/workflows/deploy.yml
```

The workflow runs on:

- Pushes to `main`
- Manual `workflow_dispatch` runs

Build job steps:

1. Check out the repository.
2. Set up Node.js 20.
3. Install dependencies with `npm ci`.
4. Build the site with `npm run build`; the `prebuild` step generates localized homepage route entries from `index.html`.
5. Write `getsoundwise.co` to `dist/CNAME`.
6. Upload `dist/` with `actions/upload-pages-artifact`.

Deploy job step:

1. Deploy the uploaded artifact with `actions/deploy-pages`.

## Commands

Install dependencies:

```bash
npm ci
```

Use Node.js `20.19+` or `22.12+`. The GitHub Pages workflow uses Node.js 20 through `actions/setup-node`, which resolves to a compatible current Node 20 release.

Build:

```bash
npm run build
```

Validate landing-copy data:

```bash
npm run validate:landing-copy
```

Preview a built site locally:

```bash
npm run preview
```

Run the local deploy helper:

```bash
npm run deploy
```

`npm run deploy` does not publish by itself. It runs the production build and writes `dist/CNAME`, matching the custom-domain artifact behavior used by the GitHub Actions workflow.

## Domain Configuration

The production custom domain is:

```text
getsoundwise.co
```

There are two CNAME-related files to understand:

- `CNAME` at the repository root documents the custom domain.
- `dist/CNAME` is generated during deployment and included in the GitHub Pages artifact.

Vite does not automatically copy the root `CNAME` file into `dist/`, so both the GitHub Actions workflow and the local `deploy` script explicitly generate `dist/CNAME`.

Workflow command:

```bash
echo 'getsoundwise.co' > dist/CNAME
```

Package script:

```json
"deploy": "npm run build && touch dist/CNAME && echo 'getsoundwise.co' > dist/CNAME"
```

## Expected Output Artifacts

After `npm run build`, `dist/` should contain the built static site, including:

- `index.html`
- Built localized homepage directories such as `ja/`, `zh/`, `yue/`, and `hi-ur/`
- Built support/legal HTML pages
- Built SEO page directories such as `ship-vs-sheep/`
- Vite-generated assets under `dist/assets/`
- Files copied from `public/`, including `robots.txt`, `sitemap.xml`, `404.html`, and image assets

After the workflow CNAME step or `npm run deploy`, `dist/` should also contain:

```text
dist/CNAME
```

with:

```text
getsoundwise.co
```

## Deployment Checklist

Before deploying:

1. Run `npm run validate:landing-copy`.
2. Run `npm run build`.
3. If page routing changed, confirm the page is listed in `vite.config.js`.
4. If an indexed public page was added, confirm it is listed in `public/sitemap.xml`.
5. Push to `main` or run the GitHub Pages workflow manually.

After deploying:

1. Confirm the GitHub Actions workflow completed successfully.
2. Confirm `https://getsoundwise.co` loads over HTTPS.
3. Check any changed or newly added page URL directly.
4. For SEO pages, confirm the URL matches `public/sitemap.xml`.

## Common Issues

### Custom domain disappears in GitHub Pages

Check whether `dist/CNAME` was present in the uploaded artifact. The workflow should create it with:

```bash
echo 'getsoundwise.co' > dist/CNAME
```

If the workflow was changed, restore the CNAME generation step.

### New page works locally but is missing after build

Confirm the page is listed in `vite.config.js` under `build.rollupOptions.input`.

For clean SEO URLs, use a content source path:

```text
content/pairs/example-page/index.html
```

and add a `seoPageSlugs` entry for the public route slug. `vite.config.js` maps content source paths back to the existing clean public URL layout during build.

### Page is live but not in the sitemap

Add the production URL to:

```text
public/sitemap.xml
```

Only add pages that should be indexed.

### Assets are missing in production

For static files referenced directly from HTML, prefer storing them in `public/` and referencing them with root-relative paths such as:

```text
/EMP_logo.png
```

If an asset is imported or linked from source code, confirm Vite can process that reference during `npm run build`.

### GitHub Pages workflow fails during install

The workflow uses Node.js 20 and `npm ci`. Confirm `package-lock.json` is committed and matches `package.json`.

### Validation fails

Run:

```bash
npm run validate:landing-copy
```

The script reports structural and runtime translation issues in `landing-copy.json`, `index.html`, and the shared i18n runtime files. Fix the reported missing keys or ordering drift before deploying content changes.
