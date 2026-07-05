package com.placement.agent.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

/**
 * MongoDB Document representation for storing customized student placement preparation plans.
 */
@Document(collection = "preparation_history")
public class PreparationRecord {

    @Id
    private String id;

    @Field("student_name")
    private String studentName;

    @Field("job_role")
    private String jobRole;

    @Field("programming_language")
    private String programmingLanguage;

    @Field("topic")
    private String topic;

    @Field("difficulty_level")
    private String difficultyLevel;

    @Field("ai_response")
    private String aiResponse; // Stored as a JSON string

    @Field("created_date")
    private Instant createdDate;

    // Constructors
    public PreparationRecord() {
        this.createdDate = Instant.now();
    }

    public PreparationRecord(String studentName, String jobRole, String programmingLanguage, String topic, String difficultyLevel, String aiResponse) {
        this.studentName = studentName;
        this.jobRole = jobRole;
        this.programmingLanguage = programmingLanguage;
        this.topic = topic;
        this.difficultyLevel = difficultyLevel;
        this.aiResponse = aiResponse;
        this.createdDate = Instant.now();
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

    public String getAiResponse() {
        return aiResponse;
    }

    public void setAiResponse(String aiResponse) {
        this.aiResponse = aiResponse;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }
}
