package com.sahaflow.shared;

import com.sahaflow.shared.config.RateLimitConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimitTest {

    @Test
    @DisplayName("Auth bucket should allow 10 requests then block")
    void authBucket_shouldLimitTo10PerMinute() {
        var config = new RateLimitConfig();
        var bucket = config.resolveAuthBucket("192.168.1.1");

        for (int i = 0; i < 10; i++) {
            assertThat(bucket.tryConsume(1))
                .as("Request %d should be allowed", i + 1)
                .isTrue();
        }

        assertThat(bucket.tryConsume(1))
            .as("11th request should be rate limited")
            .isFalse();
    }

    @Test
    @DisplayName("API bucket should allow 100 requests then block")
    void apiBucket_shouldLimitTo100PerMinute() {
        var config = new RateLimitConfig();
        var bucket = config.resolveApiBucket("user-1");

        for (int i = 0; i < 100; i++) {
            assertThat(bucket.tryConsume(1))
                .as("Request %d should be allowed", i + 1)
                .isTrue();
        }

        assertThat(bucket.tryConsume(1))
            .as("101st request should be rate limited")
            .isFalse();
    }

    @Test
    @DisplayName("Separate IPs should have separate auth buckets")
    void separateIps_shouldHaveSeparateAuthBuckets() {
        var config = new RateLimitConfig();
        var bucket1 = config.resolveAuthBucket("10.0.0.1");
        var bucket2 = config.resolveAuthBucket("10.0.0.2");

        for (int i = 0; i < 10; i++) {
            bucket1.tryConsume(1);
        }

        assertThat(bucket1.tryConsume(1)).isFalse();
        assertThat(bucket2.tryConsume(1)).isTrue();
    }

    @Test
    @DisplayName("evictStaleEntries should remove buckets with near-full tokens")
    void evictStale_shouldRemoveFullBuckets() {
        var config = new RateLimitConfig();
        var bucket = config.resolveApiBucket("user-stale");

        bucket.tryConsume(1);

        config.evictStaleEntries();

        var remaining = config.resolveApiBucket("user-stale");
        assertThat(remaining.getAvailableTokens()).isLessThan(100);
    }
}
