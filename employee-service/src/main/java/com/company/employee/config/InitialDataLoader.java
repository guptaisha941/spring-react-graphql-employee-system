package com.company.employee.config;

import com.company.employee.model.Role;
import com.company.employee.model.User;
import com.company.employee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Loads initial users on application startup: 1 admin and 5 employee users.
 * Uses BCrypt for password encoding. Skips creation if a user with the same username already exists.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class InitialDataLoader implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "password123";

    @Override
    public void run(ApplicationArguments args) {
        loadAdminUser();
        loadEmployeeUsers();
    }

    private void loadAdminUser() {
        String username = "admin";
        if (userRepository.existsByUsername(username)) {
            log.debug("Admin user already exists, skipping");
            return;
        }
        User admin = User.builder()
                .username(username)
                .email("admin@example.com")
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .roles(Set.of(Role.ROLE_ADMIN))
                .enabled(true)
                .build();
        userRepository.save(admin);
        log.info("Created admin user: {}", username);
    }

    private void loadEmployeeUsers() {
        for (int i = 1; i <= 5; i++) {
            String username = "employee" + i;
            if (userRepository.existsByUsername(username)) {
                log.debug("User {} already exists, skipping", username);
                continue;
            }
            User employee = User.builder()
                    .username(username)
                    .email("employee" + i + "@example.com")
                    .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                    .roles(Set.of(Role.ROLE_EMPLOYEE))
                    .enabled(true)
                    .build();
            userRepository.save(employee);
            log.info("Created employee user: {}", username);
        }
    }
}
