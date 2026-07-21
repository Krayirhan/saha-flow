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

    @BeforeEach
    void setUp() {
        var customer = new Customer();
        customer.setId("cust-int-001");
        customer.setTenantId("tenant-default");
        customer.setName("Integration Test Customer");
        customer.setActive(true);
        customerRepository.save(customer);
    }

    @Test
    @DisplayName("Full work order lifecycle via API")
    @WithMockUser(username = "user-admin-001", roles = {"ADMIN"})
    void fullWorkOrderLifecycle() throws Exception {
        var createRequest = new WorkOrderCreateRequest(
            "Integration Test WO", "Test description", "cust-int-001",
            "Test Customer", "Test address 123", "HIGH", null,
            41.0082, 28.9784, 60, null, null
        );

        var responseJson = mockMvc.perform(post("/api/work-orders")
                .header("X-Tenant-Id", "tenant-default")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.status").value("OPEN"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        var response = objectMapper.readValue(responseJson, java.util.Map.class);
        String woId = (String) response.get("id");

        mockMvc.perform(post("/api/work-orders/{id}/assign", woId)
                .header("X-Tenant-Id", "tenant-default")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"user-admin-001\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ASSIGNED"));

        mockMvc.perform(post("/api/work-orders/{id}/start", woId)
                .header("X-Tenant-Id", "tenant-default"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        mockMvc.perform(post("/api/work-orders/{id}/complete", woId)
                .header("X-Tenant-Id", "tenant-default")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"note\":\"All tasks completed\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("COMPLETED"));

        mockMvc.perform(post("/api/work-orders/{id}/approve", woId)
                .header("X-Tenant-Id", "tenant-default"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("APPROVED"));

        var wo = workOrderRepository.findByTenantIdAndId("tenant-default", woId).orElseThrow();
        assertThat(wo.getStatus()).isEqualTo(WorkOrderStatus.APPROVED);
        assertThat(wo.getStatusHistory()).hasSize(4);
    }
}
