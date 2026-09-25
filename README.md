# 🌱 CleanCity

**CleanCity** is an open-source mobile application built with **React Native and Expo**, focused on creating a foundation for smart, location-aware and image-based workflows on mobile devices.

The project currently includes a **Crop Detection** workflow and a **Profile** section, with support for camera/image handling, location services, navigation, responsive UI components, and data visualization.

> 🚧 **Project status:** Active development / early-stage prototype
> 📱 **Platform:** Android, iOS, and Web
> ⚛️ **Framework:** React Native + Expo

---

## ✨ Features

### 📷 Image & Camera Support

CleanCity includes mobile capabilities for working with images and camera input through Expo and React Native image libraries.

### 🌱 Crop Detection Workflow

The application includes a dedicated **Crop Detection** screen that serves as the main application workflow.

The project is structured so that image-based detection functionality can be extended as development progresses.

### 📍 Location Support

The project includes Expo Location integration, providing the foundation for location-aware functionality.

### 👤 Profile

A dedicated Profile screen is included in the application's navigation flow.

### 📊 Data Visualization

The project includes charting libraries that can be used to display analytical or application-related data.

### 🧭 Navigation

CleanCity uses React Navigation with a native stack-based navigation structure.

The current application navigation includes:

* Crop Detection
* Profile

### 🎨 Modern React Native UI

The project uses several Expo and React Native UI technologies, including:

* Expo Blur
* Expo Linear Gradient
* Expo Image
* Expo Symbols
* React Native SVG
* React Native Reanimated
* React Native Gesture Handler
* Safe Area Context

### 🌐 Cross-Platform Development

Because CleanCity is built with Expo and React Native, the project is structured for cross-platform development across:

* Android
* iOS
* Web

---

## 🛠️ Technology Stack

| Technology                       | Purpose                             |
| -------------------------------- | ----------------------------------- |
| **React Native**                 | Mobile application framework        |
| **Expo**                         | Cross-platform development platform |
| **Expo Router**                  | Application routing                 |
| **React Navigation**             | Screen navigation                   |
| **JavaScript / TypeScript**      | Application development             |
| **React 19**                     | UI library                          |
| **Expo Camera**                  | Camera functionality                |
| **Expo Image Picker**            | Image selection                     |
| **Expo Location**                | Location services                   |
| **React Native Reanimated**      | Animations                          |
| **React Native Gesture Handler** | Gesture interactions                |
| **React Native SVG**             | Vector graphics                     |
| **Victory Native**               | Data visualization                  |
| **React Native Chart Kit**       | Charts and analytics                |
| **Expo Haptics**                 | Haptic feedback                     |
| **Expo Splash Screen**           | Application splash screen           |

The current dependency configuration is available in `package.json`.

---

## 📁 Project Structure

```text
CityClean/
│
├── .vscode/
│
├── app/
│   ├── CropDetection
│   └── Profile
│
├── assets/
│   └── images/
│
├── App.js
├── app.json
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
└── README.md
```

The repository currently contains the main `app` directory, application assets, Expo configuration, JavaScript/TypeScript configuration, and package management files.

---

## 🚀 Getting Started

### Prerequisites

Before running CleanCity, make sure you have:

* Node.js installed
* npm installed
* Git installed
* Expo-compatible development environment
* Android Studio for Android emulator development, if required
* Xcode for iOS development on macOS, if required

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/Swyom/CityClean.git
```

Move into the project directory:

```bash
cd CityClean
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Application

Start the Expo development server:

```bash
npx expo start
```

You can then choose an available development target from the Expo development interface.

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

> iOS development through the native iOS simulator requires macOS and Xcode.

### Web

```bash
npm run web
```

The available npm scripts are defined in the project's `package.json`.

---

## 🧹 Linting

Run the project's Expo lint configuration with:

```bash
npm run lint
```

---

## ⚙️ Application Configuration

The Expo configuration is defined in:

```text
app.json
```

The current application configuration identifies the application as:

```text
Name: CleanCity
Slug: CleanCity
Version: 1.0.0
Orientation: Portrait
```

The project also includes Android adaptive icon configuration, a web favicon, splash-screen configuration, and Expo Router integration.

---

## 🧭 Application Flow

The current root navigation starts with the **Crop Detection** screen.

```text
CleanCity
   │
   ├── Crop Detection
   │
   └── Profile
```

The application's `App.js` currently uses React Navigation's native stack and sets `CropDetection` as the initial route.

---

## 🔮 Future Development

CleanCity is designed as an extensible foundation for future smart-city and image-based mobile functionality.

Potential areas for future development include:

* Enhanced crop/image detection
* Improved camera workflows
* Location-based features
* Data analytics and visualization
* User profiles
* Better accessibility
* Offline functionality
* Improved testing
* Performance optimization
* Security improvements
* Automated testing and CI/CD
* Improved documentation
* Community contribution workflows

These are **future development directions**, not claims about functionality already implemented in the current repository.

---

## 🤝 Contributing

Contributions are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test your changes locally.
5. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

6. Push your branch.

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

When contributing, please:

* Keep changes focused.
* Follow the existing project structure.
* Avoid committing secrets or private credentials.
* Test changes before submitting a pull request.
* Clearly describe the purpose of your changes.

---

## 🐛 Issues & Feature Requests

If you discover a bug or have an idea for improving CleanCity, please open an issue in the GitHub repository.

When reporting a bug, include:

* Description of the problem
* Steps to reproduce it
* Expected behavior
* Actual behavior
* Device/platform
* Relevant screenshots or logs

---

## 🔐 Security

Please do not commit:

* API keys
* Passwords
* Access tokens
* Private credentials
* `.env` files containing secrets
* Other sensitive information

If you discover a security vulnerability, please report it privately to the project maintainer rather than publicly exposing sensitive information.

A dedicated security policy can be added as the project matures.

---

## 📱 Supported Platforms

CleanCity is structured as a cross-platform Expo application.

| Platform | Support |
| -------- | ------- |
| Android  | ✅       |
| iOS      | ✅       |
| Web      | ✅       |

Actual feature availability may vary by platform, particularly for hardware-dependent functionality such as camera and location services.

---

## 📌 Project Status

CleanCity is currently an **early-stage open-source project under development**.

The project is being developed incrementally, with the goal of building a maintainable mobile application and expanding its capabilities over time.

---

## 📄 License

This project is intended to be open source.

**A license should be added to the repository before distributing the project as an open-source software project.**

Recommended next step:

```text
Add an appropriate LICENSE file to the repository.
```

Choose a license that matches your intended permissions and the licensing requirements of any third-party code, assets, or dependencies you distribute.

---

## 👨‍💻 Maintainer

**Swyom**

GitHub:
https://github.com/Swyom

Project:
https://github.com/Swyom/CityClean

---

## ⭐ Support the Project

If you find CleanCity useful or want to follow its development:

* ⭐ Star the repository
* 🐛 Report bugs
* 💡 Suggest improvements
* 🔧 Contribute code
* 📖 Improve documentation
* 🔀 Submit pull requests

Every contribution helps improve the project.

---

## 📚 Built With

CleanCity is built using the modern React Native and Expo ecosystem, including Expo modules, React Navigation, React Native Reanimated, image/camera functionality, location services, and visualization libraries.

---

**CleanCity — Building a foundation for smarter mobile applications. 🌱**
