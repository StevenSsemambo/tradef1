# TradeBaby Pro v8 — Installation Guide

## 📱 Mobile Installation (Recommended)

### iPhone/iPad (Safari)
1. Open `index.html` in Safari
2. Tap the **Share** button (box with arrow at bottom)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **Add** — icon appears on home screen
5. Open from home screen for full-screen offline experience

### Android (Chrome)
1. Open `index.html` in Chrome
2. Tap the **⋮ menu** (top right)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **Install** — icon appears on home screen

### Android (Samsung Internet)
1. Open in Samsung Internet
2. Tap **≡ menu** → **Add page to** → **Home screen**

## 💻 Desktop Installation

### Chrome / Edge
1. Open `index.html` in Chrome/Edge
2. Look for the **install icon** (⊕) in address bar
3. Click it → **Install**
4. App opens in its own window, works offline

### Via a local server (optional, for full PWA features)
```bash
# Python 3
python3 -m http.server 8080
# Then open: http://localhost:8080

# Node.js
npx serve .
# Then open: http://localhost:3000
```

## 🌐 Hosting (for sharing)

### Netlify (Free, easiest)
1. Go to netlify.com → drag the entire folder to deploy
2. Get a URL like `https://tradebaby.netlify.app`
3. Share with students — they can install from any device

### GitHub Pages
1. Push this folder to a GitHub repo
2. Settings → Pages → Deploy from main branch
3. App available at `https://username.github.io/tradebaby`

## 📂 File Structure
```
tradebaby_pro/
├── index.html          ← Main app (all-in-one)
├── sw.js               ← Service worker (offline support)
├── manifest.json       ← PWA manifest
├── offline.html        ← Offline fallback
└── icons/
    ├── icon.svg        ← Scalable icon
    ├── icon-192.png    ← Android home screen
    ├── icon-512.png    ← Splash screen
    └── apple-touch-icon.png ← iOS home screen
```

## ✅ Features
- 🔒 **100% Offline** — Works without internet after first load
- 💾 **Local Storage** — All data stays on your device
- 📊 **Full MT5-Style Chart** — Indicators, timeframes, pan & zoom
- 🤖 **TradeMind AI** — Intelligent offline mentor
- 🧬 **Trader DNA** — Personalised profiling
- 📈 **Analytics** — Behaviour, psychology, timing analysis
- 🔔 **Audio Notifications** — Real sound alerts
- 🏆 **Challenges** — 12 skill-building challenges

## 📞 Support
SayMy Tech Developers — TradeBaby Pro v8
