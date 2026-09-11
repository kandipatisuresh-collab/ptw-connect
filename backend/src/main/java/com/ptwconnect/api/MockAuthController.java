package com.ptwconnect.api;

import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("mock")
@RequestMapping("/api/v1/auth")
public class MockAuthController {

    @GetMapping("/mock-session")
    public MockSession mockSession(
            @RequestHeader(value = "X-Mock-User", defaultValue = "development.user") String user) {
        return new MockSession(user, List.of("DEVELOPMENT_ONLY"), "This identity provider is for local development only.");
    }

    @GetMapping("/me")
    public MockSession me(Authentication authentication) {
        return new MockSession(authentication.getName(), List.of("DEVELOPMENT_ONLY"), "This identity provider is for local development only.");
    }

    public record MockSession(String subject, List<String> roles, String warning) {
    }
}
