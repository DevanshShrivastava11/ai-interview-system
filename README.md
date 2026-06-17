# AI-Powered Interview Preparation & Evaluation System (AI Interview System)

The **AI Interview System** is a professional-grade full-stack web application designed to help candidates practice technical interviews. It generates realistic domain questions and analyzes responses to grade technical depth, communication skills, and compile improvement suggestions.

Powered by **Spring Boot 3**, **React.js (Vite)**, and the **Google Gemini API**.

---

## Technical Architecture

### Tech Stack
*   **Backend:** Java 21, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA (Hibernate), Maven, PDFBox, OpenPDF.
*   **Frontend:** React (Vite), Axios, Tailwind CSS v3, Recharts, Lucide Icons.
*   **Database:** MySQL 8.0.
*   **AI Service:** Google Gemini 1.5 Flash.

### Project Directory Structure
```
ai-interview-system/
├── backend/                  # Java Spring Boot backend
│   ├── src/                  # Main Java controller, entity, security, and services
│   ├── Dockerfile            # Multi-stage JDK 21 build descriptor
│   └── pom.xml               # Maven configuration
├── frontend/                 # React Vite frontend
│   ├── src/                  # Contexts, components, pages, CSS stylesheets
│   ├── index.html            # HTML index template
│   ├── tailwind.config.js    # Tailwind layout mappings
│   └── Dockerfile            # Production Node compile & Nginx serve Dockerfile
├── mysql/
│   └── schema.sql            # DDL MySQL script mapping tables and seeder credentials
├── docker-compose.yml        # Orchestration descriptor
└── postman_collection.json   # REST API import template
```

---

## Prerequisites
To run this application locally, you will need:
1.  **Java JDK 21** or later.
2.  **Node.js 20+** and NPM.
3.  **MySQL Server** (if running locally without Docker).
4.  **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/)).

---

## Setup & Local Run Instructions

### Step 1: Initialize Database
1.  Access your MySQL CLI or client.
2.  Run the contents of [schema.sql](file:///C:/Users/91772/.gemini/antigravity-ide/scratch/ai-interview-system/mysql/schema.sql) to create `ai_interview_db` and seed the default administrator user.

### Step 2: Configure & Start Backend
1.  Ensure you set the `GEMINI_API_KEY` environment variable in your terminal:
    *   **Windows (PowerShell):** `$env:GEMINI_API_KEY="your-gemini-api-key"`
    *   **Mac/Linux:** `export GEMINI_API_KEY="your-gemini-api-key"`
2.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
3.  Compile and start the server:
    ```bash
    mvn clean spring-boot:run
    ```
4.  The server will start at `http://localhost:8080`.

### Step 3: Configure & Start Frontend
1.  Navigate to the `frontend/` directory:
    ```bash
    cd ../frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Launch the Vite dev server:
    ```bash
    npm run dev
    ```
4.  The application will be active at `http://localhost:5173`.

---

## Docker Compose Deployment (Recommended)
You can launch the entire ecosystem (MySQL, Spring Boot, and React Nginx server) using Docker Compose.

1.  Make sure your Docker daemon is active.
2.  Expose the Gemini API key in your terminal session.
3.  Run:
    ```bash
    docker-compose up --build
    ```
4.  The database will initialize automatically.
5.  Access points:
    *   **Web Portal:** `http://localhost:80`
    *   **Spring Backend:** `http://localhost:8080`
    *   **MySQL Server:** `http://localhost:3306`

---

## Evaluation Testing Accounts

Seed accounts are set up automatically:
*   **Administrator Account:**
    *   **Email:** `admin@interview.com`
    *   **Password:** `Admin@123`

To test Candidate profiles:
1.  Click **Get Started** on the Landing Page.
2.  Fill in Candidate credentials to register.
3.  Access the Candidate panel to upload resume PDF and take mock technical quizzes.
