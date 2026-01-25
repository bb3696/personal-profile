# 🌎 Personal Profile - National Park Explorer

A clean and responsive React + Vite portfolio site with an interactive showcase of U.S. National Parks and personal profile info.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-online-success?style=flat&logo=github)](https://bb3696.github.io/personal-profile/)
[![Built with Vite](https://img.shields.io/badge/Vite-React-blueviolet?logo=vite)](https://vitejs.dev/)
[![Deploy](https://img.shields.io/github/deployments/bb3696/personal-profile/github-pages)](https://github.com/bb3696/personal-profile)

---

## 📸 Features

- 🎨 Responsive personal homepage (React + CSS)
- 🗺️ Interactive National Park explorer (`/parks`)
- 📍  U.S. state visitation map (`/usmap`)
- 🔍 Search & filter parks with smooth animation
- ✅ Visited parks tracking (localStorage)
- 🌐 Deployed on GitHub Pages / AWS Amplify

---

## 🚀 Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vitejs.dev)
- React Router DOM
- Font Awesome
- D3.js (map rendering)
- LocalStorage
- GitHub Pages

---

## 🛠️ Local Setup

```bash
git clone https://github.com/bb3696/personal-profile.git
cd personal-profile
npm install
npm run dev
```

## 📦 Deployment

### GitHub Pages
默认配置，直接运行：
```bash
npm run build
npm run deploy
```

### AWS Amplify
项目已包含 `amplify.yml` 配置文件。在 AWS Amplify Console 中：
1. 连接你的 GitHub 仓库
2. Amplify 会自动检测 `amplify.yml` 并使用根路径 (`/`) 构建
3. 如需手动设置环境变量，在 Amplify Console → App settings → Environment variables 添加：
   - `VITE_BASE_URL` = `/`

**注意**：`dist/index.html` 中的资源路径会根据 `VITE_BASE_URL` 自动调整：
- GitHub Pages: `/personal-profile/assets/...`
- AWS Amplify: `/assets/...`
