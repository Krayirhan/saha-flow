package com.sahaflow.tenant.repository;

import com.sahaflow.tenant.domain.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, String> {

    Optional<Tenant> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Optional<Tenant> findByIdAndActiveTrue(String id);
}
