package com.sahaflow.shared.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    private final Map<String, Bucket> authBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> apiBuckets = new ConcurrentHashMap<>();

    public Bucket resolveAuthBucket(String clientIp) {
        return authBuckets.computeIfAbsent(clientIp, key -> createAuthBucket());
    }

    public Bucket resolveApiBucket(String userId) {
        return apiBuckets.computeIfAbsent(userId, key -> createApiBucket());
    }

    private Bucket createAuthBucket() {
        var limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createApiBucket() {
        var limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    public void evictStaleEntries() {
        authBuckets.entrySet().removeIf(e -> e.getValue().getAvailableTokens() > 9);
        apiBuckets.entrySet().removeIf(e -> e.getValue().getAvailableTokens() > 99);
    }
}
