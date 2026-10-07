\# CareerFlow



> A full-stack career management workspace that helps job seekers track applications, understand their search performance, prepare for interviews, build career habits, and keep their professional profile organized in one place.



\## Why CareerFlow?



Most job trackers stop at:



\*\*Applied → Interview → Offer → Rejected\*\*



CareerFlow goes further.



It combines application tracking with analytics, interview preparation, job-description matching, reminders, daily career missions, skill development, goals, and resume building.



The goal is to turn a scattered job search into a structured career workflow.



\## Core Features



\### Application Management



\* Create, edit, search, filter, and delete job applications

\* Track company, role, application date, status, location, job link, notes, and interview date

\* Move applications through \*\*Applied → Interview → Offer → Rejected\*\*

\* Visual pipeline/board for tracking application progress

\* Quick status updates directly from the board



\### Dashboard \& Analytics



\* Personalized dashboard with application totals and active opportunities

\* Upcoming interview view

\* Follow-up detection for applications waiting more than a week

\* Recent application activity

\* Application funnel showing movement from applications to interviews and offers

\* Interview and offer conversion percentages

\* Monthly application activity

\* Location-based application insights



\### Job Match



CareerFlow includes a rule-based job-description matching tool.



Paste a job description and CareerFlow:



\* extracts frequent relevant keywords

\* compares them with the user's profile, skills, summary, and experience

\* calculates a match percentage

\* separates matched and missing keywords

\* provides a simple recommendation such as strong, decent, or weak match



This helps users identify skill gaps before applying.



\### Interview Prep Room



Each active application can have its own preparation workspace.



It includes:



\* live interview countdown

\* preparation checklist

\* common interview practice questions

\* expandable answer tips

\* STAR story builder

\* saved interview preparation data for individual applications



The STAR builder lets users prepare structured examples using:



\*\*Situation → Task → Action → Result\*\*



\### Daily Missions \& Streaks



CareerFlow adds a habit-building layer to the job search.



Daily missions can include:



\* applying to roles

\* following up with companies

\* networking

\* spending time learning



Completed missions contribute to a daily streak, turning the job search into a consistent routine rather than occasional bursts.



\### Growth Tracker



Users can track:



\* skills they are developing

\* personal skill levels

\* practice hours

\* career goals

\* target dates

\* completed goals

\* application activity over time



This connects job applications with actual skill development.



\### Profile \& Resume Builder



Users can build and maintain a professional profile containing:



\* name and headline

\* contact information

\* location

\* professional summary

\* skills

\* work experience

\* education



The profile also calculates a simple \*\*profile strength score\*\* and provides a print-ready resume view that can be saved as PDF from the browser.



\### Interview Reminders



CareerFlow detects interviews scheduled for today or tomorrow and provides in-app reminders.



With browser notification permission enabled, it can also send an interview reminder notification.



\## Authentication \& Data Protection



CareerFlow includes a user account system with:



\* registration and login

\* password hashing using bcrypt

\* JWT-based authentication

\* authenticated application APIs

\* user-specific application ownership

\* authenticated profile/career data synchronization

\* login attempt throttling

\* input validation for email, password, application dates, statuses, and interview dates



Application records are associated with the authenticated user so different users can maintain separate application data.



\## Data Sync



CareerFlow uses a hybrid client/server data model.



Career development data such as:



\* profile

\* preparation notes

\* missions

\* skills

\* goals



is maintained locally for a responsive experience and synchronized with the backend for persistence.



Application records are stored in MongoDB through the Express API.



\## Technology Stack



\### Frontend



\* React 19

\* Vite

\* JavaScript

\* CSS

\* Responsive UI

\* Browser APIs for notifications and printing



\### Backend



\* Node.js

\* Express.js

\* MongoDB

\* Mongoose

\* JWT

\* bcryptjs

\* CORS



\### Database



\* MongoDB



\## Application Architecture



```text

&#x20;                  CareerFlow

&#x20;                      │

&#x20;           ┌──────────┴──────────┐

&#x20;           │                     │

&#x20;      React Frontend         Express API

&#x20;           │                     │

&#x20;           │               JWT Authentication

&#x20;           │                     │

&#x20;           │                 Mongoose

&#x20;           │                     │

&#x20;           └────────────── MongoDB

```



The frontend communicates with the Express REST API for authenticated application management and synchronized user data.



\## Main Workspace



CareerFlow is organized into focused sections:



```text

Home

Dashboard

Applications

Board

Insights

────────────────

Funnel

Match

Prep Room

Missions

Growth

Profile \& Resume

```



Each section solves a different part of the job-search workflow instead of putting everything into one dashboard.



\## API



\### Authentication



```text

POST /auth/register

POST /auth/login

GET  /auth/me

GET  /auth/data

PUT  /auth/data

```



\### Applications



```text

GET    /applications

POST   /applications

PUT    /applications/:id

DELETE /applications/:id

```



\## Project Structure



```text

CareerFlow/

│

├── backend/

│   ├── package.json

│   ├── package-lock.json

│   └── server.js

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

│   │   ├── components.jsx

│   │   ├── Drawer.jsx

│   │   ├── Reminders.jsx

│   │   ├── api.js

│   │   ├── storage.js

│   │   └── ...

│   │

│   └── package.json

│

├── .gitignore

└── README.md

```



\## Getting Started



\### Prerequisites



\* Node.js

\* npm

\* MongoDB



\### Clone



```bash

git clone https://github.com/Harshh2904/CareerFlow.git

cd CareerFlow

```



\### Start MongoDB



Make sure your local MongoDB server is running.



\### Start the backend



```bash

cd backend

npm install

node server.js

```



Backend:



```text

http://localhost:5000

```



\### Start the frontend



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



\## What Makes CareerFlow Different?



CareerFlow is designed as a \*\*career operating workspace\*\*, rather than only an application database.



Its workflow connects:



```text

Find opportunity

&#x20;     ↓

Track application

&#x20;     ↓

Monitor pipeline

&#x20;     ↓

Analyze conversion

&#x20;     ↓

Match skills with job requirements

&#x20;     ↓

Prepare for interview

&#x20;     ↓

Build STAR stories

&#x20;     ↓

Improve skills

&#x20;     ↓

Set career goals

&#x20;     ↓

Repeat with better strategy

```



The key idea is to connect \*\*application tracking + preparation + learning + progress measurement\*\* inside one product.



\## Current Status



CareerFlow is currently an active full-stack development project.



The application is configured for local development with:



\* a local Express backend

\* a local MongoDB database

\* a Vite development frontend



Production deployment configuration is planned separately.



\## Future Roadmap



Planned improvements include:



\* cloud deployment

\* production environment configuration

\* MongoDB Atlas integration

\* stronger job-description analysis

\* personalized application recommendations

\* richer analytics

\* calendar integration

\* email follow-up reminders

\* resume versions linked to individual applications

\* application outcome learning and strategy insights



\## Author



\*\*Harini\*\*



Computer Science Engineering Student

Aspiring Full-Stack Developer



GitHub: https://github.com/Harshh2904



\## License



This project is currently intended as a personal portfolio and development project.



