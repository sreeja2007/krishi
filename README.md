# 🌾 KrishiAI — AI-Based Farmer Query Support & Advisory System

A production-quality MERN stack application providing AI-powered agricultural advisory for Indian farmers.

## ✨ Features

- **AI Chat** — GPT-4o-mini powered crop advisory with streaming responses
- **Crop Manager** — Track crops with growth stage progress bars
- **Soil Analysis** — Radar chart visualization + AI recommendations
- **Market Prices** — Live mandi rates with sparkline trends
- **Weather** — 7-day forecast + AI irrigation advice
- **Smart Alerts** — Auto-generated alerts from AI responses

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4o-mini |
| Weather | OpenWeatherMap API |
| Auth | JWT + bcryptjs |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key
- OpenWeatherMap API key

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

```bash
# In server/
cp .env.example .env
# Fill in your API keys
```

```env
MONGO_URI=mongodb://localhost:27017/krishiai
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-...
OPENWEATHER_API_KEY=your_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Seed Demo Data

```bash
cd server
npm run seed
```

This creates 5 demo farmers, 20 crops, market prices, and alerts.

**Demo credentials:** Phone: `9876543210` | Password: `demo1234`

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
krishiai/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth, rate limiting, errors
│   ├── services/        # AI, weather services
│   ├── config/          # DB, OpenAI config
│   ├── app.js           # Express app
│   └── seedData.js      # Demo data seeder
└── client/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Route pages
        ├── context/     # React context
        ├── services/    # API client
        └── utils/       # Helpers
```

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new farmer |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile |

### AI Queries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queries` | List conversations |
| POST | `/api/queries` | New conversation |
| POST | `/api/queries/:id/message` | Send message (SSE stream) |

### Crops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crops` | List crops |
| POST | `/api/crops` | Add crop |
| PUT | `/api/crops/:id` | Update crop |
| PATCH | `/api/crops/:id/stage` | Update growth stage |

### Soil
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/soil` | Submit soil test + get AI reco |
| GET | `/api/soil` | List reports |

### Market
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/latest` | Latest prices per crop |

### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?location=Pune` | Current + 7-day forecast |
| GET | `/api/weather/irrigation-advice` | AI irrigation advice |

## 🎨 UI Screenshots Description

1. **Login** — Split-screen with animated farmer SVG illustration and clean auth form
2. **Dashboard** — Stats grid, active crops list, alert feed, quick action buttons
3. **AI Chat** — ChatGPT-style interface with conversation history sidebar, streaming responses, suggested follow-ups
4. **Crops** — Card grid with animated growth stage progress bars and hover actions
5. **Soil Analysis** — Input form + hexagonal radar chart + AI recommendation card
6. **Market Prices** — Sortable table with sparkline trend charts per crop
7. **Weather** — Current conditions card + 7-day forecast + AI irrigation panel

## 🔐 Security

- JWT tokens with 7-day expiry
- bcrypt password hashing (10 rounds)
- Rate limiting: 100 req/15min general, 20 req/min for AI
- CORS restricted to client URL
- Input validation on all endpoints

## 📄 License

MIT
