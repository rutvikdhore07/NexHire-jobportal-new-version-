package com.nexhire.portal.config;

import com.nexhire.portal.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.Arrays;
import java.util.List;

@Configuration @EnableWebSecurity @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins}") private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(c -> c.configurationSource(corsSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Auth — always public
                .requestMatchers("/api/auth/**").permitAll()

                // ✅ WITHOUT /api prefix (what your frontend actually calls)
                .requestMatchers(HttpMethod.GET,
                        "/jobs", "/jobs/**",
                        "/news", "/news/**",
                        "/skills", "/skills/**",
                        "/courses", "/courses/**").permitAll()

                // ✅ WITH /api prefix (keep for consistency)
                .requestMatchers(HttpMethod.GET,
                        "/api/jobs", "/api/jobs/**",
                        "/api/news", "/api/news/**",
                        "/api/skills", "/api/skills/**",
                        "/api/courses", "/api/courses/**").permitAll()

                // Secured job endpoints
                .requestMatchers(HttpMethod.GET, "/api/jobs/my-postings").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PUT, "/api/jobs/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasRole("RECRUITER")

                // Recommendations — public
                .requestMatchers(HttpMethod.GET, "/api/jobs/recommended").permitAll()
                .requestMatchers(HttpMethod.GET, "/jobs/recommended").permitAll()

                // Admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // AI endpoints — authenticated
                .requestMatchers("/api/ai/**").authenticated()

                // Everything else needs auth
                .anyRequest().authenticated()
            )
            .authenticationProvider(authProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean CorsConfigurationSource corsSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    @Bean AuthenticationProvider authProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(userDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception {
        return c.getAuthenticationManager();
    }

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }
}   