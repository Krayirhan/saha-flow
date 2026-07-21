package com.sahaflow.identity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahaflow.AbstractIntegrationTest;
import com.sahaflow.identity.dto.LoginRequest;
import com.sahaflow.identity.dto.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
class AuthControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/register - should create tenant, user and return tokens")
    void register_shouldCreateTenantAndUser() throws Exception {
        var request = new RegisterRequest(
            "testco", "Test Company", "test@testco.local",
            "Test123!", "Test", "User", null
        );

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.access_token").exists())
            .andExpect(jsonPath("$.refresh_token").exists())
            .andExpect(jsonPath("$.token_type").value("Bearer"))
            .andExpect(jsonPath("$.tenant_id").exists())
            .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    @DisplayName("POST /api/auth/login - should authenticate valid user")
    void login_shouldAuthenticateValidUser() throws Exception {
        var request = new LoginRequest("admin@sahaflow.local", "Admin123!");

        mockMvc.perform(post("/api/auth/login")
                .header("X-Tenant-Id", "tenant-default")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.access_token").exists())
            .andExpect(jsonPath("$.refresh_token").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 401 for invalid credentials")
    void login_shouldReturn401ForInvalidCredentials() throws Exception {
        var request = new LoginRequest("admin@sahaflow.local", "WrongPass1");

        mockMvc.perform(post("/api/auth/login")
                .header("X-Tenant-Id", "tenant-default")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/register - should reject duplicate tenant slug")
    void register_shouldRejectDuplicateTenantSlug() throws Exception {
        var request = new RegisterRequest(
            "demo", "Demo Tenant", "demo@demo.local",
            "Demo123!", "Demo", "User", null
        );

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
}
