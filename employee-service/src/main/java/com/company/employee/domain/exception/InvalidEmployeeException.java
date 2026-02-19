package com.company.employee.domain.exception;

/**
 * Domain exception thrown when employee data is invalid.
 */
public class InvalidEmployeeException extends DomainException {
    
    public InvalidEmployeeException(String message) {
        super(message);
    }
}
