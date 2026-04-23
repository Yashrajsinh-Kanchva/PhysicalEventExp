# StadiumFlow

**AI-powered crowd-aware navigation system for managing congestion in large venues.**

## Overview
Crowd congestion is a serious problem in stadiums and other large venues. Poor routing leads to bottlenecks at gates, slower movement, and a worse fan experience.

StadiumFlow addresses this with two core ideas:
- congestion-aware route planning using a graph-based routing model
- AI-assisted crowd analysis using Google Gemini

The system combines simulated crowd telemetry, route calculation, visual monitoring, and authentication into a single web application designed for a demo and hackathon setting.

## Live Demo
- https://stadiumflow.onrender.com

## Features
- **Smart route planning** using Dijkstra's algorithm with congestion-adjusted weights
- **AI-based crowd prediction** through Google Gemini API
- **Heatmap visualization** for sections, gates, and facilities
- **Find My Seat navigation** with route drawing on the stadium map
- **Dynamic routing data updates** through periodic telemetry refresh
- **Firebase Google Authentication** with guest mode fallback
- **Responsive UI** across dashboard, heatmap, navigation, login, and food-order pages

## How It Works
### Graph-based routing
- The venue is modeled as a graph of gates and seating sections.
- Each edge has a base distance cost.
- Current congestion is added as an extra weight during route calculation.
- The backend returns the lowest-cost path for a selected gate and section.

### API-driven crowd data
- The backend generates simulated crowd telemetry for:
  - gates
  - sections
  - restrooms
  - food courts
  - merchandise counters
- This data is served through API endpoints and consumed by the frontend for dashboards, maps, and route decisions.

### AI integration
- The current telemetry snapshot is sent to Gemini when AI analysis is requested.
- Gemini returns structured output for hotspot prediction, route guidance, and reasoning.

## Tech Stack
- **Frontend**
  - HTML
  - CSS
  - JavaScript
  - Tailwind CSS
  - Bootstrap
- **Backend**
  - Node.js
  - Express.js
- **Authentication**
  - Firebase Authentication
- **AI**
  - Google Gemini API
- **Visualization**
  - HTML5 Canvas
  - Chart.js
- **Validation / API utilities**
  - Zod
  - Axios
  - express-rate-limit

---

## 📸 Screenshots  
<img width="1920" height="911" alt="homeGDG" src="https://github.com/user-attachments/assets/82cb7905-a002-4c84-b3d9-6d2f21023dae" />

<img width="1920" height="900" alt="dashboardGDG" src="https://github.com/user-attachments/assets/70bf7641-ef43-4adc-a91f-e80b1769f849" />

<img width="1920" height="901" alt="dash2GDG" src="https://github.com/user-attachments/assets/4291b1d5-2c01-4a7b-adae-6f095f06070d" />

<img width="1920" height="899" alt="findSeatGDG" src="https://github.com/user-attachments/assets/0ba44ef6-70ff-4eb2-8efe-ce8860109679" />


## Setup Instructions
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
```env
GEMINI_API_KEY=your_key
PORT=3000

FIREBASE_API_KEY=your_web_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

Optional for backend Firestore persistence:
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 4. Run the server
Actual backend entry file:

```bash
node backend/server.js
```

You can also use:

```bash
npm start
```

### 5. Open the app
```text
http://localhost:3000
```

## Project Structure
```text
PhysicalEventExp/
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── css/
│   ├── js/
│   ├── pages/
│   └── index.html
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   └── server.js
├── tests/
│   └── basic.test.js
├── package.json
└── README.md
```

Important app files:
- `frontend/pages/` contains the main UI pages
- `frontend/js/` contains client-side logic
- `backend/server.js` starts the Express server
- `backend/routes/api.js` defines API routes
- `backend/services/routingService.js` contains Dijkstra-based routing

## Testing
- Basic API testing is implemented using a lightweight Node.js script:
  - `tests/basic.test.js`
- Current automated checks include:
  - server startup
  - `/api/crowd-data`
  - `/api/route`
  - invalid and empty route input handling
- Endpoint validation has been added for route queries and request bodies.

Run tests with:
```bash
npm test
```

## Assumptions
- Crowd data is simulated rather than connected to live sensors.
- The project is designed for a demo and hackathon environment.
- Routing currently works at gate-to-section level, not exact seat coordinates.
- Firebase and Gemini features depend on valid environment configuration.

## Why This Project Stands Out
- **Real-world problem solving**: addresses crowd flow and navigation inside large venues
- **AI integration**: uses Gemini to add predictive insight on top of deterministic routing
- **Scalable idea**: the same approach can extend to stadiums, airports, campuses, and event spaces
- **Clear product experience**: combines routing, monitoring, authentication, and visualization in one interface
- **Clean UI and UX**: responsive multi-page frontend designed for demo clarity

## Author
**Yashrajsinh Kanchva**
