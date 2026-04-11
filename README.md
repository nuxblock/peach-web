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
├── screens/
│   ├── trade-execution/      # Split into folder
│   │   ├── index.jsx         # Main component + CSS
│   │   └── components.jsx    # Sub-components (stepper, cards, panels, etc.)
│   ├── trades-dashboard/     # Split into folder
│   │   ├── index.jsx         # Main component + CSS
│   │   ├── components.jsx    # TradeCard, HistoryTable, filters, etc.
│   │   └── MatchesPopup.jsx  # Match list/detail/confirm popup
│   ├── offer-creation/       # Split into folder
│   │   ├── index.jsx         # Main component
│   │   ├── components.jsx    # LivePreview, AmountSlider, PMModal
│   │   └── styles.js         # CSS block
│   ├── peach-home.jsx
│   ├── peach-market-view.jsx
│   ├── peach-auth.jsx
│   ├── peach-settings.jsx
│   └── peach-payment-methods.jsx
├── components/           # Shared UI components
│   ├── Navbars.jsx       # SideNav, Topbar, PeachIcon
│   ├── BitcoinAmount.jsx # SatsAmount, IcoBtc
│   ├── Avatar.jsx        # Shared avatar component
│   └── StatusChip.jsx    # Trade status chip
├── hooks/                # Shared logic
│   ├── useAuth.js        # Auth state management
│   └── useApi.js         # Fetch helpers with auto auth headers
├── styles/
│   └── global.css        # Shared tokens, reset, topbar, sidenav, keyframes
├── utils/
│   ├── pgp.js            # PGP encrypt/decrypt helpers
│   └── format.js         # Number/date formatting helpers
├── data/
│   └── statusConfig.js   # Trade status configuration (31 statuses)
├── App.jsx               # Router
├── main.jsx              # Entry point
└── peach-validators.js   # Input validation helpers
```

---

## Screens

| Route | Screen | File |
|-------|--------|------|
| `/` | Auth / Landing | `peach-auth.jsx` |
| `/home` | Home Dashboard | `peach-home.jsx` |
| `/market` | Market View | `peach-market-view.jsx` |
| `/offer/new` | Offer Creation | `offer-creation/index.jsx` |
| `/trades` | Trades Dashboard | `trades-dashboard/index.jsx` |
| `/trade/:id` | Trade Execution | `trade-execution/index.jsx` |
| `/settings` | Settings | `peach-settings.jsx` |
| `/payment-methods` | Payment Methods | `peach-payment-methods.jsx` |
