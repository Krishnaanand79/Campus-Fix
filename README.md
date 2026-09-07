# CampusFix — Smart Campus Maintenance & Issue Management System

> Centralized MERN platform connecting students, university administration, and maintenance staff with community upvoting, smart priority routing, and verified proof-of-work resolution.

---

## 🌟 Key Features

- **Public Campus Feed**: Real-time filterable issue stream with structured location hierarchy (Block $\rightarrow$ Floor $\rightarrow$ Room).
- **Community +1 Prioritization**: Affected campus residents can endorse existing issues with "+1 I'm facing this too", preventing duplicate tickets while elevating priority.
- **Smart Priority Scoring**: Dynamic algorithm weighing community upvotes, category hazard levels, severity multipliers, and issue age.
- **Duplicate Issue Detection**: Intelligent keyword, category, and location matching before ticket submission.
- **Worker Task Workflow**: Dedicated technician dashboard with task acknowledgment, on-site status progression, and mandatory proof-of-work photo uploads.
- **User Verification Loop**: Original reporters verify physical repairs before issues are closed, providing 1–5 star ratings and reviews, or escalating reopened tickets.
- **Warm Glassmorphism Aesthetic**: Custom-tailored dark and light mode UI with frosted glass panels, warm ambient glow, and micro-interactions.
- **1-Click Role Switcher**: Interactive switcher to test the full lifecycle across Student, Admin, and Worker personas.

---

## 🏗️ Project Architecture

```text
Campus-Fix/
├── backend/                  # Node.js, Express, MongoDB Atlas, JWT, Multer
│   ├── src/
│   │   ├── config/           # Database connection & configurations
│   │   ├── controllers/      # Auth, issues, admin, worker, rating, notification, analytics
│   │   ├── middleware/       # Auth guards, role-based RBAC, file upload, error handlers
│   │   ├── models/           # Mongoose schemas (User, Issue, Category, Rating, Notification)
│   │   ├── routes/           # RESTful API endpoints
│   │   ├── seed/             # Comprehensive database seeder with demo accounts
│   │   ├── utils/            # Priority calculator & duplicate detection engine
│   │   ├── app.js            # Express application configuration
│   │   └── server.js         # HTTP server entry point
│   ├── uploads/              # Local storage for proof & issue media
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── frontend/                 # React 18, Vite, Tailwind CSS, Lucide Icons
    ├── public/               # Static assets & brand SVG logo
    ├── src/
    │   ├── components/       # Common, Feed, Issues, Admin, Worker, Verification
    │   ├── context/          # Auth, Theme (Dark/Light), Notifications
    │   ├── layouts/          # MainLayout with ambient background mesh
    │   ├── pages/            # HomeFeed, ReportIssue, IssueDetail, Dashboards, Auth
    │   ├── services/         # Axios API client with interceptors
    │   ├── styles/           # Glassmorphism tokens and Tailwind stylesheets
    │   ├── App.jsx           # Client-side router & protected routes
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
# Copy .env.example to .env and adjust MONGODB_URI if using Atlas
npm run seed      # Pre-populates database with demo users, categories & sample issues
npm run dev       # Starts backend API on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

---

## 🔑 Pre-Configured Demo Accounts

Use the **Role Switcher** in the top navigation bar or log in with these credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student / Reporter** | `student@campusfix.edu` | `Student@123` |
| **Campus Admin** | `admin@campusfix.edu` | `Admin@123` |
| **Maintenance Worker** | `worker@campusfix.edu` | `Worker@123` |
| **Faculty / Staff** | `faculty@campusfix.edu` | `Faculty@123` |

---

## 🛡️ License
This project is open-source and available under the ISC License.
