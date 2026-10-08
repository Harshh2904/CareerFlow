# CareerFlow

> A full-stack career management workspace that helps job seekers organize applications, prepare for interviews, analyze their job search, track career growth, and maintain a professional profile in one place.

## Overview

CareerFlow is a full-stack web application designed to make the job-search process more organized and measurable.

Instead of using separate spreadsheets, notes, reminders, interview-preparation tools, and resume files, CareerFlow brings these activities together into one workspace.

The platform allows users to manage applications, monitor progress, analyze their application pipeline, compare job descriptions with their skills, prepare for interviews, build career habits, track goals, and maintain a professional profile.

## Screenshots

### Home

![CareerFlow Home](https://raw.githubusercontent.com/Harshh2904/CareerFlow/main/screenshots/careerflow-home.png)

### Dashboard

![CareerFlow Dashboard](https://raw.githubusercontent.com/Harshh2904/CareerFlow/main/screenshots/careerflow-dashboard.png)

### Job Match

![CareerFlow Job Match](https://raw.githubusercontent.com/Harshh2904/CareerFlow/main/screenshots/careerflow-job-match.png)

### Interview Prep

![CareerFlow Interview Prep](https://raw.githubusercontent.com/Harshh2904/CareerFlow/main/screenshots/careerflow-interview-prep.png)

### Insights

![CareerFlow Insights](https://raw.githubusercontent.com/Harshh2904/CareerFlow/main/screenshots/careerflow-insights.png)

### Profile

![CareerFlow Profile](https://raw.githubusercontent.com/Harshh2904/CareerFlow/main/screenshots/careerflow-profile.png)

## Key Features

### 1. Application Management

CareerFlow provides a complete application tracking system.

Users can:

* Add new job applications
* Edit existing applications
* Delete applications
* Search applications
* Filter applications by status
* Track company and role
* Record application dates
* Store locations
* Save job posting links
* Add interview dates
* Add personal notes

Application stages include:

**Applied → Interview → Offer → Rejected**

### 2. Dashboard

The dashboard provides a quick overview of the user's job search.

It includes:

* Total applications
* Active applications
* Interview count
* Offer count
* Recent application activity
* Upcoming interviews
* Follow-up opportunities
* Search progress

This allows users to understand their current application pipeline without opening every application individually.

### 3. Application Board

CareerFlow provides a board-style view of applications grouped by their current stage.

Users can quickly understand how opportunities are moving through:

```text
Applied
   ↓
Interview
   ↓
Offer
```

with rejected applications tracked separately.

### 4. Insights & Analytics

CareerFlow converts application data into useful career-search insights.

The analytics section provides:

* Application activity
* Interview conversion
* Offer conversion
* Application funnel
* Monthly activity
* Location-based application information
* Application performance indicators
* Follow-up opportunities

This helps users understand their job-search activity instead of only storing application records.

### 5. Job Match

CareerFlow includes a **rule-based job-description matching system**.

Users can paste a job description and compare it with their profile and skills.

The system:

* Extracts important keywords
* Compares keywords with the user's profile
* Calculates a match percentage
* Identifies matched skills
* Identifies missing keywords
* Provides a match-strength recommendation

This helps users understand how closely their existing profile matches a particular opportunity before applying.

> Job Match currently uses a local keyword-based matching approach rather than an external AI/LLM service.

### 6. Interview Preparation

CareerFlow includes an application-specific interview preparation workspace.

Users can access:

* Interview countdown
* Preparation checklist
* Common interview questions
* Interview answer guidance
* STAR story builder
* Application-specific preparation notes

The STAR builder helps users structure interview responses using:

```text
Situation
   ↓
Task
   ↓
Action
   ↓
Result
```

### 7. Interview Reminders

CareerFlow monitors scheduled interview dates and highlights upcoming interviews.

The system can identify:

* Interviews scheduled for today
* Interviews scheduled for tomorrow
* Upcoming interview preparation needs

Browser notification support is also included for reminder alerts when permission is enabled.

### 8. Daily Missions & Streaks

CareerFlow adds a habit-building layer to the job search.

Daily missions can encourage activities such as:

* Applying to jobs
* Following up with recruiters
* Networking
* Learning new skills
* Preparing for interviews

Completed missions contribute toward a streak, helping users maintain consistency during their job search.

### 9. Growth Tracker

CareerFlow allows users to monitor professional development alongside job applications.

Users can track:

* Skills
* Skill levels
* Practice hours
* Career goals
* Target dates
* Completed goals
* Growth progress

This connects **job applications with continuous skill development**.

### 10. Profile & Resume Builder

Users can maintain a professional profile containing:

* Name
* Professional headline
* Contact details
* Location
* Professional summary
* Skills
* Education
* Work experience

CareerFlow also calculates a profile-strength indicator and provides a print-ready resume interface that can be saved as PDF through the browser.

## Authentication

CareerFlow includes user authentication using:

* Registration
* Login
* Password hashing with bcrypt
* JWT-based authentication
* Protected application endpoints
* User-specific application ownership
* Authenticated data synchronization

This allows each user to maintain their own career information and job applications.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Responsive UI
* Browser Notifications API
* Browser Print / PDF functionality

### Backend

* Node.js
* Express.js
* JavaScript
* JWT
* bcryptjs
* Mongoose
* CORS
* dotenv

### Database

* MongoDB

## Architecture

```text
                 CareerFlow
                     │
                     ▼
             React Frontend
                     │
              HTTP / REST API
                     │
                     ▼
             Express Backend
                     │
        ┌────────────┴────────────┐
        │                         │
 JWT Authentication          Mongoose ODM
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
                 MongoDB
```

## Application Workflow

```text
                    CareerFlow

                       Home
                        │
                        ▼
                      Login
                        │
                        ▼
                    Dashboard
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 Applications        Job Match       Interview Prep
        │               │                │
        ▼               ▼                ▼
 Application        Skill Match      Preparation
 Pipeline             Score             Tools
        │
        ▼
 Insights & Funnel
        │
        ▼
 Missions & Growth
        │
        ▼
 Profile & Resume
```

## Main Modules

```text
Home
Dashboard
Applications
Board
Insights
Funnel
Job Match
Interview Prep
Missions
Growth
Profile & Resume
```

Each module addresses a different stage of the career-search workflow.

## API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
GET  /auth/data
PUT  /auth/data
```

### Applications

```text
GET    /applications
POST   /applications
PUT    /applications/:id
DELETE /applications/:id
```

## Project Structure

```text
CareerFlow/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Applications.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Board.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Funnel.jsx
│   │   │   ├── Growth.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── Match.jsx
│   │   │   ├── Missions.jsx
│   │   │   ├── Prep.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── components.jsx
│   │   ├── Drawer.jsx
│   │   ├── Reminders.jsx
│   │   ├── api.js
│   │   ├── storage.js
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│   ├── careerflow-home.png
│   ├── careerflow-dashboard.png
│   ├── careerflow-job-match.png
│   ├── careerflow-interview-prep.png
│   ├── careerflow-insights.png
│   └── careerflow-profile.png
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running CareerFlow:

* Node.js
* npm
* MongoDB

### Clone the Repository

```bash
git clone https://github.com/Harshh2904/CareerFlow.git
cd CareerFlow
```

### Start MongoDB

Make sure your MongoDB server is running.

### Start the Backend

```bash
cd backend
npm install
npm start
```

Backend:

```text
http://localhost:5000
```

For development with automatic restart:

```bash
npm run dev
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## What Makes CareerFlow Different?

CareerFlow is designed as more than a basic CRUD-based job tracker.

The main concept is to connect multiple parts of the career-search lifecycle inside one workspace:

```text
Find opportunities
        ↓
Track applications
        ↓
Monitor application pipeline
        ↓
Analyze job-search performance
        ↓
Compare skills with job requirements
        ↓
Prepare for interviews
        ↓
Build STAR stories
        ↓
Develop skills
        ↓
Maintain career goals
        ↓
Manage professional profile
        ↓
Build resume
```

The project combines:

**Application Tracking + Analytics + Job Matching + Interview Preparation + Career Growth**

into a single platform.

## Project Innovation

The key innovations implemented in CareerFlow include:

### Integrated Career Workflow

Instead of focusing only on application storage, CareerFlow connects tracking, preparation, analytics, learning, and professional profile management.

### Rule-Based Job Matching

The Job Match module provides a practical way to compare job requirements with existing user skills and highlight missing keywords.

### Application-Specific Interview Preparation

Interview preparation is connected directly with individual applications, allowing users to prepare differently for different companies and roles.

### Gamified Career Development

Daily missions and streaks encourage users to build consistent job-search and learning habits.

### Career Growth Tracking

Skills, practice hours, goals, applications, and career progress are managed within the same workspace.

## Current Project Status

CareerFlow is currently developed as a full-stack academic and portfolio project.

The project is configured for local development using:

* React + Vite frontend
* Node.js + Express backend
* MongoDB database

The application is currently intended to be run locally for development, demonstration, academic evaluation, and placement interviews.

## Future Scope

Possible future improvements include:

* Cloud deployment
* MongoDB Atlas integration
* Advanced job-description analysis
* Personalized job recommendations
* Email reminders
* Calendar integration
* Resume versions linked to applications
* More advanced career analytics
* Learning recommendations based on skill gaps
* Application outcome analysis

## Learning Outcomes

This project provided practical experience with:

* React development
* Component-based frontend architecture
* REST API development
* Express.js backend development
* MongoDB database integration
* Mongoose ODM
* JWT authentication
* Password hashing
* API integration
* Form handling
* State management
* Data validation
* Responsive UI design
* Git and GitHub workflow

## Author

**Harini**

Computer Science Engineering Student
Aspiring Full-Stack Developer

GitHub: https://github.com/Harshh2904

## License

This project is currently intended as a personal academic and portfolio project.
