# 🎱 PoolPoint

Cross-platform mobile app for tracking snooker and pool games. PoolPoint lets you log scores, track payments, analyze player performance, and more perfect for casual or competitive play.

---

## 📱 Overview

PoolPoint is designed to offer a clean, intuitive experience for both individuals and teams. It allows players to:

* Log individual and team games
* Monitor payments
* Access complete game history
* View player statistics and performance summaries

---

## ✨ Key Features

* ✅ Record individual and team games with player names, scores, and payment tracking
* ✅ View daily summaries: total games, payments, and top performers
* ✅ Analyze performance with last-game and full history stats
* ✅ Built-in **Game Timer** to track match durations
* ✅ Efficient state management with **Zustand** for fast UI updates
* ✅ Seamless navigation via **Expo App Router**
* ✅ Consistent mobile-optimized UI with **Ionicons**

---

## 🛠️ Technology Stack

| Tech                | Purpose                             |
| ------------------- | ----------------------------------- |
| React Native & Expo | Cross-platform app development      |
| Zustand             | Lightweight global state management |
| Expo App Router     | File-based routing and screen nav   |
| Fetch API           | Backend API communication           |
| Ionicons            | Icon set for UI                     |

---

## ⚙️ Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/H-R-Wells2/PoolPoint.git
   ```

2. **Navigate to project directory**

   ```bash
   cd poolpoint
   ```

3. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start development server**

   ```bash
   npx expo start
   # or
   yarn expo start
   ```

5. **Run on device/emulator**
   Use **Expo Go** or simulator to preview the app.

6. **(Optional)**
   Update API endpoints in the app if using a custom backend.

---

## 📲 Usage Instructions

* **Launch App** → Dashboard instantly loads cached data while updating from the backend.
* **Main Options**:

  * 🎯 Start a New Game (Individual)
  * 👥 Start a Team Game (2v2)
  * 🕘 View Games History (Select a date to see games played that day and payment summary based on rank)
  * ⚙️ Settings
* **Gameplay**:

  * Update scores
  * Save to log game history
  * Use timer to track duration
  * All game data is saved automatically and accessible in the History screen
* **Dashboard**:

  * See daily summary
  * View last game breakdown

---

## 📁 Project Structure

```
/app          # Screens & routes via Expo App Router
/assets       # Fonts, images, icons
/store        # Zustand store (state management)
/components   # Reusable UI elements
```

---

## 🐛 Known Issues & ✅ Future Improvements

* [x] Optimize "Your Activity"
* [x] Disable button on submit
* [x] Each player points count in team game
* [ ] Improve design for alert dialogs
* [ ] Add tick sound on input
* [x] Improved timer controls
* [ ] Player amount customization
* [ ] Authentication system
* [x] Fix animation on submit
* [x] Ability to delete games
* [ ] Ability to select multiple games
* [ ] Offline storage with AsyncStorage/SQLite
* [ ] Enhanced game analytics with charts
* [ ] Notification/reminders for scheduled games
* [ ] Improve UI animations and error handling
* [ ] Add support for user profiles
* [ ] Reduce APK size for production

---

## 🤝 Contributing

We welcome contributions!
To contribute:

1. Fork the repo
2. Create a branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m 'Add feature'
   ```
4. Push and open a pull request:

   ```bash
   git push origin feature/your-feature
   ```

✅ Make sure your code follows the existing style and passes linting.

---

## 📬 Support & Contact

For issues, suggestions, or bugs:
**GitHub Issues** or email at:
📧 [kadamshubham10246@gmail.com](mailto:kadamshubham10246@gmail.com)
