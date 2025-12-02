# Youth Mental Health First Aid Certification

An interactive AI-powered simulation that tests your ability to identify and respond to mental health crises in adolescents. This certification program helps equip individuals with the skills to support teens facing challenges like bullying, academic pressure, and self-harm.

## 🎯 Features

- **AI-Powered Evaluation**: Uses Google Gemini AI to assess responses in real-time
- **Realistic Scenarios**: Interactive case studies covering various youth mental health situations
- **Smart Hints**: AI coach provides contextual guidance when needed
- **Instant Feedback**: Detailed explanations for each response
- **Certification**: Earn certification with a score of 90% or higher
- **Progress Tracking**: Visual progress bar and lives system

## 🚀 Live Demo

[View Live Demo](https://your-vercel-url.vercel.app)

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google Gemini AI** - Response evaluation
- **Lucide React** - Icons

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/mental-health-quiz.git
cd mental-health-quiz
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file:**
```env
VITE_API_KEY=your_gemini_api_key_here
VITE_N8N_CHAT_WEBHOOK_URL=http://localhost:5678/webhook/chat
```

4. **Start development server:**
```bash
npm run dev
```

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

## 🌐 Deployment

### Deploy to Vercel:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add the following Environment Variables in Vercel (Settings → Environment Variables)
	- `VITE_API_KEY`
	- `N8N_CHAT_WEBHOOK_URL` (points to your private n8n endpoint)
4. Deploy!

Vercel automatically serves the `/api/chat-proxy` serverless function which forwards browser requests to your private n8n URL, keeping it hidden and avoiding CORS issues.

## 📝 Project Structure

```
mindguard-app/
├── src/
│   ├── components/
│   │   ├── IntroScreen.jsx
│   │   ├── ScenarioCard.jsx
│   │   ├── FeedbackModal.jsx
│   │   ├── ResultsScreen.jsx
│   │   ├── ProgressBar.jsx
│   │   └── LoadingOverlay.jsx
│   ├── data/
│   │   └── scenarios.js
│   ├── App.jsx
│   └── main.jsx
├── .env
└── package.json
```

## 🎓 How It Works

1. **Start Assessment**: Begin with an introduction to the certification requirements
2. **Navigate Scenarios**: Read through realistic youth mental health situations
3. **Provide Responses**: Type your approach to helping the teen in crisis
4. **Get AI Feedback**: Receive instant evaluation and guidance
5. **Track Progress**: Monitor your score with the visual progress bar
6. **Earn Certification**: Achieve 90% or higher to pass

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This simulation is for educational purposes only and does not replace professional mental health training. Always encourage individuals in crisis to seek help from qualified mental health professionals.

Built with ❤️ for mental health awareness
