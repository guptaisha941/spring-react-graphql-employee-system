package com.company.employee.domain.exception;

/**
 * Domain exception thrown when an employee is not found.
 */
public class EmployeeNotFoundException extends DomainException {
    
    public EmployeeNotFoundException(Long id) {
        super(String.format("Employee with id %d not found", id));
    }
    
    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
