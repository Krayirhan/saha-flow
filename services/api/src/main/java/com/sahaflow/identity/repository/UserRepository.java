package com.sahaflow.identity.repository;

import com.sahaflow.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByTenantIdAndEmailIgnoreCase(String tenantId, String email);

    Optional<User> findByTenantIdAndId(String tenantId, String id);

    boolean existsByTenantIdAndEmailIgnoreCase(String tenantId, String email);

    long countByTenantId(String tenantId);
}
