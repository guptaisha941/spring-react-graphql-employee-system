package com.company.employee.service;

import com.company.employee.dto.LoginResponse;
import com.company.employee.exception.BadRequestException;
import com.company.employee.model.RefreshToken;
import com.company.employee.model.User;
import com.company.employee.repository.RefreshTokenRepository;
import com.company.employee.repository.UserRepository;
import com.company.employee.security.JwtProperties;
import com.company.employee.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    @Transactional
    public String createRefreshToken(User user) {
        String token = UUID.randomUUID().toString() + "-" + Instant.now().toEpochMilli();
        Instant expiry = Instant.now().plusMillis(jwtProperties.getRefreshExpirationMs());
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiryDate(expiry)
                .build();
        refreshTokenRepository.save(refreshToken);
        return token;
    }

    @Transactional
    public LoginResponse refresh(String requestToken) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(requestToken)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token expired");
        }

        User user = refreshToken.getUser();
        Set<String> roles = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), roles);
        String newRefreshToken = createRefreshToken(user);
        refreshTokenRepository.delete(refreshToken);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .tokenType(jwtProperties.getPrefix())
                .expiresIn(jwtProperties.getExpirationMs() / 1000)
                .username(user.getUsername())
                .roles(roles)
                .build();
    }
}
