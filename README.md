# 🏃‍♂️ VeloRace - Community Fitness Motivation App

<div align="center">

![VeloRace Banner](https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=400&fit=crop)

**Gamify your fitness journey with location-based communities, dual currency system, and social features!**

[![React](https://img.shields.io/badge/React-19.2.4-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**VeloRace** is a comprehensive fitness tracking and community motivation platform that gamifies your running journey. Built with React, TypeScript, and Vite, it combines location-based community tiers, a dual currency system (XP & Credits), social features, and event management to keep you motivated and engaged.

Whether you're a beginner starting your fitness journey or an expert marathoner, VeloRace provides the tools, community, and motivation to help you achieve your goals!

---

## ✨ Features

### 🏘️ **Location-Based Community System**
- **12 Cities**: Chennai, Coimbatore, Bangalore, Mumbai, Delhi, Hyderabad, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow, Kochi
- **4 Skill Tiers Per Location**: Beginner, Intermediate, Advanced, Expert
- **Community-specific leaderboards** and rankings
- **Collaborative events** between different tiers

### ⚡ **Dual Currency System**

#### ⭐ **XP (Experience Points)** - Progression Currency
- **Never decreases** - permanent achievement tracker
- Determines tier advancement:
  - Beginner → Intermediate: 2,000 XP
  - Intermediate → Advanced: 7,000 XP total
  - Advanced → Expert: 17,000 XP total
- Displayed on leaderboards and progress bars
- Earned from every activity (10 XP per km + bonuses)

#### 💎 **Credits** - Spending Currency
- **Can be spent** on cravings and events
- Earned alongside XP (1:1 ratio)
- Use for guilt-free rewards without affecting progression
- Shop for cravings: Pizza (100 💎), Rest days (150 💎), Treats (50-200 💎)
- Spend at community events on food, entertainment, and activities

### 🏃 **Activity Tracking**
- **Log activities** with distance, time, and pace
- **Automatic XP & Credits calculation**:
  - Base: 10 points per km
  - Time bonus: +5 points per 10 minutes
  - Pace bonuses: Sub-5 min/km (+20%), Sub-4 (+40%), Sub-3 (+60%)
  - Streak bonus: +10 points per consecutive day
- **Activity history** with full tracking and analytics
- **Delete activities** with automatic stat recalculation
- **Calendar view** of your activities

### 🏆 **Leaderboards & Rankings**
- **Global leaderboard** - compete with all users
- **Community leaderboards** - filtered by location and tier
- **Real-time rank updates** synced across dashboard and leaderboard pages
- **Multiple filters**: Overall, Monthly, Weekly, Friends
- **Podium display** for top 3 performers

### 🎉 **Community Events**
- **Auto-triggered events** when community XP bar fills (100K-500K threshold)
- **Beautiful event cards** with hero images from Unsplash
- **Event activities** with Credits pricing:
  - Pizza Buffet (50 💎)
  - Live Music (30 💎)
  - Group Photo (10 💎)
  - Games & Activities (25 💎)
- **RSVP system** with attendee tracking
- **Past events gallery** with photos and stats
- **Collaborative events** for cross-tier community building

### 🍕 **Cravings Shop**
- **8+ guilt-free indulgences** available for purchase
- Spend Credits without affecting XP progression
- Categories: Food, Rest, Treats
- **Purchase history** tracking
- **Real-time balance** updates

### 🏅 **Badges & Achievements**
- **25+ badges** across multiple categories:
  - Distance milestones (10km, 50km, 100km)
  - Streak achievements (3-day, 7-day)
  - Pace records (Sub-25 min 5K, Speed Demon)
  - XP milestones (XP Hoarder, Community Champion)
  - Credits badges (First Payday, Big Spender)
  - Event participation (Party Animal, Community Pillar)
  - Special combo badges (Wise Spender, Balanced Runner)
- **Visual badge showcase** on profile
- **Progress tracking** for locked badges

### 👥 **Social Features**
- **Friends system** with follow/unfollow
- **Activity feed** showing updates from followed users only
- **Direct messaging** between users
- **Notifications** for messages, achievements, and events
- **User profiles** with stats, badges, and progression

### 🔔 **Smart Notifications**
- **Activity-based**: Updates from friends you follow
- **Messages**: Direct message notifications
- **Events**: Community event reminders and invitations
- **Achievements**: Tier promotions, badge unlocks
- **Notification bell** with unread count
- **Mark as read** functionality

### 📊 **Dashboard & Analytics**
- **Dual currency display**: XP and Credits side-by-side
- **Progress bars** for Personal XP and Community XP
- **Community quick stats**: Rank, contribution, next event countdown
- **Recent earnings** timeline
- **Quick actions**: Log activity, browse cravings, vote on events

### 👤 **User Profile**
- **Comprehensive statistics**:
  - Current XP: Progress toward next tier
  - Credits balance: Available to spend
  - Total earned and spent (both currencies)
  - Community rank and tier
- **Spending history** with charts and analytics
- **Tier progression timeline**
- **Badge showcase**
- **Personal records tracker**

### 🗳️ **Event Polling System**
- **Weekly polls** for weekend event planning
- **Vote once** per poll
- **Live results** after voting
- **Community-driven** event selection

### 🔐 **Authentication & Security**
- **User registration** with location and pace selection
- **Login system** with session management
- **Password protection** (simulated hashing)
- **Profile customization**

### 📱 **Responsive Design**
- **Mobile-first** approach
- **Tablet and desktop** optimized
- **Touch-friendly** interactions
- **Smooth animations** and transitions

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.4** - Modern UI library
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool
- **React Router DOM 7.13.0** - Client-side routing

### UI & Visualization
- **Lucide React 0.564.0** - Beautiful icons
- **Recharts 3.7.0** - Data visualization and charts
- **Tailwind CSS** (inline) - Utility-first styling

### Data Storage
- **LocalStorage** - Client-side persistence
- **No backend required** - Fully self-contained

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** (optional, for cloning) - [Download here](https://git-scm.com/)

### Check Your Installation

```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show v9.0.0 or higher
```

---

## 🚀 Installation

### Option 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/velorace.git

# Navigate to project directory
cd velorace

# Install dependencies
npm install
```

### Option 2: Download ZIP

1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder
4. Run: `npm install`

---

## 🏃 Running Locally

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages (~150MB total):
- React and React DOM
- React Router
- TypeScript
- Vite
- Lucide React (icons)
- Recharts (charts)

**Expected installation time**: 1-3 minutes depending on your internet speed.

### Step 2: Start the Development Server

```bash
npm run dev
```

**What happens:**
- Vite starts the development server
- The app opens at `http://localhost:5173` (or next available port)
- Hot Module Replacement (HMR) is enabled - changes reflect instantly

### Step 3: Open in Browser

The terminal will show:
```
  VITE v6.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open your browser** and navigate to `http://localhost:5173`

### Step 4: Login or Create Account

**Demo Accounts** (pre-populated for testing):
- Username: `TrailBlazer` | Password: (any password)
- Username: `PaceMaker` | Password: (any password)
- Username: `SpeedDemon` | Password: (any password)

Or **create a new account**:
1. Click "Sign Up"
2. Choose your location (e.g., Chennai)
3. Select your pace level (or "Not Sure" for Beginner)
4. Fill in other details
5. Start tracking!

---

## 📁 Project Structure

```
velorace/
├── src/
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx      # Main dashboard with XP/Credits display
│   │   ├── Activities.tsx     # Activity logging and history
│   │   ├── Leaderboards.tsx   # Rankings and competition
│   │   ├── Profile.tsx        # User profile and stats
│   │   ├── Events.tsx         # Community events with images
│   │   ├── Cravings.tsx       # Credits shop for indulgences
│   │   ├── Badges.tsx         # Achievement showcase
│   │   ├── Friends.tsx        # Social connections
│   │   ├── Login.tsx          # Authentication
│   │   ├── Signup.tsx         # User registration
│   │   └── Landing.tsx        # Landing page
│   │
│   ├── App.tsx                # Main app component with routing
│   ├── store.ts               # State management and localStorage
│   ├── types.ts               # TypeScript interfaces
│   ├── constants.tsx          # App constants (XP thresholds, locations)
│   └── index.tsx              # App entry point
│
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── .env.local                 # Environment variables
├── .gitignore                 # Git ignore rules
└── README.md                  # This file!
```

---

## 🔑 Key Concepts

### Dual Currency System

**Why two currencies?**

The dual currency system solves a common gamification problem: *"If I spend my points on rewards, I lose my progress!"*

**XP (Experience)** is permanent and shows your true achievement. **Credits** let you enjoy rewards guilt-free.

**Example:**
```
User runs 5km → Earns +63 XP + 63 Credits
User buys Pizza (100 Credits) → XP stays 63, Credits become -37
User is still progressing toward next tier! ✅
```

### Community XP vs Personal XP

- **Personal XP**: Your individual progress toward tier advancement
- **Community XP**: Collective progress of your location+tier community toward events

Both bars fill from the same activities, creating both personal and community goals!

### Tier Progression

The tiered system creates long-term engagement:

| Tier | XP Required | Real-World Effort | Achievement Level |
|------|-------------|-------------------|-------------------|
| **Beginner** | 0 - 1,999 | 0-30 runs | Getting started |
| **Intermediate** | 2,000 - 6,999 | 30-110 runs | Regular runner (1-4 months) |
| **Advanced** | 7,000 - 16,999 | 110-270 runs | Dedicated athlete (4-12 months) |
| **Expert** | 17,000+ | 270+ runs | Elite performer (12+ months) |

---

## 🧪 Testing the App

### Test User Journeys

1. **New User Onboarding**
   - Sign up with Chennai, Beginner tier
   - Log your first activity
   - See XP and Credits earned
   - Check the dashboard updates

2. **Progression**
   - Log multiple activities to accumulate XP
   - Watch progress bars fill
   - Unlock badges
   - Reach 2,000 XP for tier promotion

3. **Spending**
   - Visit Cravings shop
   - Buy a Pizza Night (100 Credits)
   - Verify Credits decrease, XP unchanged
   - Check purchase history

4. **Social**
   - Add friends
   - Send a direct message
   - Check notifications
   - View activity feed

5. **Events**
   - Check community XP progress
   - RSVP to an upcoming event
   - Participate in event activities
   - Spend Credits at the event

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm install` fails
```bash
# Solution: Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Port 5173 already in use
```bash
# Solution: Kill the process or use a different port
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or specify a different port:
npm run dev -- --port 3000
```

**Issue**: TypeScript errors in IDE
```bash
# Solution: Restart TypeScript server in VS Code
Press Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

**Issue**: Changes not reflecting in browser
```bash
# Solution: Clear browser cache and restart dev server
Ctrl+Shift+R (hard refresh)
# Or:
npm run dev
```

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Strava/Garmin integration
- [ ] GPS tracking during runs
- [ ] Voice coaching
- [ ] Training plans
- [ ] Nutrition tracking
- [ ] Workout challenges
- [ ] Team competitions
- [ ] Apple Watch / Fitbit sync

---

<div align="center">

**Made by the Team FLUX**

</div>

---
