package com.sahaflow.customer.repository;

import com.sahaflow.customer.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    @Query("SELECT c FROM Customer c WHERE c.tenantId = :tenantId")
    Page<Customer> findAllByTenantId(@Param("tenantId") String tenantId, Pageable pageable);

    Optional<Customer> findByTenantIdAndId(String tenantId, String id);

    @Query("SELECT c FROM Customer c WHERE c.tenantId = :tenantId AND c.active = true")
    Page<Customer> findAllActiveByTenantId(@Param("tenantId") String tenantId, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.tenantId = :tenantId AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Customer> searchByTenantId(@Param("tenantId") String tenantId,
                                     @Param("search") String search,
                                     Pageable pageable);
}
