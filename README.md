# StadiumFlow

**AI-powered crowd intelligence and congestion-aware stadium routing for safer, faster fan movement.**

## 🚀 Project Title & Tagline
**StadiumFlow**

A smart venue operations system that combines route optimization, live crowd telemetry simulation, and Gemini-powered analysis to improve navigation inside large event spaces.

## 📖 Overview
Large venues fail when movement becomes unpredictable. Fans queue at the wrong gates, sections get congested, and facility access becomes inefficient. StadiumFlow addresses that problem by turning stadium movement into a decision system.

The project models the venue as a graph, tracks section and gate congestion, visualizes crowd pressure on an interactive heatmap, and computes low-friction routes from entry gates to seating zones. On top of that, Gemini is used to generate AI-based crowd analysis from the current telemetry snapshot.

For a real stadium, this matters because better movement decisions reduce crowd build-up, improve fan experience, and give operators a clearer view of bottlenecks before they become operational issues.

## 🎯 Features
- **Smart Routing with Dijkstra**: Computes congestion-aware paths from gates to seating sections using weighted graph traversal.
- **Gemini-Powered Analysis**: Sends the current telemetry snapshot to Google Gemini for structured crowd predictions and route guidance commentary.
- **Interactive Crowd Heatmap**: Renders stadium sections, gates, and facilities on canvas with density-based visual feedback.
- **Find My Seat Flow**: Lets a user choose an entry gate and target section, then visualizes the route directly on the stadium map.
- **Dynamic Data Refresh**: Polls updated telemetry on a timed interval so dashboard and map views reflect changing crowd conditions.
- **Responsive Dashboard UI**: Supports desktop and mobile layouts for dashboard, heatmap, food ordering, login, and navigation pages.
- **Firebase-Based Authentication**: Supports Google sign-in through Firebase Auth when environment configuration is provided.
- **Optional Firestore Persistence**: Includes a Firestore-backed save/history service with local in-memory fallback for demo mode.

## 🧠 How It Works
### 1. Venue Graph and Routing
The stadium is represented as a graph of:
- Entry gates
- Seating sections
- Connections between adjacent sections

Each edge has a base movement cost. During route calculation, the system adds congestion cost from current telemetry to produce a weighted path. The backend uses Dijkstra's algorithm to return the lowest-cost route for the selected start gate and destination section.

### 2. Crowd Telemetry
The backend generates real-time-like telemetry snapshots for:
- Gates
- Seating sections
- Restrooms
- Food courts
- Merchandise counters

These values are exposed through REST endpoints and consumed by the frontend to power:
- KPI cards
- Operational panels
- Chart.js section analytics
- Heatmap coloring
- Routing decisions

### 3. AI Prediction with Gemini
When AI analysis is triggered, the backend packages the current telemetry snapshot into a structured prompt and sends it to Google Gemini. Gemini returns:
- Predicted hotspot areas
- A route or movement suggestion
- Human-readable reasoning
- A qualitative risk level

### 4. Decision Flow
The system flow is:
1. Generate or refresh crowd telemetry.
2. Render the latest congestion state in the dashboard and map.
3. Compute route cost using graph distance plus congestion penalty.
4. Optionally run Gemini analysis on the same data snapshot.
5. Present the result as a route overlay, KPI updates, and AI recommendations.

## ☁️ Google Services Used
### Gemini API
Google Gemini is used in the backend AI service to analyze the current crowd snapshot and return structured predictions. In this project, Gemini is responsible for:
- Identifying likely high-risk crowd zones
- Suggesting safer movement strategies
- Producing reasoning that can be shown in the dashboard

Relevant implementation:
- `backend/services/aiService.js`
- `backend/controllers/crowdController.js`

### Firebase
Firebase is used in two ways when configured:
- **Firebase Auth** for Google sign-in on the frontend
- **Firestore** as an optional backend persistence layer for saved check/history data

If Firestore credentials are not available, the project falls back to local in-memory storage so the demo can still run.

Relevant implementation:
- `frontend/js/auth.js`
- `backend/services/dbService.js`
- `backend/routes/api.js`

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES modules), Tailwind CSS, Bootstrap-ready utility workflow
- **Backend**: Node.js, Express.js
- **Algorithms**: Dijkstra shortest path with congestion-adjusted weights
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Auth / Data**: Firebase Auth, Firebase Admin SDK, Firestore
- **Visualization**: HTML5 Canvas, Chart.js
- **Validation / Protection**: Zod, express-rate-limit

## ⚙️ Setup Instructions
### 1. Clone the repository
```bash
git clone https://github.com/Yashrajsinh-Kanchva/PhysicalEventExp.git
cd PhysicalEventExp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
Use the provided `.env.example` as a reference.

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000

FIREBASE_API_KEY=your_web_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Optional for backend Firestore persistence
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 4. Run the server
```bash
npm start
```

### 5. Open the app
Visit:

```text
http://localhost:3000
```

Core routes:
- `/index.html`
- `/pages/dashboard.html`
- `/pages/heatmap.html`
- `/pages/navigation.html`
- `/pages/food-order.html`
- `/pages/login.html`

## 📊 Project Structure
```text
PhysicalEventExp/
├── backend/
│   ├── controllers/
│   │   └── crowdController.js
│   ├── routes/
│   │   └── api.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── dbService.js
│   │   └── routingService.js
│   ├── tests/
│   │   └── routing.test.js
│   └── server.js
├── frontend/
│   ├── components/
│   │   ├── footer.html
│   │   └── navbar.html
│   ├── css/
│   │   ├── heatmap.css
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── food.js
│   │   ├── heatmap.js
│   │   ├── layout.js
│   │   ├── main.js
│   │   ├── menu.js
│   │   ├── navigation.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── dashboard.html
│   │   ├── food-order.html
│   │   ├── heatmap.html
│   │   ├── login.html
│   │   └── navigation.html
│   └── index.html
├── .env.example
├── package-lock.json
├── package.json
└── README.md
```

## 🧪 Testing
The project currently includes a basic routing sanity test for the pathfinding service.

Run it with:
```bash
node backend/tests/routing.test.js
```

What it checks:
- Direct gate-to-section routing
- Congestion-aware route selection behavior

This is intentionally lightweight and focused on algorithm validation rather than full integration coverage.

## ⚠️ Assumptions
- Crowd telemetry is currently simulated for demo and judging purposes.
- The routing model operates at gate-to-section granularity, not exact seat coordinates.
- Firebase Auth and Firestore features depend on environment configuration being present.
- The app is designed as a competition demo prototype, so polling is used instead of WebSockets.
- AI quality depends on Gemini API availability and valid credentials.

## 🚀 Future Improvements
- Upgrade from simulated telemetry to live sensor or event-stream inputs
- Add automatic re-routing when congestion changes materially
- Extend routing from section-level to row/seat-level navigation
- Replace polling with WebSocket or SSE-based live updates
- Add stronger automated test coverage for controllers, services, and UI flows
- Persist historical telemetry for trend analysis and model-assisted forecasting
- Add operator-side controls for crowd intervention scenarios

## 🏆 Why This Project Stands Out
- **It applies algorithms to a real operational problem**: routing is not cosmetic; it is built on graph logic and weighted pathfinding.
- **It combines deterministic systems with AI**: Dijkstra handles reliable route computation, while Gemini adds higher-level prediction and explanation.
- **It is easy to demo and easy to understand**: judges can immediately see the connection between telemetry, visualization, and routing output.
- **It has real venue relevance**: the same architecture can be extended to stadiums, airports, campuses, expos, and transit hubs.
- **It demonstrates Google ecosystem integration clearly**: Gemini for analysis, Firebase for auth/storage workflows, and a backend that orchestrates both.

## Author
**Yashrajsinh Kanchva**

## License
This project is intended for educational, prototype, and competition use.
