package com.sahaflow.workorder.repository;

import com.sahaflow.workorder.domain.WorkOrder;
import com.sahaflow.workorder.domain.WorkOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, String> {

    Optional<WorkOrder> findByTenantIdAndId(String tenantId, String id);

    @Query("SELECT w FROM WorkOrder w WHERE w.tenantId = :tenantId")
    Page<WorkOrder> findAllByTenantId(@Param("tenantId") String tenantId, Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE w.tenantId = :tenantId AND w.status = :status")
    Page<WorkOrder> findAllByTenantIdAndStatus(@Param("tenantId") String tenantId,
                                                @Param("status") WorkOrderStatus status,
                                                Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE w.tenantId = :tenantId AND w.assignedUserId = :userId")
    Page<WorkOrder> findAllByTenantIdAndAssignedUserId(@Param("tenantId") String tenantId,
                                                        @Param("userId") String userId,
                                                        Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE w.tenantId = :tenantId AND w.customerId = :customerId")
    Page<WorkOrder> findAllByTenantIdAndCustomerId(@Param("tenantId") String tenantId,
                                                    @Param("customerId") String customerId,
                                                    Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE w.tenantId = :tenantId AND " +
           "(LOWER(w.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(w.customerName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<WorkOrder> searchByTenantId(@Param("tenantId") String tenantId,
                                      @Param("search") String search,
                                      Pageable pageable);

    long countByTenantIdAndStatus(String tenantId, WorkOrderStatus status);
}
