# 🧠 NeuroScroll

**A privacy-first Chrome extension that analyzes YouTube Shorts viewing behavior through neuroscience-based metrics.**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)

---

## 🎯 What is NeuroScroll?

NeuroScroll helps you understand your digital consumption patterns by analyzing how you interact with YouTube Shorts. Using neuroscience-based metrics, it provides insights into attention span, scrolling behavior, and viewing habits—all while keeping your data completely private on your device.

---

## 🔑 Key Features

- **🔒 Privacy-First**: All data stays on your device—nothing is sent to external servers  
- **🧠 Neuroscience Metrics**: Behavioral analysis using dopamine patterns and attention research  
- **📊 Real-Time Analytics**: Live tracking with visualizations  
- **🤖 AI Insights**: TensorFlow.js-powered session classification and recommendations  
- **♿ Accessible Design**: Screen reader and keyboard support  
- **📱 Modern UI**: Dark mode with responsive design  

---

## 🚀 Quick Start

### **Installation & Build**

1. **Clone the repository**
```bash
git clone https://github.com/PratikCreates/neuroscroll.git
cd neuroscroll
```
```bash
#Install dependencies
npm install
```
Build the extension
```bash      
npm run build
Load in Chrome
```
Open chrome://extensions/

Enable "Developer mode"

Click "Load unpacked" and select the project folder

NeuroScroll icon should appear in your extensions bar

Usage
Click the extension icon and enable the tracking service

Go to YouTube Shorts and click "Start Session"

Browse videos as usual

View insights in the popup or click "Advanced Stats"

Export data as CSV for personal tracking

📊 Metrics Explained
Basic Metrics
Videos Watched: Total Shorts viewed

Interactions: Scrolls, enters, leaves, and replays

Attention Span: Average watch time per video

Dopamine Index: Measures rapid content consumption

Advanced Analytics
Scroll Momentum: % of videos skipped in under 3 seconds

Reward Variability: Consistency of viewing times

Binge Bursts: Streaks of 5+ rapid skips

Engagement Half-Life: How quickly attention drops

Session Archetype: Explorer 🟢, Sampler 🟡, or Doomscroller 🔴

Cognitive Load: Mental strain from rapid content switching

🛠 Development
Tech Stack
Frontend: Next.js 14, TypeScript, Tailwind CSS

Extension: Chrome Extension Manifest V3

AI/ML: TensorFlow.js for behavioral classification

Testing: Jest, Playwright for E2E tests

Build Tools: Webpack, PostCSS

Project Structure
bash
Copy
Edit
├── manifest.json          # Chrome extension manifest
├── src/                   # Core extension logic
│   ├── background/        # Service worker
│   ├── content/           # YouTube integration
│   ├── utils/             # Shared utilities & metrics engine
│   └── types/             # TypeScript definitions
├── popup-src/             # Next.js popup application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── hooks/             # Custom React hooks
├── popup-dist/            # Built popup files
├── tests/                 # E2E and integration tests
├── docs.html              # User documentation
Start Development
```bash
npm run dev
Load the extension in Chrome via chrome://extensions/ in Developer mode.
```
🔒 Privacy & Security
Data Privacy
Local Storage Only: All metrics saved locally

No External Servers: Zero data transmission

No Personal Info: Only behavioral patterns analyzed

User Control: Export or delete data anytime

Permissions
activeTab: Detect when on YouTube Shorts

storage: Save metrics locally

scripting: Analyze page interactions

🤝 Contributing
Getting Started
Fork the repo

Create a feature branch: git checkout -b feature/amazing-feature

Make changes & add tests

Ensure tests pass: npm run test

Commit: git commit -m 'Add amazing feature'

Push branch and open a Pull Request

Guidelines
Follow TypeScript/React patterns

Add tests for new features

Ensure accessibility

Maintain privacy-first principles

📄 License
MIT License — see LICENSE for details.

👨‍💻 Author
Pratik Shah

GitHub: @PratikCreates

LinkedIn: PratikCreates

📈 Roadmap
 Chrome Web Store Release

 Firefox Extension Support

 Advanced AI Recommendations

 Data Visualization Improvements

 Mobile App Companion

<div align="center"> **Made with 🧠 for mindful digital consumption**
⭐ Star this repo • 🐛 Report Bug • 💡 Request Feature

</div> ```
