\# CareerFlow



> A modern full-stack job application tracker designed to help candidates organize, monitor, and manage their job search from one workspace.



\## Overview



CareerFlow helps users keep track of their job applications without relying on spreadsheets or scattered notes.



Users can record application details, monitor application status, save job posting links, add interview dates, store notes, search applications, and update or remove existing records.



\## Features



\* Add and manage job applications

\* Track application status

\* Store company, role, location, and application date

\* Save job posting links

\* Record interview dates

\* Add personal notes for each application

\* Search applications by company, role, or location

\* Filter applications by status

\* Edit existing applications

\* Delete applications

\* Dashboard with application statistics

\* Responsive interface for desktop, tablet, and mobile

\* Light and dark mode

\* Persistent application data using MongoDB



\## Tech Stack



\### Frontend



\* React

\* Vite

\* JavaScript

\* CSS



\### Backend



\* Node.js

\* Express.js

\* MongoDB

\* Mongoose

\* CORS



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

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── main.jsx

│   │   └── ...

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

└── README.md

```



\## How It Works



```text

User

&#x20; ↓

React Frontend

&#x20; ↓

Express REST API

&#x20; ↓

Mongoose

&#x20; ↓

MongoDB

```



The frontend communicates with the Express backend through REST API endpoints, while MongoDB stores application data persistently.



\## Getting Started



\### 1. Clone the repository



```bash

git clone https://github.com/Harshh2904/CareerFlow.git

cd CareerFlow

```



\### 2. Start the backend



```bash

cd backend

npm install

node server.js

```



The backend runs on:



```text

http://localhost:5000

```



\### 3. Start the frontend



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



The frontend runs on:



```text

http://localhost:5173

```



\### 4. MongoDB



The backend expects a local MongoDB server using:



```text

mongodb://127.0.0.1:27017/jobTracker

```



Make sure MongoDB is running before starting the backend.



\## API Endpoints



| Method | Endpoint            | Purpose               |

| ------ | ------------------- | --------------------- |

| GET    | `/applications`     | Fetch applications    |

| POST   | `/applications`     | Add an application    |

| PUT    | `/applications/:id` | Update an application |

| DELETE | `/applications/:id` | Delete an application |



\## Future Improvements



\* Authentication and user accounts

\* Resume version tracking

\* Job-description skill matching

\* Application readiness scoring

\* Interview preparation tools

\* Email reminders

\* Analytics and application insights

\* Cloud deployment



\## Author



\*\*Harini\*\*



Computer Science Engineering Student

Aspiring Full-Stack Developer



GitHub: \[@Harshh2904](https://github.com/Harshh2904)



\---



Built as a full-stack project to make job searching more organized, measurable, and manageable.



