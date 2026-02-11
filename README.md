# Recoilly 🎯

> **Master your spray control. Analyze your recoil. Perfect your aim.**

**Recoilly** is a lightweight, high-performance desktop overlay designed for FPS players (CS2, Valorant, Apex Legends, etc.) who want to analyze and improve their recoil mechanics.

Unlike generic crosshair overlays, Recoilly records your mouse movements in real-time, visualizes your spray pattern, and allows you to compare it against perfect "ghost" patterns using a precision difference viewer.

---

## ✨ Features

### 🔍 Precision Overlay

* **Real-time Tracking:** Visualizes every "shot" (mouse click/movement) directly on your screen.
* **Pixel-Perfect Zoom:** Built-in "Lens" feature that magnifies your crosshair area for pixel-perfect adjustments.
* **Transparent & Click-through:** Designed to sit unobtrusively on top of your game window.

### 📊 Pattern Analytics (Diff Viewer)

* **Ghost Patterns:** Save your best attempts or import pro patterns to use as a "Ghost" reference.
* **Visual Diff:** The "Diff Viewer" automatically overlays your current attempt (Green) against the saved master pattern (Red).
* **Deviation Metrics:** Instantly see where your spray went off-track.

### 💾 Weapon Library

* **Database System:** Create, name, and save profiles for different weapons (e.g., AK-47, M4A1-S, MP5).
* **Quick Switch:** Hot-swap between patterns during practice sessions.

### 🎨 Modern UI

* **Gamer-Centric Design:** Dark mode by default, built with a sleek `zinc` and `emerald` palette.
* **Interactive Minimap:** A draggable spray visualizer that stays out of your way.

---

## 🛠️ Tech Stack

Recoilly is built with modern web technologies wrapped in a highly optimized Rust backend for minimal footprint.

* **Core:** [Tauri](https://tauri.app/) (Rust + Webview) for ultra-low memory usage.
* **Frontend:** React + TypeScript.
* **Styling:** Tailwind CSS + Framer Motion (animations).
* **State:** Zustand.
* **Linting:** Biome.

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
