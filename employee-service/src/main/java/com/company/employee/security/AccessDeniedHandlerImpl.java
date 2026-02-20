package com.company.employee.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

/**
 * Returns 403 Forbidden with JSON body when the user is authenticated but not
 * authorized (e.g. EMPLOYEE calling POST /employees).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        log.debug("Access denied: {}", accessDeniedException.getMessage());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        Map<String, Object> body = Map.of(
                "timestamp", Instant.now().toString(),
                "status", 403,
                "error", "Forbidden",
                "message", accessDeniedException.getMessage() != null ? accessDeniedException.getMessage() : "Insufficient permissions",
                "path", request.getRequestURI()
        );
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
