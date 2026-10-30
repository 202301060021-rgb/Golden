# A Birthday Love Story

A responsive, interactive birthday website built with React, TypeScript, Vite and Framer Motion. The visual system uses the golden ratio (approximately 1:1.618) as a guide for its main content split, reading width, spacing rhythm and type scale.

## Run locally

Use Node.js 20.19+ or 22.12+ and npm. From this folder run:

```sh
npm install
npm run dev
```

Create and preview a production build:

```sh
npm run typecheck
npm run build
npm run preview
```

## Personalize the page

Edit `src/config/birthday.ts`. Set `recipientName` and `senderName`, then update the greeting, letter, reasons, photo captions, wishes and section visibility.

### Add photos

Put images in `public/photos/`. In `birthday.memories.slots` in `src/config/birthday.ts`, set each `src` to a path such as `/photos/first-walk.jpg` and add a descriptive `alt` value. Add or remove slot entries to change the number of memories. Empty or unreadable image paths show a placeholder.

### Add music

Put an audio file you are authorized to use at `public/audio/our-song.mp3`, or change `audioSrc` in the config. The player does not autoplay and the site works without a track.

Public files are resolved using Vite's base URL, so photos, audio and the favicon work on both local hosting and the GitHub Pages project path.

## Publish on GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. It type-checks and builds the site, then deploys `dist/` to GitHub Pages whenever code is pushed to `main` or `master`.

1. Push this project to the GitHub repository named `web`.
2. Open **Settings → Pages** in that repository.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Push to `main` (or `master`) or run the workflow manually from the **Actions** tab.
5. After the deployment job succeeds, open `https://202301060021-rgb.github.io/web/`.

The Vite base path switches to `/web/` in GitHub Actions builds. Local builds remain relative-path friendly.

## Other static hosts

For hosts such as Netlify or Vercel, use `npm run build` and publish the `dist` directory.
