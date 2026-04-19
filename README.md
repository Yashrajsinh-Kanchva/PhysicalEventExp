# ⚡ StadiumFlow | Intelligent Venue Operations & Crowd Analytics

**StadiumFlow** is a comprehensive, full-stack crowd management solution designed for modern sporting venues. It leverages real-time telemetry, spatial data visualization, and AI-driven insights to optimize stadium operations, ensuring a safe, efficient, and premium experience for both operators and fans.

---

## 🎯 Project Objective

The core goal of **StadiumFlow** is to bridge the gap between physical venue infrastructure and digital intelligence. The system monitors live crowd density, generates predictive spatial insights, and provides dynamic wayfinding to minimize congestion and maximize facility utilization.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Custom Glassmorphism), JavaScript (ES6+), Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Data Engine** | RESTful APIs, JSON-based Telemetry Simulation |
| **Visuals** | HTML5 Canvas API, Chart.js, FontAwesome |

---

## 🧠 Key Features

### 📊 Operational Dashboard
*   **Real-Time Metrics**: Instant visibility into critical KPIs:
    *   **🔥 Peak Congestion**: Identifies the most crowded stadium sector.
    *   **⚡ Optimized Flow**: Suggests the optimal entrance/exit paths.
    *   **🚻 Facility Status**: Tracks wait times for restrooms and food courts.
*   **Sector Density Tracking**: Interactive bar charts (Sections A–N) visualizing regional distributions.
*   **Smart AI Recommendations**: Automated strategy engine generating insights for food services, security staffing, and retail operations.
*   **Live Node Status**: Visual heartbeat monitoring for all physical sensors.

### 🗺️ Thermal Heatmap Engine
*   **Interactive Spatial Map**: A high-fidelity, centered stadium map covering all 14 sections (A-N).
*   **Dynamic Color-Coding**: Real-time density visualization:
    *   🟢 **Green (Optimal)**: Low density, fluid movement.
    *   🟡 **Yellow (Moderate)**: Increased traffic, monitoring advised.
    *   🔴 **Red (High)**: Congested node, requires operational intervention.
*   **Active Infrastructure**: Monitoring for 4 Gates (G1-G4) and 9 Service Icons (Food, Restrooms, Shops).
*   **Boundary-Aware Tooltips**: Glassmorphic, dynamically positioned tooltips displaying granular sensor data on hover.

### 🧭 Find My Seat (Pathfinding)
*   **Visual Routing**: An animated, dashed-line pathfinding engine that draws the shortest, congestion-aware route from an entry gate to a specific seat.
*   **Spatial Solve**: Uses angular coordinates to calculate optimal movement along the stadium's internal walk-track.

### 🍔 Food & Concession Management
*   **Category Filtering**: Modern interface to filter menu items by **Mains, Snacks, and Drinks**.
*   **Digital Checkout**: Integrated cart drawer with real-time total calculation in **Rupees (₹)**.
*   **UI Feedback**: Smooth animations for item selection and express-pickup confirmation.

---

## 📁 Project Structure

```text
StadiumFlow/
├── backend/                    # Node.js/Express Backend
│   ├── controllers/            # Telemetry & Logic Handlers
│   │   └── crowdController.js  # Live Data Simulation Engine
│   ├── routes/                 # API Route Definitions
│   │   └── api.js              # REST Endpoints (/api/crowd)
│   └── server.js               # Application Entry Point
├── frontend/                   # Client-Side Application
│   ├── components/             # Reusable Global Components
│   │   ├── navbar.html         # Fixed Navigation
│   │   └── footer.html         # Persistent Branding
│   ├── css/                    # Production Styling
│   │   ├── styles.css          # Design System & Tokens
│   │   └── heatmap.css         # Canvas & Tooltip Engine Styles
│   ├── js/                     # Application Modules
│   │   ├── main.js             # Global Orchestrator & Polling
│   │   ├── heatmap.js          # Canvas Rendering & Interaction
│   │   ├── dashboard.js        # Chart.js & Analytics Logic
│   │   ├── food.js             # Menu Rendering & Cart Engine
│   │   ├── navigation.js       # Pathfinding UI Logic
│   │   ├── layout.js           # Component Injection Bridge
│   │   └── utils.js            # Helper Logic & Color Schema
│   ├── pages/                  # Functional Modules
│   │   ├── dashboard.html      # Operational Intelligence Page
│   │   ├── heatmap.html        # Spatial Distribution Page
│   │   ├── food-order.html     # Concession Service Page
│   │   └── navigation.html     # Smart Pathfinding Page
│   └── index.html              # Product Landing Page
├── data/                       # Mock Data & Static Resources
├── package.json                # Dependency Management
└── README.md                   # Technical Documentation
```

---

## ⚙️ How It Works

1.  **Backend Integration**: The Node.js server serves as the technical core, where `crowdController.js` simulates live sensor data for all stadium sections, gates, and facilities.
2.  **API Consumption**: The frontend uses `main.js` to poll the `/api/crowd` endpoint every 8 seconds, ensuring a dynamic, "live" feel.
3.  **Visualization Engine**: 
    - The **Heatmap** uses the HTML5 Canvas API to render a 1000px stadium model, updating section colors based on the numerical density values returned by the API.
    - The **Dashboard** leverages Chart.js to map this data into human-readable analytics.
4.  **UI/UX Layer**: A global CSS design system ensures a consistent "Glassmorphism 2.0" aesthetic, with smooth transitions and screenshot-ready layouts.

---

## 🚀 Getting Started

### 1. Installation
Ensure you have **Node.js** installed. Clone the repository and install dependencies in the root folder:
```bash
npm install
```

### 2. Start the Engine
Launch the backend server:
```bash
npm start
```

### 3. Open in Browser
Navigate to the operational dashboard:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📸 Screenshots

## 📸 Project Showcase

- **Dashboard View**: *Operational KPIs and Density Analytics*
- **Heatmap View**: *Live Spatial Crowd Distribution*
- **Navigation View**: *Animated Gate-to-Seat Pathfinding*
- **Food Order Page**: *Category-Filtered Concession Menu*

---

## 📈 Future Roadmap

- [ ] **Live WebSockets**: Transition from polling to low-latency real-time updates.
- [ ] **Predictive AI**: Use historical telemetry to predict bottlenecks before they occur.
- [ ] **Native Mobile App**: Seat-specific push notifications and ticket scanning.
- [ ] **IoT Integration**: Direct connection with physical gate turnstiles and thermal sensors.

---

## 🧪 Evaluation Performance

| Criteria | Satisfied By |
| :--- | :--- |
| **Code Quality** | Modular ES6 architecture, clean separation between logic and rendering. |
| **Efficiency** | Batch-updates for DOM and Canvas; optimized radial gradient rendering. |
| **UI/UX** | Responsive, screenshot-ready layout with consistent glassmorphism. |
| **Integration** | Semantic REST API usage with structured JSON communication. |
| **Accessibility** | ARIA-friendly icons, logical heading hierarchy, and high-contrast text. |

---

## 👨‍💻 Author

**Yashrajsinh Kanchva**
*Full Stack Developer & UI/UX Specialist*

[LinkedIn](https://www.linkedin.com/in/yashrajsinh-kanchva-0937a0279/) | [GitHub](https://github.com/Yashrajsinh-Kanchva) 

---

## 📜 License
Educational Use - MIT License 2026.