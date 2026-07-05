package com.placement.agent.repository;

import com.placement.agent.model.PreparationRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB Repository interface for performing CRUD operations on PreparationRecords.
 */
@Repository
public interface PreparationRepository extends MongoRepository<PreparationRecord, String> {
    
    /**
     * Finds previous preparation plans sorted by creation date descending.
     */
    List<PreparationRecord> findAllByOrderByCreatedDateDesc();
}
