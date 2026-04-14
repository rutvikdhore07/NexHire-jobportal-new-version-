package com.nexhire.portal.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Core application configuration.
 * Uses in-memory caching - no Redis dependency required.
 */
@Slf4j
@Configuration
public class AppConfig {

    @Bean
    public CacheManager cacheManager() {
        log.info("Cache initialized: in-memory ConcurrentMapCache");
        return new ConcurrentMapCacheManager("jobs", "jobDetails");
    }
}
