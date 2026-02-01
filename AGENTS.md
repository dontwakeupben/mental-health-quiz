# MindGuard Youth - AI Coding Agent Guide

## Project Overview

**MindGuard Youth** is an interactive AI-powered certification platform for Youth Mental Health First Aid training. The application helps users develop skills to identify and respond to mental health crises in adolescents through realistic scenarios and AI-powered feedback.

The app features two modes:
1. **Certification Exam**: Structured scenarios with AI evaluation using Google Gemini
2. **Roleplay Simulation**: Real-time conversational practice with AI personas via n8n webhook integration

Live demo: https://mental-health-quiz-vert.vercel.app/

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 19.2.0 |
| Build Tool | Vite | 7.2.4 |
| Styling | Tailwind CSS | 4.1.17 |
| Icons | Lucide React | 0.554.0 |
| AI Evaluation | Google Gemini API | gemini-2.5-flash-preview-09-2025 |
| Roleplay Backend | n8n Webhook | - |
| Linting | ESLint | 9.39.1 |

## Project Structure

```
project-root/
├── api/
│   └── chat-proxy.js          # Vercel serverless function for n8n proxy
├── images/
│   └── logo.png               # App logo (PNG format)
├── public/
│   └── vite.svg               # Vite logo asset
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx  # Roleplay simulation UI
│   │   ├── FeedbackModal.jsx  # AI evaluation feedback modal
│   │   ├── IntroScreen.jsx    # Landing page with mode selection
│   │   ├── LoadingOverlay.jsx # Loading spinner overlay
│   │   ├── ProgressBar.jsx    # Quiz progress indicator
│   │   ├── ResultsScreen.jsx  # Certification results display
│   │   └── ScenarioCard.jsx   # Scenario question card
│   ├── data/
│   │   └── scenarios.js       # Scenario data and AI system prompt
│   ├── App.css                # Vite template styles (minimal usage)
│   ├── App.jsx                # Main app component and state management
│   ├── index.css              # Tailwind CSS import
│   └── main.jsx               # React app entry point
├── .gitignore
├── eslint.config.js           # ESLint flat config
├── index.html                 # HTML entry point
├── package.json
├── postcss.config.js          # PostCSS with Tailwind v4
├── tailwind.config.js         # Tailwind v4 configuration
├── vercel.json                # Vercel deployment config (webhook rewrites)
└── vite.config.js             # Vite dev server proxy config
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite dev server with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Required: Google Gemini API key for exam evaluation
VITE_API_KEY=your_gemini_api_key_here

# Optional: n8n webhook URL for roleplay mode (defaults to /webhook/chat)
VITE_N8N_CHAT_WEBHOOK_URL=http://localhost:5678/webhook/chat
```

**Note**: In production (Vercel), the n8n webhook URL is hardcoded in `api/chat-proxy.js` and proxied through `/webhook/*` routes.

## Architecture Details

### State Management
- Uses React hooks (`useState`, `useEffect`) for state management
- No external state library (Redux, Zustand, etc.)
- Main app state lives in `App.jsx` with props drilling to child components

### App States (`appState`)
- `intro`: Landing page with mode selection
- `quiz`: Certification exam mode
- `results`: Final score and certification status
- `roleplay`: Real-time conversation simulation

### AI Integration

**Certification Exam (Gemini)**:
- Direct API calls to Google Gemini from client-side
- Uses `gemini-2.5-flash-preview-09-2025` model
- System prompt defined in `src/data/scenarios.js`
- Returns JSON with score (0-20), feedback, and pass/fail status

**Roleplay Mode (n8n)**:
- Communicates via webhook to n8n instance
- Local development: Proxied through Vite dev server (`/webhook`)
- Production: Proxied through Vercel serverless function (`api/chat-proxy.js`)
- Returns: `reply`, `grade` (0-100), `feedback`

### Styling Conventions

- Uses **Tailwind CSS v4** with `@import "tailwindcss"` syntax
- Color palette: Indigo (primary), Slate (neutrals), Green/Amber/Red (status)
- Components use Tailwind utility classes exclusively
- No CSS-in-JS or styled-components
- Animation classes from Tailwind: `animate-in`, `fade-in`, `slide-in-*`

### Component Patterns

- Functional components with arrow functions
- Props destructuring in component parameters
- Props naming: `onEventName` for callbacks, `isState` for booleans
- Icons from `lucide-react` library

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add environment variable: `VITE_API_KEY`
3. Deploy automatically on push to main branch

The `vercel.json` configuration handles webhook proxying:
```json
{
  "rewrites": [
    {
      "source": "/webhook/:match*",
      "destination": "https://n8n-production-dbe3.up.railway.app/webhook/:match*"
    }
  ]
}
```

### Development Proxy

Vite dev server proxies `/webhook` requests to the n8n production URL for local testing:
```javascript
// vite.config.js
server: {
  proxy: {
    '/webhook': {
      target: 'https://n8n-production-dbe3.up.railway.app',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## Code Style Guidelines

### ESLint Configuration
- Uses flat config format (`eslint.config.js`)
- Extends: `@eslint/js/recommended`, `react-hooks`, `react-refresh`
- ECMAScript 2020 with JSX support
- Custom rule: `no-unused-vars` ignores variables starting with uppercase

### File Naming
- Components: PascalCase (e.g., `ScenarioCard.jsx`)
- Utilities/Data: camelCase (e.g., `scenarios.js`)
- CSS: Same name as component (e.g., `App.css` for `App.jsx`)

### Import Order
1. React imports
2. Third-party libraries (lucide-react)
3. Local components
4. Local data/assets

## Security Considerations

- **API Key Exposure**: `VITE_API_KEY` is embedded in client-side code (necessary for direct Gemini API calls). This is acceptable for demo purposes but should use a backend proxy for production applications with sensitive credentials.
- **n8n Webhook**: Production webhook URL is hardcoded in `api/chat-proxy.js` and not exposed to frontend.
- **CORS**: Serverless function handles CORS headers for webhook requests.

## Testing

**Note**: The project currently has no automated tests configured. When adding tests:
- Use Vitest (already configured with Vite)
- Test utilities: `@testing-library/react`
- Mock fetch calls for AI evaluation tests

## Common Development Tasks

### Adding a New Scenario
Edit `src/data/scenarios.js` and add to `INITIAL_SCENARIOS` array:
```javascript
{
  id: 6,
  category: "Category Name",
  context: "Context description",
  dialogue: "Teen's dialogue",
  idealResponse: "Expected response guidelines"
}
```

### Adding a New Roleplay Persona
Edit `src/components/ChatInterface.jsx` and add to `PERSONAS` array:
```javascript
{
  id: 'unique-id',
  name: 'Name',
  age: 16,
  goal: 'Learning objective',
  openingLine: "First message from teen",
  vibe: 'Character description'
}
```

### Modifying AI Evaluation Criteria
Edit `SYSTEM_PROMPT` in `src/data/scenarios.js`. Ensure the response format remains valid JSON.

## External Dependencies

- **Google AI Studio**: For Gemini API key generation
- **n8n**: Workflow automation platform for roleplay backend
- **Vercel**: Hosting platform with serverless functions support

## Troubleshooting

- **API errors**: Check `VITE_API_KEY` is set correctly
- **Webhook failures in dev**: Verify Vite dev server is running proxy config
- **Webhook failures in prod**: Check Vercel logs and n8n instance status
- **Build errors**: Ensure Node.js version supports ES modules (package.json has `"type": "module"`)
