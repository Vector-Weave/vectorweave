package com.ezvector.backend.repository;

import com.ezvector.backend.model.CustomerSupabaseMapping;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerSupabaseMappingRepository extends CrudRepository<CustomerSupabaseMapping, Integer> {
    Optional<CustomerSupabaseMapping> findBySupabaseUserId(String supabaseUserId);
    Optional<CustomerSupabaseMapping> findByCustomerId(Integer customerId);
    boolean existsBySupabaseUserId(String supabaseUserId);
}
