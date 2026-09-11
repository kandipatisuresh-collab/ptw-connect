package com.ptwconnect.api;

import java.util.Arrays;

import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final Environment environment;

    public HealthController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping
    public HealthResponse health() {
        String profile = Arrays.stream(environment.getActiveProfiles())
                .findFirst()
                .orElse("default");
        return new HealthResponse(
                "UP",
                "ptw-connect-backend",
                profile,
                "PTW Connect supports human safety decisions; it does not autonomously approve or activate permits.");
    }

    public record HealthResponse(
            String status,
            String service,
            String profile,
            String safetyNotice) {
    }
}
