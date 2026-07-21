package com.sahaflow.shared;

import com.sahaflow.shared.idempotency.IdempotencyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
@Transactional
class IdempotencyTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("idempotency_test")
        .withUsername("testuser")
        .withPassword("testpass");

    static {
        postgres.start();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired
    private JdbcClient jdbcClient;

    @BeforeEach
    void setUp() {
        jdbcClient.sql("DELETE FROM idempotency_keys").update();
    }

    @Test
    @DisplayName("storePending + get should return completed response")
    void storeAndRetrieveIdempotentResponse() {
        var service = new IdempotencyService(jdbcClient);
        String key = "idem-test-key-001";
        String requestBody = "{\"title\":\"Test\"}";
        String responseBody = "{\"id\":\"wo-123\",\"status\":\"OPEN\"}";

        service.storePending(key, requestBody);
        service.storeCompleted(key, responseBody);

        String result = service.get(key);
        assertThat(result).isNotNull();
        assertThat(result).contains("wo-123");
    }

    @Test
    @DisplayName("matchesPayload should return true for identical payloads")
    void matchesPayload_shouldReturnTrue() {
        var service = new IdempotencyService(jdbcClient);
        String key = "idem-match-001";
        String payload = "{\"title\":\"Same Title\"}";

        service.storePending(key, payload);

        assertThat(service.matchesPayload(key, payload)).isTrue();
        assertThat(service.matchesPayload(key, "{\"title\":\"Different\"}")).isFalse();
    }

    @Test
    @DisplayName("remove should delete the key")
    void remove_shouldDeleteKey() {
        var service = new IdempotencyService(jdbcClient);
        String key = "idem-remove-001";

        service.storePending(key, "{}");
        service.remove(key);

        assertThat(service.get(key)).isNull();
    }
}
