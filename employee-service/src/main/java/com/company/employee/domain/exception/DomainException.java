package com.company.employee.domain.exception;

/**
 * Base exception for domain layer.
 * All domain exceptions should extend this class.
 */
public abstract class DomainException extends RuntimeException {
    
    protected DomainException(String message) {
        super(message);
    }
    
    protected DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}
