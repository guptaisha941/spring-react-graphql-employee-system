package com.company.employee.exception;

import com.company.employee.dto.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Global exception handler for standardized error responses.
 * In production, sensitive error details are hidden.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    private boolean isProduction() {
        return "prod".equals(activeProfile);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error("Not Found")
                .message(ex.getMessage())
                .path(getPath(request))
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex, WebRequest request) {
        log.warn("Bad request: {}", ex.getMessage());
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Bad Request")
                .message(ex.getMessage())
                .path(getPath(request))
                .build();
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicateResource(DuplicateResourceException ex, WebRequest request) {
        log.warn("Duplicate resource: {}", ex.getMessage());
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.CONFLICT.value())
                .error("Conflict")
                .message(ex.getMessage())
                .path(getPath(request))
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        log.warn("Validation failed: {}", ex.getBindingResult().getFieldErrors());
        List<ApiError.FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(this::toApiFieldError)
                .collect(Collectors.toList());
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Failed")
                .message("Invalid request body")
                .path(getPath(request))
                .fieldErrors(fieldErrors)
                .build();
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
        log.warn("Authentication failed: Invalid credentials");
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Unauthorized")
                .message("Invalid username or password")
                .path(getPath(request))
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiError> handleUsernameNotFound(UsernameNotFoundException ex, WebRequest request) {
        log.warn("Authentication failed: User not found");
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Unauthorized")
                .message("Invalid username or password")
                .path(getPath(request))
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, WebRequest request) {
        log.error("Unhandled exception", ex);
        
        String message = isProduction() 
            ? "An unexpected error occurred. Please contact support if the problem persists."
            : ex.getMessage();
        
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message(message)
                .path(getPath(request))
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private ApiError.FieldError toApiFieldError(FieldError fe) {
        return ApiError.FieldError.builder()
                .field(fe.getField())
                .message(fe.getDefaultMessage())
                .rejectedValue(fe.getRejectedValue())
                .build();
    }

    private String getPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }
}
