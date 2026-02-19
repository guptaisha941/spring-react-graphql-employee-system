package com.company.employee.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Token validation filter: runs once per request and establishes the authenticated
 * principal from the JWT when present and valid.
 *
 * TOKEN VALIDATION FLOW:
 * 1. Extract Bearer token from Authorization header (if present).
 * 2. If no token or invalid format: do nothing; later filters or endpoint rules
 *    will require authentication and trigger 401 via JwtAuthenticationEntryPoint.
 * 3. If token present: validate signature and expiry via JwtUtil (reject if expired
 *    or tampered); ensure it is an access token (not a refresh token).
 * 4. Parse username (subject) and roles from token and build an
 *    UsernamePasswordAuthenticationToken with authorities (roles).
 * 5. Set this Authentication in SecurityContextHolder so the rest of the filter
 *    chain and the controller see the request as authenticated with correct roles.
 *
 * SecurityContext is not persisted; it is per-request and cleared after the response.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            String jwt = extractJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt) && !jwtUtil.isRefreshToken(jwt)) {
                String username = jwtUtil.getUsernameFromToken(jwt);
                List<SimpleGrantedAuthority> authorities = jwtUtil.getAuthoritiesFromToken(jwt);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.debug("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(jwtProperties.getHeader());
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtProperties.getPrefix() + " ")) {
            return bearerToken.substring(jwtProperties.getPrefix().length() + 1).trim();
        }
        return null;
    }
}
