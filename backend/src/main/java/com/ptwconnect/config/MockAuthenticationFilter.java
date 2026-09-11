package com.ptwconnect.config;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class MockAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String mockUser = request.getHeader("X-Mock-User");
        if (mockUser != null && !mockUser.isBlank()
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            var authorities = java.util.List.of(new SimpleGrantedAuthority("ROLE_DEVELOPMENT_USER"));
            var authentication = new UsernamePasswordAuthenticationToken(mockUser.trim(), null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
