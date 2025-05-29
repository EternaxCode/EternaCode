# EternaCode Homepage

This repository contains the source for the EternaCode website built with [Next.js](https://nextjs.org/). The site is exported as static files and deployed automatically to **GitHub Pages** using the workflow in `.github/workflows/pages.yml`.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Deployment

Every push to the `main` branch triggers the GitHub Actions workflow which builds the site and publishes the `out` directory to GitHub Pages.

