package com.placement.agent.dto;

import com.placement.agent.model.PreparationRecord;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;

/**
 * Data Transfer Object representing the final response sent to the client.
 */
public class PreparationResponse {

    private String id;
    private String studentName;
    private String jobRole;
    private String programmingLanguage;
    private String topic;
    private String difficultyLevel;
    private Object aiResponse; // Parsed JSON object structure
    private Instant createdDate;

    // Constructors
    public PreparationResponse() {}

    public PreparationResponse(PreparationRecord record, ObjectMapper objectMapper) {
        this.id = record.getId();
        this.studentName = record.getStudentName();
        this.jobRole = record.getJobRole();
        this.programmingLanguage = record.getProgrammingLanguage();
        this.topic = record.getTopic();
        this.difficultyLevel = record.getDifficultyLevel();
        this.createdDate = record.getCreatedDate();
        
        // Parse the AI Response JSON string back to a generic Map/Object for API delivery
        try {
            if (record.getAiResponse() != null) {
                this.aiResponse = objectMapper.readValue(record.getAiResponse(), Object.class);
            }
        } catch (Exception e) {
            // Fallback to raw string in case of parse errors
            this.aiResponse = record.getAiResponse();
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getProgrammingLanguage() {
        return programmingLanguage;
    }

    public void setProgrammingLanguage(String programmingLanguage) {
        this.programmingLanguage = programmingLanguage;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Object getAiResponse() {
        return aiResponse;
    }

    public void setAiResponse(Object aiResponse) {
        this.aiResponse = aiResponse;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }
}
