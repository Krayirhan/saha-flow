package com.sahaflow;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public abstract class AbstractIntegrationTest {

    private static final Logger log = LoggerFactory.getLogger(AbstractIntegrationTest.class);

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("sahaflow_test")
        .withUsername("testuser")
        .withPassword("testpass");

    static {
        postgres.start();
        log.info("Testcontainers PostgreSQL started at: {}", postgres.getJdbcUrl());
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("sahaflow.jwt.access-secret", () ->
            "Y2hhbmdlbWV0aGlzc2VjcmV0a2V5Zm9yYWNjZXNzdG9rZW5zMTIzNDU2Nzg5MA==");
        registry.add("sahaflow.jwt.refresh-secret", () ->
            "Y2hhbmdlbWV0aGlzc2VjcmV0a2V5Zm9ycmVmcmVzaHRva2VuczEyMzQ1Njc4OTBBQkNERUY=");
    }
}
