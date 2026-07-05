package com.placement.agent.service;

import com.placement.agent.dto.PreparationRequest;
import com.placement.agent.model.PreparationRecord;
import com.placement.agent.repository.PreparationRepository;
import com.placement.agent.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service orchestrating Gemini AI integration, prompt synthesis, schema enforcement, and Mongo persistence.
 */
@Service
public class PreparationService {

    private final PreparationRepository repository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public PreparationService(PreparationRepository repository) {
        this.repository = repository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Retrieves all saved plans from MongoDB, sorted by creation date descending.
     */
    public List<PreparationRecord> getHistory() {
        return repository.findAllByOrderByCreatedDateDesc();
    }

    /**
     * Fetches a specific plan by its ID.
     */
    public PreparationRecord getRecordById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement preparation record with ID " + id + " not found."));
    }

    /**
     * Deletes a plan from MongoDB by its ID.
     */
    public void deleteRecord(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Placement preparation record with ID " + id + " not found.");
        }
        repository.deleteById(id);
    }

    /**
     * Synthesizes and stores a new placement preparation plan utilizing Google Gemini AI.
     */
    public PreparationRecord generatePlan(PreparationRequest request) {
        // Construct standard REST request payload to Gemini API
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + geminiApiKey;

        // Formulate robust system prompt and structure
        String systemInstruction = "You are an AI Placement Preparation Agent and expert placement trainer. " +
                "You must only return valid JSON matching the exact requested schema parameters. Do not wrap in markdown or include preambles.";

        String userPrompt = String.format("""
                Generate a comprehensive, tailored campus placement preparation plan for:
                - Student Name: %s
                - Job Role: %s
                - Programming Language: %s
                - Topic: %s
                - Difficulty Level: %s

                Generate exactly:
                - 5 HR Questions with strategic Tips (schema: hrQuestions: [{id, question, tips}])
                - 5 Technical Questions with SampleAnswers (schema: technicalQuestions: [{id, question, sampleAnswer}])
                - 3 Coding Questions with description, input/output formats, sampleInput, sampleOutput, and starterCode boilerplate in %s (schema: codingQuestions: [{id, title, problemDescription, inputFormat, outputFormat, sampleInput, sampleOutput, starterCode}])
                - 5 Aptitude Questions (quantitative/logical) with labelled options, correctAnswer, and step-by-step mathematical explanation (schema: aptitudeQuestions: [{id, question, options: [A, B, C, D], correctAnswer, explanation}])
                - preparationTips: Array of practical advice strings
                - learningRoadmap: Step-by-step timeline milestones (schema: learningRoadmap: [{step, phase, topic, description}])
                """,
                request.getStudentName(), request.getJobRole(), request.getProgrammingLanguage(),
                request.getTopic(), request.getDifficultyLevel(), request.getProgrammingLanguage());

        // Construct standard Google GenAI JSON Request structure
        Map<String, Object> requestBody = new HashMap<>();
        
        // Setup Contents part
        Map<String, Object> part = new HashMap<>();
        part.put("text", userPrompt);
        
        Map<String, Object> contentNode = new HashMap<>();
        contentNode.put("parts", Collections.singletonList(part));
        requestBody.put("contents", Collections.singletonList(contentNode));

        // Setup Config Node (Schema, responseMimeType)
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        
        // Define exact output schema parameter types
        Map<String, Object> responseSchema = createResponseSchemaStructure();
        generationConfig.put("responseSchema", responseSchema);
        requestBody.put("generationConfig", generationConfig);

        // System Instruction setup
        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("text", systemInstruction);
        Map<String, Object> systemContent = new HashMap<>();
        systemContent.put("parts", Collections.singletonList(systemPart));
        requestBody.put("systemInstruction", systemContent);

        // Call remote API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        String aiResponseJson = "{}";
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Extract text from candidates[0].content.parts[0].text
                List candidates = (List) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.getFirst();
                    Map content = (Map) firstCandidate.get("content");
                    if (content != null) {
                        List parts = (List) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Map firstPart = (Map) parts.getFirst();
                            aiResponseJson = (String) firstPart.get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to call Google Gemini API: " + e.getMessage(), e);
        }

        // Save generated entity to MongoDB Atlas
        PreparationRecord record = new PreparationRecord(
                request.getStudentName(),
                request.getJobRole(),
                request.getProgrammingLanguage(),
                request.getTopic(),
                request.getDifficultyLevel(),
                aiResponseJson
        );

        return repository.save(record);
    }

    /**
     * Builds Jackson/JSON Schema representation for Gemini API JSON schemas.
     */
    private Map<String, Object> createResponseSchemaStructure() {
        Map<String, Object> schema = new HashMap<>();
        schema.put("type", "OBJECT");
        
        Map<String, Object> properties = new HashMap<>();
        
        // 1. HR Questions Array
        properties.put("hrQuestions", Map.of(
            "type", "ARRAY",
            "items", Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                    "id", Map.of("type", "INTEGER"),
                    "question", Map.of("type", "STRING"),
                    "tips", Map.of("type", "STRING")
                ),
                "required", List.of("id", "question", "tips")
            )
        ));

        // 2. Technical Questions Array
        properties.put("technicalQuestions", Map.of(
            "type", "ARRAY",
            "items", Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                    "id", Map.of("type", "INTEGER"),
                    "question", Map.of("type", "STRING"),
                    "sampleAnswer", Map.of("type", "STRING")
                ),
                "required", List.of("id", "question", "sampleAnswer")
            )
        ));

        // 3. Coding Questions Array
        properties.put("codingQuestions", Map.of(
            "type", "ARRAY",
            "items", Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                    "id", Map.of("type", "INTEGER"),
                    "title", Map.of("type", "STRING"),
                    "problemDescription", Map.of("type", "STRING"),
                    "inputFormat", Map.of("type", "STRING"),
                    "outputFormat", Map.of("type", "STRING"),
                    "sampleInput", Map.of("type", "STRING"),
                    "sampleOutput", Map.of("type", "STRING"),
                    "starterCode", Map.of("type", "STRING")
                ),
                "required", List.of("id", "title", "problemDescription", "inputFormat", "outputFormat", "sampleInput", "sampleOutput", "starterCode")
            )
        ));

        // 4. Aptitude Questions Array
        properties.put("aptitudeQuestions", Map.of(
            "type", "ARRAY",
            "items", Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                    "id", Map.of("type", "INTEGER"),
                    "question", Map.of("type", "STRING"),
                    "options", Map.of("type", "ARRAY", "items", Map.of("type", "STRING")),
                    "correctAnswer", Map.of("type", "STRING"),
                    "explanation", Map.of("type", "STRING")
                ),
                "required", List.of("id", "question", "options", "correctAnswer", "explanation")
            )
        ));

        // 5. Preparation Tips Array
        properties.put("preparationTips", Map.of(
            "type", "ARRAY",
            "items", Map.of("type", "STRING")
        ));

        // 6. Learning Roadmap Array
        properties.put("learningRoadmap", Map.of(
            "type", "ARRAY",
            "items", Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                    "step", Map.of("type", "INTEGER"),
                    "phase", Map.of("type", "STRING"),
                    "topic", Map.of("type", "STRING"),
                    "description", Map.of("type", "STRING")
                ),
                "required", List.of("step", "phase", "topic", "description")
            )
        ));

        schema.put("properties", properties);
        schema.put("required", List.of("hrQuestions", "technicalQuestions", "codingQuestions", "aptitudeQuestions", "preparationTips", "learningRoadmap"));
        return schema;
    }
}
