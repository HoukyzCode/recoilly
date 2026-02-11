# Recoilly 🎯

<p align="center">
  <img src="https://github.com/HoukyzCode/recoilly/blob/main/src-tauri/icons/recoilly.png" alt="Recoilly Logo" width="200" />
</p>

> **Master your spray control. Analyze your recoil. Perfect your aim.**

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/742586395071086639/1469448230466228419/8C224D06-EF1B-423C-94E8-3284B8F402BC.png?ex=698cf7cf&is=698ba64f&hm=90901e5d54bd7332bb419146bd86382823b930b9962e61bef0555f8add200d26&" alt="Recoilly Demo" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/version-0.1.0--alpha-green" alt="Version" />
  <img src="https://img.shields.io/badge/built%20with-Tauri%20%2B%20React-orange" alt="Tech Stack" />
</p>

---

**Recoilly** is a lightweight, high-performance desktop overlay designed for FPS players (CS2, Valorant, Apex Legends, etc.) who want to analyze and improve their recoil mechanics.

---

## ✨ Features

### 🔍 Precision Overlay & Diff Viewer
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/742586395071086639/1469448230910820465/1E24428E-A09B-4FE8-A19D-09038AF377D5.png?ex=698cf7cf&is=698ba64f&hm=33515f64cf08b65bf17f621145f077234d63ef78cb8ad056908ecabf17ceabe5&" alt="Diff Viewer Feature" width="600" />
</p>

* **Real-time Tracking:** Visualizes every "shot" (mouse click/movement) directly on your screen.
* **Pixel-Perfect Zoom:** Built-in "Lens" feature that magnifies your crosshair area.
* **Visual Diff:** The "Diff Viewer" automatically overlays your current attempt (Green) against the saved master pattern (Red).

### 💾 Weapon Library
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/742586395071086639/1469450412569657496/67771FEA-9703-41F5-8E35-9B16B90247DB.png?ex=698cf9d7&is=698ba857&hm=d3d0f35f5730f74e07939c925b6557411bb8b31f4793cafdf89c74e73fb7ad6b" alt="Weapon List" width="600" />
</p>

* **Database System:** Create, name, and save profiles for different weapons.
* **Quick Switch:** Hot-swap between patterns during practice sessions.

---

## 🛠️ Tech Stack

Recoilly is built with modern web technologies wrapped in a highly optimized Rust backend.

* **Core:** [Tauri](https://tauri.app/) (Rust + Webview)
* **Frontend:** React + TypeScript + Tailwind CSS
* **State:** Zustand

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/recoilly.git](https://github.com/yourusername/recoilly.git)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Rust](https://www.rust-lang.org/tools/install) (required for Tauri)
* [pnpm](https://pnpm.io/) (recommended)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/recoilly.git
cd recoilly

```


2. **Install dependencies:**
```bash
pnpm install

```


3. **Run in Development Mode:**
```bash
pnpm tauri dev

```


4. **Build for Production:**
```bash
pnpm tauri build

```



---

## 🎮 How to Use

1. **Launch Recoilly:** Open the application alongside your game.
2. **Select a Weapon:** Choose a saved preset or click "Create New Weapon".
3. **Record:** - Click the **Record** button (or set a hotkey).
* Shoot at a wall in-game.
* Recoilly captures your mouse compensation path.


4. **Analyze:**
* Click **Stop**.
* Open the **Save/Diff** menu to see how your attempt compares to your previous best.


5. **Save:** If you found a perfect pattern, save it to use as a future "Ghost" guide.

---

## ⚠️ Anti-Cheat Disclaimer

**Recoilly is a passive visualizer.** It does not inject code into game processes, read game memory, or automate mouse movements (macros). It acts solely as a transparent window overlay.

*However, always use overlay tools at your own risk. We recommend using Recoilly primarily in "Practice Mode," "Shooting Range," or private servers to ensure compliance with strict competitive Terms of Service.*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
Built with ❤️ for the FPS community.
</p>

