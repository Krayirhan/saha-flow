package com.sahaflow.workorder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahaflow.AbstractIntegrationTest;
import com.sahaflow.customer.domain.Customer;
import com.sahaflow.customer.repository.CustomerRepository;
import com.sahaflow.workorder.domain.WorkOrder;
import com.sahaflow.workorder.domain.WorkOrderStatus;
import com.sahaflow.workorder.dto.WorkOrderCreateRequest;
import com.sahaflow.workorder.repository.WorkOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
class WorkOrderControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private static final String TENANT = "tenant-default";
    private static final String ADMIN_USER = "user-admin-001";

    @BeforeEach
    void setUp() {
        var customer = new Customer();
        customer.setId("cust-int-001");
        customer.setTenantId(TENANT);
        customer.setName("Integration Test Customer");
        customer.setActive(true);
        customerRepository.save(customer);
    }

    private String createWorkOrder() throws Exception {
        var req = new WorkOrderCreateRequest(
            "Integration Test WO", "Test description", "cust-int-001",
            "Test Customer", "Test address 123", "HIGH", null,
            41.0082, 28.9784, 60, null, null
        );
        var json = mockMvc.perform(post("/api/work-orders")
                .header("X-Tenant-Id", TENANT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("OPEN"))
            .andReturn().getResponse().getContentAsString();

        return (String) objectMapper.readValue(json, java.util.Map.class).get("id");
    }

    @Test
    @DisplayName("Full work order lifecycle via API: OPEN → ASSIGNED → IN_PROGRESS → COMPLETED → APPROVED → INVOICED → PAID")
    @WithMockUser(username = ADMIN_USER, roles = {"ADMIN"})
    void fullWorkOrderLifecycle() throws Exception {
        String woId = createWorkOrder();

        mockMvc.perform(post("/api/work-orders/{id}/assign", woId)
                .header("X-Tenant-Id", TENANT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"" + ADMIN_USER + "\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ASSIGNED"));

        mockMvc.perform(post("/api/work-orders/{id}/start", woId)
                .header("X-Tenant-Id", TENANT))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        mockMvc.perform(post("/api/work-orders/{id}/complete", woId)
                .header("X-Tenant-Id", TENANT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"note\":\"All tasks completed\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("COMPLETED"));

        mockMvc.perform(post("/api/work-orders/{id}/approve", woId)
                .header("X-Tenant-Id", TENANT))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("APPROVED"));

        mockMvc.perform(post("/api/work-orders/{id}/invoice", woId)
                .header("X-Tenant-Id", TENANT))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("INVOICED"));

        mockMvc.perform(post("/api/work-orders/{id}/pay", woId)
                .header("X-Tenant-Id", TENANT))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PAID"));

        var wo = workOrderRepository.findByTenantIdAndId(TENANT, woId).orElseThrow();
        assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.PAID);
        assertThat(wo.getStatusHistory()).hasSize(6);
    }

    @Test
    @DisplayName("Cancel via API — from IN_PROGRESS")
    @WithMockUser(username = ADMIN_USER, roles = {"ADMIN"})
    void cancelFromInProgress() throws Exception {
        String woId = createWorkOrder();

        mockMvc.perform(post("/api/work-orders/{id}/assign", woId)
                .header("X-Tenant-Id", TENANT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"" + ADMIN_USER + "\"}"))
            .andExpect(status().isOk());

        mockMvc.perform(post("/api/work-orders/{id}/start", woId)
                .header("X-Tenant-Id", TENANT))
            .andExpect(status().isOk());

        mockMvc.perform(post("/api/work-orders/{id}/cancel", woId)
                .header("X-Tenant-Id", TENANT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"note\":\"Customer cancelled\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("CANCELLED"));

        var wo = workOrderRepository.findByTenantIdAndId(TENANT, woId).orElseThrow();
        assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.CANCELLED);
    }

    @Test
    @DisplayName("Invalid transition via API returns 409")
    @WithMockUser(username = ADMIN_USER, roles = {"ADMIN"})
    void invalidTransition_returns409() throws Exception {
        String woId = createWorkOrder();

        // OPEN → COMPLETED is illegal (must go through ASSIGNED, IN_PROGRESS first)
        mockMvc.perform(post("/api/work-orders/{id}/complete", woId)
                .header("X-Tenant-Id", TENANT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"note\":\"Skip\"}"))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Unassign via API: ASSIGNED → OPEN")
    @WithMockUser(username = ADMIN_USER, roles = {"ADMIN"})
    void unassign_assignedToOpen() throws Exception {
        String woId = createWorkOrder();

        mockMvc.perform(post("/api/work-orders/{id}/assign", woId)
                .header("X-Tenant-Id", TENANT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"" + ADMIN_USER + "\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ASSIGNED"));

        mockMvc.perform(post("/api/work-orders/{id}/unassign", woId)
                .header("X-Tenant-Id", TENANT))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("OPEN"));
    }
}
