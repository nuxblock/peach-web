# Peach Bitcoin — Web Prototype

## First-time setup

1. **Create a GitHub repository** — name it `peach-web` (or anything you like)

2. **Update `vite.config.js`** — change the `base` value to match your repo name exactly:
   ```js
   base: '/your-repo-name/',
   ```

3. **Push this folder to the repo**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repo on GitHub → Settings → Pages
   - Under "Source", select **GitHub Actions**
   - Save

5. **Done.** Every push to `main` triggers a build and deploys automatically.
   Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/peach-web/` in your browser.

---

## Screens

| Route | Screen |
|-------|--------|
| `/` | Auth / Landing |
| `/home` | Home Dashboard |
| `/market` | Market View |
| `/offer/new` | Offer Creation |
| `/trades` | Trades Dashboard |
| `/trade/:id` | Trade Execution |
| `/settings` | Settings |
