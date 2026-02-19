package com.company.employee.controller;

import com.company.employee.dto.LoginRequest;
import com.company.employee.dto.LoginResponse;
import com.company.employee.dto.RegisterRequest;
import com.company.employee.dto.RefreshTokenRequest;
import com.company.employee.model.User;
import com.company.employee.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication endpoints (no JWT required; these are used to obtain tokens).
 *
 * LOGIN FLOW:
 * 1. Client POSTs credentials (usernameOrEmail + password) to /v1/auth/login.
 * 2. AuthService uses AuthenticationManager to validate credentials and load user (with roles).
 * 3. On success: JwtUtil generates access token (JWT with username + roles); RefreshTokenService
 *    creates and stores a refresh token. Both are returned in the response.
 * 4. Client sends "Authorization: Bearer <accessToken>" on subsequent API requests. For expired
 *    access tokens, client can POST the refresh token to /v1/auth/refresh to get a new access token.
 */
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Login: validate credentials and return access + refresh tokens.
     * Roles (e.g. ROLE_ADMIN, ROLE_EMPLOYEE) are included in the access token and response.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Registration successful",
                "username", user.getUsername()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }
}
