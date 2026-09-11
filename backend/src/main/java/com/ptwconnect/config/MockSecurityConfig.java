package com.ptwconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;

@Configuration
@Profile("mock")
public class MockSecurityConfig {

    @Bean
    MockAuthenticationFilter mockAuthenticationFilter() {
        return new MockAuthenticationFilter();
    }

    @Bean
    SecurityFilterChain mockSecurityFilterChain(
            HttpSecurity http,
            MockAuthenticationFilter mockAuthenticationFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> { })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(
                    (request, response, exception) -> response.sendError(401)))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/health", "/api/v1/auth/mock-session", "/actuator/health/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(mockAuthenticationFilter, AnonymousAuthenticationFilter.class);
        return http.build();
    }
}
