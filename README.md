# AI Placement Preparation Agent 🎓🤖

An intelligent full-stack web application designed to help students master campus placements. Leveraging the power of Google Gemini AI, the application compiles highly personalized preparation plans featuring HR interview advice, core technical Q&A, custom coding challenges, vertical learning roadmaps, and logical/verbal/quantitative aptitude quizzes.

### 🔗 Public Application Link
The clean, production-ready public entry point is configured at:
* **Production Link**: `https://ai-placement-preparation-agent-`
*(Note: Active developer sandbox preview runs internally inside the AI Studio container environment).*

The system is delivered with two complete full-stack implementations:
1. **Developer Sandbox Stack (Active Preview):** Built using React, Node.js, Express, and @google/genai. This runs directly in the current workspace container.
2. **Production Enterprise Stack:** Built using Spring Boot 3.5 (Java 21, Maven), MongoDB Atlas, and Docker, located inside the `/placement-prep-backend` folder.

---

## 🚀 Key Features

* **Custom AI Generation**: Enter the student's name, target job role, programming language of choice, focus topic, and difficulty to generate a tailor-made prep blueprint.
* **HR Behavioral Round Simulator**: Receive 5 custom behavioral questions matching your job role, complete with model strategy guidelines.
* **Domain Technical Q&A**: 5 rigorous conceptual questions with detailed descriptive answers.
* **Coding Lab & Starter Code**: 3 customizable coding challenges with problem descriptions, input/output structures, test parameters, and copyable programming boilerplates.
* **Interactive Aptitude Quizzes**: 5 quantitative or logical multiple-choice questions with clickable selections and step-by-step mathematical explanations.
* **Actionable Prep Tips**: Custom professional guidance and strategies.
* **Milestone Learning Roadmap**: Chronological step-by-step vertical roadmap divided into logical phases (e.g., Foundation, Intermediate, Advanced).
* **Archival Log (History)**: Full history screen to search, view, inspect, or delete previous plans.

---

## 🛠️ Twin Tech Specifications

### 1. Developer Workspace Stack (Active Preview)
* **Frontend**: React 19, Vite, Tailwind CSS (v4), Motion, Lucide Icons
* **Backend**: Express, Node.js, ESBuild (bundles backend to production-ready CJS)
* **API Client**: `@google/genai` (utilizing `gemini-3.5-flash`)
* **Durable Storage**: Durable server-side file JSON database (`db.json`)

### 2. Enterprise Deployable Stack (Spring Boot)
* **Backend Core**: Spring Boot 3.5.0, Java 21, Maven
* **Database**: Spring Data MongoDB (MongoDB Atlas cloud integration)
* **Validation**: Jakarta Validation API (`@NotBlank`, `@Valid`)
* **Containerization**: Multi-stage Dockerfile using Eclipse Temurin JDK 21

---

## 📦 How to Run the Active Preview (React + Node.js)

The active sandbox is fully automated inside your workspace.

### Prerequisites
* Ensure your **GEMINI_API_KEY** is configured in **Settings > Secrets** in the AI Studio UI.

### Dev Commands
To install workspace packages and launch:
```bash
# Clean & install dependencies
npm install

# Run the full-stack server
npm run dev
```
The application runs on Port `3000` (which is externally proxy-exposed by the container infrastructure).

---

## ☕ How to Run the Production Stack (Spring Boot + MongoDB)

The complete Java backend is located in the `/placement-prep-backend` directory.

### 1. Configure properties
Open `/placement-prep-backend/src/main/resources/application.properties` and replace:
* `spring.data.mongodb.uri`: Update with your actual MongoDB Atlas cluster connection URI.
* `gemini.api.key`: Provide your Google Gemini API Key.

### 2. Local Execution (Maven)
Navigate to the directory and boot the service:
```bash
cd placement-prep-backend
./mvnw spring-boot:run
```
The REST API will be available on `http://localhost:8080`.

### 3. Docker Container Deploy
Build and run via Docker:
```bash
cd placement-prep-backend
docker build -t placement-prep-agent .
docker run -p 8080:8080 -e GEMINI_API_KEY="your-key" placement-prep-agent
```

---

## 📡 REST API Specifications

The Express and Spring Boot backends expose the identical REST endpoints:

| Method | Endpoint | Description | Payload |
|:---|:---|:---|:---|
| `POST` | `/api/preparation/generate` | Generates a new placement prep plan | JSON (studentName, jobRole, programmingLanguage, topic, difficultyLevel) |
| `GET` | `/api/preparation/history` | Retrieves all saved plans | None |
| `GET` | `/api/preparation/history/{id}` | Fetches a specific plan by its ID | None |
| `DELETE` | `/api/preparation/history/{id}` | Discards a specific plan by its ID | None |

---

## 🛡️ Input Validation & Non-Functional Qualities

* **Strict Input Filter**: Client and server-side validation rejects empty student names, job roles, languages, topics, or invalid request structures.
* **Error Tolerant**: Graceful catch-and-notify banners handle missing API keys, network outages, or parse errors.
* **Fluid UI Design**: Designed with a spacious Inter typography paired with monospace JetBrains coding frames, high contrast buttons, and subtle hover animations.
