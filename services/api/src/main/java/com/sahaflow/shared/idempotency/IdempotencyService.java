package com.sahaflow.shared.idempotency;

import com.sahaflow.shared.tenant.TenantContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class IdempotencyService {

    private static final Logger log = LoggerFactory.getLogger(IdempotencyService.class);
    private final JdbcClient jdbcClient;

    public IdempotencyService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Transactional
    public void storePending(String key, String requestBody) {
        jdbcClient.sql("""
                INSERT INTO idempotency_keys (key, tenant_id, request_payload, status, created_at)
                VALUES (:key, :tenantId, CAST(:payload AS jsonb), 'PENDING', :now)
                ON CONFLICT (key) DO NOTHING
                """)
            .param("key", key)
            .param("tenantId", TenantContextHolder.getTenantId())
            .param("payload", requestBody)
            .param("now", Instant.now())
            .update();
    }

    @Transactional
    public void storeCompleted(String key, String responseBody) {
        jdbcClient.sql("""
                UPDATE idempotency_keys
                SET status = 'COMPLETED', response_body = CAST(:responseBody AS jsonb), completed_at = :now
                WHERE key = :key
                """)
            .param("key", key)
            .param("responseBody", responseBody)
            .param("now", Instant.now())
            .update();
    }

    public String get(String key) {
        var result = jdbcClient.sql("""
                SELECT response_body FROM idempotency_keys
                WHERE key = :key AND status = 'COMPLETED'
                """)
            .param("key", key)
            .query()
            .optionalValue(String.class);
        return result.orElse(null);
    }

    public boolean matchesPayload(String key, String requestBody) {
        var stored = jdbcClient.sql("""
                SELECT request_payload FROM idempotency_keys
                WHERE key = :key
                """)
            .param("key", key)
            .query()
            .optionalValue(String.class);
        if (stored.isPresent()) {
            try {
                var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                var storedNode = mapper.readTree(stored.get());
                var reqNode = mapper.readTree(requestBody);
                return storedNode.equals(reqNode);
            } catch (Exception e) {
                return stored.get().equals(requestBody);
            }
        }
        return false;
    }

    @Transactional
    public void remove(String key) {
        jdbcClient.sql("DELETE FROM idempotency_keys WHERE key = :key")
            .param("key", key)
            .update();
    }
}
