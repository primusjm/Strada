# Rising Leaders Center

Jekyll site styled with Tailwind (PostCSS), hosted on GitHub Pages and edited with Sveltia CMS.

## Editing content
Go to `/admin`, sign in with GitHub (or a personal access token with repo access) and edit articles, site content
(testimonials, FAQs, logos, values), gallery photos, page headings and all page text. Saving commits to `main`; the
GitHub Action in `.github/workflows/pages.yml` then rebuilds and publishes the site.
Thumbnails for new gallery and article images are created during that build by `bin/make-thumbs`.

Page text lives in `_data/pages/*.yml` (one file per page) and is rendered by the layouts. Text fields accept basic HTML such as `<b>`.
Field labels, the form fields on the contact page and image alt text for non-CMS images stay in the layouts.

## Local development
`npm ci && bundle install`, then `bin/start` (serves with live reload) or `JEKYLL_ENV=production bundle exec jekyll build`.

## Hosting setup (once)
Repository Settings, Pages, Source: GitHub Actions. The custom domain comes from `CNAME`.
