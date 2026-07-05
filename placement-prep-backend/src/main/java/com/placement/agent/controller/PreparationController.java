package com.placement.agent.controller;

import com.placement.agent.dto.PreparationRequest;
import com.placement.agent.dto.PreparationResponse;
import com.placement.agent.model.PreparationRecord;
import com.placement.agent.service.PreparationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Rest Controller defining endpoints for configuring student placement records, triggering Gemini, and reading logs.
 */
@RestController
@RequestMapping("/api/preparation")
@CrossOrigin(origins = "*") // Cross-origin capabilities for multi-host SPA architectures
public class PreparationController {

    private final PreparationService service;
    private final ObjectMapper objectMapper;

    public PreparationController(PreparationService service) {
        this.service = service;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * POST /api/preparation/generate
     * Spawns a new customized preparation session with Google Gemini AI.
     */
    @PostMapping("/generate")
    public ResponseEntity<PreparationResponse> generatePreparationPlan(@Valid @RequestBody PreparationRequest request) {
        PreparationRecord record = service.generatePlan(request);
        PreparationResponse response = new PreparationResponse(record, objectMapper);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/preparation/history
     * Retrieves all saved preparation history records.
     */
    @GetMapping("/history")
    public ResponseEntity<List<PreparationResponse>> getHistory() {
        List<PreparationResponse> responses = service.getHistory().stream()
                .map(record -> new PreparationResponse(record, objectMapper))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /api/preparation/history/{id}
     * Fetches details on a specific historical blueprint.
     */
    @GetMapping("/history/{id}")
    public ResponseEntity<PreparationResponse> getHistoryById(@PathVariable String id) {
        PreparationRecord record = service.getRecordById(id);
        PreparationResponse response = new PreparationResponse(record, objectMapper);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/preparation/history/{id}
     * Discards a specific historical entry from MongoDB database.
     */
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistoryById(@PathVariable String id) {
        service.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
