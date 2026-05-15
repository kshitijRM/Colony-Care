<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Colony%20Care&fontSize=70&fontAlignY=38&desc=Your%20Community%2C%20Connected.&descAlignY=62&descSize=18&fontColor=ffffff&animation=fadeIn" width="100%"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&pause=1000&color=E94560&center=true&vCenter=true&width=600&lines=🏘️+Residential+Colony+Management+App;📱+React+Native+%2B+Expo+%2B+TypeScript;🚀+Open+Source+%7C+PRs+Welcome!)](https://git.io/typing-svg)

<br/>

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo Router](https://img.shields.io/badge/Expo_Router-1C1C1E?style=for-the-badge&logo=expo&logoColor=white)](https://expo.github.io/router/)

[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-2ECC71?style=flat-square)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-F39C12?style=flat-square)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/kshitijRM/Colony-Care?style=flat-square&color=F1C40F)](https://github.com/kshitijRM/Colony-Care/stargazers)
[![Issues](https://img.shields.io/github/issues/kshitijRM/Colony-Care?style=flat-square&color=E74C3C)](https://github.com/kshitijRM/Colony-Care/issues)
[![Last Commit](https://img.shields.io/github/last-commit/kshitijRM/Colony-Care?style=flat-square&color=1ABC9C)](https://github.com/kshitijRM/Colony-Care/commits)

</div>

---

## 🏘️ About

**Colony-Care** is a cross-platform mobile app that modernizes how residential communities — housing societies, gated colonies, and apartments — communicate and operate.

> No more chaotic WhatsApp groups or missed paper notices. **One app. One community. Zero friction.**

Built with **React Native + Expo**, fully typed in **TypeScript**, and navigated via **Expo Router's** file-based routing.

---

## 📸 Screenshots

<div align="center">

### 🔐 Login & 🏠 Home Dashboard
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/login.jpeg" width="30%"/>  &nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/home-resident.jpeg" width="30%"/>  &nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/home-admin.jpeg" width="30%"/>

<br/><br/>

### 📋 Complaints & 🚨 Emergency SOS
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/complaints.jpeg" width="30%"/>  &nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/raise-complaint.jpeg" width="30%"/>  &nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/sos.jpeg" width="30%"/>

<br/><br/>

### 💬 Community Feed & 👤 Profile
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/feed.jpeg" width="30%"/>  &nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/profile-resident.jpeg" width="30%"/>  &nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/profile-admin.jpeg" width="30%"/>

<br/><br/>

### 👷 Colony Staff Management
<img src="https://raw.githubusercontent.com/kshitijRM/Colony-Care/main/assets/screenshots/staff.jpeg" width="30%"/>

</div>

> 📁 **To make screenshots show up:** Upload your 10 app images into `assets/screenshots/` folder in the repo with these exact filenames:
> `login.jpeg` · `home-resident.jpeg` · `home-admin.jpeg` · `complaints.jpeg` · `raise-complaint.jpeg` · `sos.jpeg` · `feed.jpeg` · `profile-resident.jpeg` · `profile-admin.jpeg` · `staff.jpeg`

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔐 **Login** | Google OAuth + Email/Password login |
| 🏠 **Dashboard** | Colony Health Score, weekly trends, quick actions |
| 📋 **Complaints** | Raise, filter & track complaints with Map View |
| 🤖 **AI Categorization** | Auto-categorize complaints by type & priority |
| 🚨 **Emergency SOS** | One-tap SOS for Fire, Medical, Security, Flood |
| 💬 **Community Feed** | Trending posts, announcements & discussions |
| 👤 **Profile & Badges** | Resident stats, earned badges, settings |
| 👷 **Staff Management** | Register & manage colony workers (Admin only) |
| 📊 **Admin Dashboard** | Analytics, staff control & colony-wide insights |

---

## 🛠️ Tech Stack

```
📱 Framework   →  React Native + Expo (Managed Workflow)
🧭 Routing     →  Expo Router  (File-based, like Next.js)
🔷 Language    →  TypeScript   (Strict mode)
🎨 Styling     →  React Native StyleSheets
🔣 Icons       →  @expo/vector-icons
```

---

## 📁 Project Structure

```
Colony-Care/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # 🏠 Dashboard
│   │   ├── complaints.tsx     # 📋 Complaints
│   │   ├── feed.tsx           # 💬 Community Feed
│   │   └── profile.tsx        # 👤 Profile
│   └── _layout.tsx            # Root layout
├── components/                # Reusable UI components
├── constants/                 # Colors, sizes
├── hooks/                     # Custom hooks
├── types/                     # TypeScript definitions
└── assets/
    └── screenshots/           # 📸 App screenshots
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js `v18+`, Expo CLI, Expo Go app on your phone.

```bash
# Clone & install
git clone https://github.com/kshitijRM/Colony-Care.git
cd Colony-Care
npm install

# Start dev server
npx expo start
```

> 📱 Scan the QR code with **Expo Go** — you're live!

```bash
npx expo start --android   # Android emulator
npx expo start --ios       # iOS simulator (macOS only)
npx expo start --clear     # Clear cache & restart
```

---

## 🤝 Contributing

```bash
git checkout -b feat/your-feature
# make changes
git commit -m "feat: your message"
git push origin feat/your-feature
# Open a Pull Request 🚀
```

**Commit convention:** `feat:` · `fix:` · `docs:` · `style:` · `refactor:` · `chore:`

> 🟢 New? Look for [`good first issue`](https://github.com/kshitijRM/Colony-Care/issues?q=label%3A%22good+first+issue%22) labels!

---

## 🗺️ Roadmap

- [x] Project scaffold + Expo Router
- [x] Tab navigation + core screens
- [x] Complaint system with AI categorization
- [x] Emergency SOS screen
- [x] Community Feed
- [x] Admin & Staff Management
- [ ] Backend API integration
- [ ] Push notifications
- [ ] Visitor QR code generation
- [ ] Dark mode support

---

## 👥 Team

| | Name | GitHub |
|--|------|--------|
| 👑 | **Kshitij** | [@kshitijRM](https://github.com/kshitijRM) |
| 🚀 | **Vijay Purandare** | [@vijju9019](https://github.com/vijju9019) |
| 🤝 | **Amith H P** | [@amith-hp](https://github.com/amith-hp) |

**The Debugger's** · Cambridge Institute of Technology, Bangalore 🇮🇳

---

## 🏆 Contributors

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=kshitijRM/Colony-Care)](https://github.com/kshitijRM/Colony-Care/graphs/contributors)

</div>

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=fadeIn" width="100%"/>

*Made with ❤️ by The Debugger's · If this helped you, drop a ⭐!*

</div>
