package com.company.employee.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
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

/**
 * Spring Security configuration for JWT-based stateless authentication.
 *
 * AUTHENTICATION FLOW:
 * 1. Client sends credentials to POST /v1/auth/login (no token required).
 * 2. AuthController delegates to AuthService, which uses AuthenticationManager to validate
 *    username/password and load UserDetails (with roles).
 * 3. On success, AuthService generates:
 *    - Access token (JWT with subject=username, roles claim, type=access) via JwtUtil.
 *    - Refresh token (stored in DB, used to obtain new access token).
 * 4. Client stores tokens and sends "Authorization: Bearer <accessToken>" on subsequent requests.
 * 5. JwtAuthenticationFilter runs before the dispatcher: extracts Bearer token, validates signature
 *    and expiry via JwtUtil, parses roles from token, and sets Authentication in SecurityContext.
 * 6. SecurityContextHolder then holds the authenticated principal (username) and authorities (roles)
 *    for the current request, so authorization rules (hasRole, etc.) can be evaluated.
 *
 * ROLE-BASED ACCESS:
 * - ADMIN (ROLE_ADMIN): full CRUD on /employees (create, update, delete, and view).
 * - EMPLOYEE (ROLE_EMPLOYEE): view only (GET /employees, GET /employees/{id}).
 * - Unauthenticated: only /v1/auth/* and /actuator/health.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final AccessDeniedHandlerImpl accessDeniedHandler;

    /** Paths that do not require authentication (login, register, refresh, health). */
    private static final String[] AUTH_WHITELIST = {
            "/v1/auth/login",
            "/v1/auth/register",
            "/v1/auth/refresh",
            "/actuator/health",
            "/error"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(AUTH_WHITELIST).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Only ADMIN can create, update or delete employees
                        .requestMatchers(HttpMethod.POST, "/employees").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/employees/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/employees/*").hasRole("ADMIN")
                        // ADMIN and EMPLOYEE can view (list and get by id)
                        .requestMatchers(HttpMethod.GET, "/employees", "/employees/*").hasAnyRole("ADMIN", "EMPLOYEE")
                        .anyRequest().authenticated())
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
