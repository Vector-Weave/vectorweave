package com.ezvector.backend.repository;

import com.ezvector.backend.model.ManagerSupabaseMapping;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManagerSupabaseMappingRepository extends CrudRepository<ManagerSupabaseMapping, Integer> {
    Optional<ManagerSupabaseMapping> findBySupabaseUserId(String supabaseUserId);
    Optional<ManagerSupabaseMapping> findByManagerId(Integer managerId);
    boolean existsBySupabaseUserId(String supabaseUserId);
}
