# 🧠 NeuroScroll **A privacy-first Chrome extension that analyzes YouTube Shorts viewing behavior through neuroscience-based metrics.** [![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/) [![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js) --- ## 🎯 **What is NeuroScroll?** NeuroScroll helps you understand your digital consumption patterns by analyzing how you interact with YouTube Shorts. Using neuroscience-based metrics, it provides insights into your attention span, scrolling behavior, and viewing habits—all while keeping your data completely private on your device. ### **🔑 Key Features** - **🔒 Privacy-First**: All data stays on your device—nothing is sent to external servers - **🧠 Neuroscience Metrics**: Advanced behavioral analysis using dopamine patterns and attention research - **📊 Real-Time Analytics**: Live tracking with beautiful visualizations - **🤖 AI Insights**: TensorFlow.js-powered session classification and recommendations - **♿ Accessible Design**: Full accessibility support with screen readers and keyboard navigation - **📱 Modern UI**: Dark mode interface with responsive design --- ## 🚀 **Quick Start** ### **Installation** 1. **Download the Extension**    - Clone this repository or download the ZIP    - Extract to your desired location 2. **Build the Extension**
bash

   npm install

   npm run build
3. **Load in Chrome**    - Open Chrome and go to chrome://extensions/    - Enable "Developer mode" (top right toggle)    - Click "Load unpacked" and select the project folder    - The NeuroScroll icon should appear in your extensions bar ### **Usage** 1. **Enable the Service**: Click the extension icon and enable the tracking service 2. **Start a Session**: Go to YouTube Shorts and click "Start Session" 3. **Browse Normally**: Watch videos as you usually would 4. **View Insights**: Check your metrics in the popup or click "Advanced Stats" for detailed analysis 5. **Export Data**: Download your data as CSV for personal tracking --- ## 📊 **Metrics Explained** ### **Basic Metrics** - **Videos Watched**: Total count of Shorts viewed in your session - **Interactions**: Total scrolls, enters, leaves, and replays - **Attention Span**: Average time spent watching each video - **Dopamine Index**: Measures rapid content consumption patterns ### **Advanced Analytics** - **Scroll Momentum**: Percentage of videos skipped in under 3 seconds - **Reward Variability**: Consistency of your viewing times (high variability may indicate addictive patterns) - **Binge Bursts**: Streaks of 5+ rapid skips in a row - **Engagement Half-Life**: How quickly your attention drops during a session - **Session Archetype**: AI classification as Explorer 🟢, Sampler 🟡, or Doomscroller 🔴 - **Cognitive Load**: Mental strain from rapid content switching --- ## 🛠 **Development** ### **Tech Stack** - **Frontend**: Next.js 14, TypeScript, Tailwind CSS - **Extension**: Chrome Extension Manifest V3 - **AI/ML**: TensorFlow.js for behavioral classification - **Testing**: Jest, Playwright for E2E testing - **Build**: Webpack, PostCSS ### **Project Structure**
├── manifest.json              # Chrome extension manifest

├── src/                       # Core extension logic

│   ├── background/           # Service worker

│   ├── content/              # YouTube integration

│   ├── utils/                # Shared utilities & metrics engine

│   └── types/                # TypeScript definitions

├── popup-src/                # Next.js popup application

│   ├── app/                  # App router pages

│   ├── components/           # React components

│   └── hooks/                # Custom React hooks

├── popup-dist/               # Built popup files

├── tests/                    # E2E and integration tests

├── docs.html                 # User documentation
bash

   git clone https://github.com/PratikCreates/neuroscroll.git

   cd neuroscroll
2. **Install dependencies**
bash

   npm install
3. **Start development**
bash

   npm run dev
4. **Load extension in Chrome**    - Go to chrome://extensions/    - Enable Developer mode    - Click "Load unpacked" and select the project folder --- ## 🔒 **Privacy & Security** ### **Data Privacy** - **Local Storage Only**: All data stored using Chrome's local storage API - **No External Servers**: Zero data transmission to external services - **No Personal Info**: Only behavioral patterns are analyzed, not content - **User Control**: Complete control over data with export/delete options ### **Permissions** - **activeTab**: To detect when you're on YouTube Shorts - **storage**: To save your metrics locally - **scripting**: To analyze page interactions --- ## 🤝 **Contributing** We welcome contributions! Here's how you can help: ### **Getting Started** 1. Fork the repository 2. Create a feature branch: git checkout -b feature/amazing-feature 3. Make your changes and add tests 4. Ensure all tests pass: npm run test 5. Commit your changes: git commit -m 'Add amazing feature' 6. Push to the branch: git push origin feature/amazing-feature 7. Open a Pull Request ### **Development Guidelines** - **Code Style**: Follow the existing TypeScript/React patterns - **Testing**: Add tests for new features - **Accessibility**: Ensure all UI is accessible - **Privacy**: Maintain privacy-first principles --- ## 📄 **License** This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. --- ## 👨‍💻 **Author** **Pratik Shah** - 🐙 **GitHub**: [@PratikCreates](https://github.com/PratikCreates) - 💼 **LinkedIn**: [PratikCreates](https://linkedin.com/in/PratikCreates) --- ## 📈 **Roadmap** - [ ] **Chrome Web Store Release** - [ ] **Firefox Extension Support** - [ ] **Advanced AI Recommendations** - [ ] **Data Visualization Improvements** - [ ] **Mobile App Companion** --- <div align="center"> **Made with 🧠 for mindful digital consumption** [⭐ Star this repo](https://github.com/PratikCreates/neuroscroll) • [🐛 Report Bug](https://github.com/PratikCreates/neuroscroll/issues) • [💡 Request Feature](https://github.com/PratikCreates/neuroscroll/issues) </div>
