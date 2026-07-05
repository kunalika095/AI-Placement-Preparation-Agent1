import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json());

// Initialize file-based DB
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file, resetting:", error);
    return [];
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

// REST APIs
// 1. GET History
app.get("/api/preparation/history", (req, res) => {
  try {
    const history = readDB();
    // Return sorted by date descending, omitting the full heavy AI Response for list view if desired, 
    // but the spec is simple, so we return the list.
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve history: " + error.message });
  }
});

// 2. GET History by ID
app.get("/api/preparation/history/:id", (req, res) => {
  try {
    const { id } = req.params;
    const history = readDB();
    const item = history.find((h: any) => h.id === id);
    if (!item) {
      return res.status(404).json({ error: `Placement preparation plan with ID ${id} not found.` });
    }
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve preparation plan: " + error.message });
  }
});

// 3. DELETE History by ID
app.delete("/api/preparation/history/:id", (req, res) => {
  try {
    const { id } = req.params;
    const history = readDB();
    const index = history.findIndex((h: any) => h.id === id);
    if (index === -1) {
      return res.status(404).json({ error: `Placement preparation plan with ID ${id} not found.` });
    }
    const deletedItem = history.splice(index, 1)[0];
    writeDB(history);
    res.json({ message: "Successfully deleted plan.", id: deletedItem.id });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete preparation plan: " + error.message });
  }
});

// 4. POST Generate Preparation Plan
app.post("/api/preparation/generate", async (req, res) => {
  try {
    const { studentName, jobRole, programmingLanguage, topic, difficultyLevel } = req.body;

    // Input validation
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ error: "Student Name is required." });
    }
    if (!jobRole || !jobRole.trim()) {
      return res.status(400).json({ error: "Job Role is required." });
    }
    if (!programmingLanguage || !programmingLanguage.trim()) {
      return res.status(400).json({ error: "Programming Language is required." });
    }
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required." });
    }
    if (!difficultyLevel || !difficultyLevel.trim()) {
      return res.status(400).json({ error: "Difficulty Level is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets."
      });
    }

    // Initialize Gemini AI Client
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    // Detailed prompt construction
    const prompt = `You are an AI Placement Preparation Agent and expert placement trainer.
Generate a comprehensive, highly personalized campus placement preparation plan for a student with the following details:
- Student Name: ${studentName}
- Job Role: ${jobRole}
- Programming Language: ${programmingLanguage}
- Topic: ${topic}
- Difficulty Level: ${difficultyLevel}

Please generate exactly:
- 5 HR Interview Questions tailored to the job role (${jobRole}) with tips on how to structure the response.
- 5 Technical Interview Questions covering ${topic} using ${programmingLanguage} at ${difficultyLevel} difficulty, with solid conceptual answers.
- 3 Coding Questions covering ${topic} with a problem description, input/output formats, sample inputs/outputs, and starter boilerplate code in ${programmingLanguage}.
- 5 Aptitude Questions relevant for campus placement exams (e.g., quantitative, logical, or verbal reasoning) with multiple-choice options, correct answer, and clear, step-by-step explanations.
- A list of highly practical, actionable Placement Preparation Tips based on the ${jobRole} and ${programmingLanguage}.
- A step-by-step Learning Roadmap (divided into logical step numbers and phases) to master ${topic} in ${programmingLanguage} for a ${jobRole} interview.

Return ONLY a valid JSON object matching the requested schema. Avoid any extra explanatory text or markdown formatting outside of JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hrQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING, description: "The HR interview question" },
                  tips: { type: Type.STRING, description: "Actionable tips and structure for answering this question" }
                },
                required: ["id", "question", "tips"]
              }
            },
            technicalQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING, description: "Technical interview question on the chosen topic" },
                  sampleAnswer: { type: Type.STRING, description: "Detailed, comprehensive answer or code explanation" }
                },
                required: ["id", "question", "sampleAnswer"]
              }
            },
            codingQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "Clear, descriptive title of the coding problem" },
                  problemDescription: { type: Type.STRING, description: "The coding challenge task description" },
                  inputFormat: { type: Type.STRING, description: "Describe the input format" },
                  outputFormat: { type: Type.STRING, description: "Describe the expected output format" },
                  sampleInput: { type: Type.STRING, description: "A test input sample" },
                  sampleOutput: { type: Type.STRING, description: "The output corresponding to the sample input" },
                  starterCode: { type: Type.STRING, description: "Boilerplate code structure to start solving the problem" }
                },
                required: ["id", "title", "problemDescription", "inputFormat", "outputFormat", "sampleInput", "sampleOutput", "starterCode"]
              }
            },
            aptitudeQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING, description: "The aptitude question (e.g., probability, percentages, speed-distance, logical reasoning)" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "4 options labelled A, B, C, D"
                  },
                  correctAnswer: { type: Type.STRING, description: "The correct option (e.g., 'A' or 'B')" },
                  explanation: { type: Type.STRING, description: "Step-by-step mathematical or logical solution" }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
              }
            },
            preparationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable and placement-winning guidelines"
            },
            learningRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER, description: "The index or step number of the path" },
                  phase: { type: Type.STRING, description: "E.g., Foundation, Intermediate, Advanced, Mock Practice" },
                  topic: { type: Type.STRING, description: "The specific sub-topic or domain to focus on" },
                  description: { type: Type.STRING, description: "Details on what to study and resources/goals" }
                },
                required: ["step", "phase", "topic", "description"]
              }
            }
          },
          required: ["hrQuestions", "technicalQuestions", "codingQuestions", "aptitudeQuestions", "preparationTips", "learningRoadmap"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content generated from Gemini AI.");
    }

    const aiResponse = JSON.parse(text);

    // Save to file-based DB
    const history = readDB();
    const newRecord = {
      id: Math.random().toString(36).substring(2, 11),
      studentName,
      jobRole,
      programmingLanguage,
      topic,
      difficultyLevel,
      aiResponse,
      createdDate: new Date().toISOString()
    };
    history.push(newRecord);
    writeDB(history);

    res.json(newRecord);
  } catch (error: any) {
    console.error("Error in generate API:", error);
    res.status(500).json({ error: "AI Plan generation failed: " + error.message });
  }
});

// Serve frontend and integrate Vite in dev mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Placement Preparation Agent server running on http://localhost:${PORT}`);
  });
}

startServer();
