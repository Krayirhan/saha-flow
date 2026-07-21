package com.sahaflow.health;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcClient jdbcClient;

    public HealthController(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> liveness() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "saha-flow-api",
            "timestamp", Instant.now().toString()
        ));
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        try {
            jdbcClient.sql("SELECT 1").query().optionalValue(Integer.class);
            return ResponseEntity.ok(Map.of(
                "status", "READY",
                "database", "CONNECTED",
                "timestamp", Instant.now().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of(
                "status", "NOT_READY",
                "database", "DISCONNECTED",
                "error", e.getMessage(),
                "timestamp", Instant.now().toString()
            ));
        }
    }
}
