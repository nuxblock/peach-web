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

## Project structure

```
src/
├── screens/              # One file per screen (see routes below)
├── components/           # Shared UI components
│   ├── Navbars.jsx       # SideNav, Topbar, PeachIcon
│   └── BitcoinAmount.jsx # SatsAmount, IcoBtc
├── hooks/                # Shared logic
│   ├── useAuth.js        # Auth state management
│   └── useApi.js         # Fetch helpers with auto auth headers
├── styles/
│   └── global.css        # Shared tokens, reset, topbar, sidenav, keyframes
├── utils/
│   └── pgp.js            # PGP encrypt/decrypt helpers
├── data/
│   └── mockData.js       # All mock/demo data (only used when logged out)
├── App.jsx               # Router
├── main.jsx              # Entry point
├── peach-api-config.js   # API endpoint catalogue
└── peach-validators.js   # Input validation helpers
```

---

## Screens

| Route | Screen | File |
|-------|--------|------|
| `/` | Auth / Landing | `peach-auth.jsx` |
| `/home` | Home Dashboard | `peach-home.jsx` |
| `/market` | Market View | `peach-market-view.jsx` |
| `/offer/new` | Offer Creation | `peach-offer-creation.jsx` |
| `/trades` | Trades Dashboard | `peach-trades-dashboard.jsx` |
| `/trade/:id` | Trade Execution | `peach-trade-execution.jsx` |
| `/settings` | Settings | `peach-settings.jsx` |
| `/payment-methods` | Payment Methods | `peach-payment-methods.jsx` |
