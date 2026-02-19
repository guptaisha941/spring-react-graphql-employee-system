package com.company.employee.service;

import com.company.employee.dto.LoginRequest;
import com.company.employee.dto.LoginResponse;
import com.company.employee.dto.RegisterRequest;
import com.company.employee.dto.RefreshTokenRequest;
import com.company.employee.exception.BadRequestException;
import com.company.employee.exception.DuplicateResourceException;
import com.company.employee.model.Role;
import com.company.employee.model.User;
import com.company.employee.repository.UserRepository;
import com.company.employee.security.JwtProperties;
import com.company.employee.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword()));

        User user = userRepository.findByUsernameOrEmail(authentication.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));
        String username = user.getUsername();

        Set<String> roles = user.getRoles().stream().map(Role::name).collect(Collectors.toSet());
        String accessToken = jwtUtil.generateAccessToken(username, roles);
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(jwtProperties.getPrefix())
                .expiresIn(jwtProperties.getExpirationMs() / 1000)
                .username(username)
                .roles(roles)
                .build();
    }

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(Role.ROLE_EMPLOYEE))
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    public LoginResponse refreshToken(RefreshTokenRequest request) {
        return refreshTokenService.refresh(request.getRefreshToken());
    }
}
