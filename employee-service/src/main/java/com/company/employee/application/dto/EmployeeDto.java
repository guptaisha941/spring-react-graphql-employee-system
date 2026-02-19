package com.company.employee.application.dto;

import com.company.employee.domain.valueobject.EmployeeRole;

import java.time.Instant;
import java.util.List;

/**
 * Application DTO for Employee data transfer.
 * Used for returning employee data from use cases.
 */
public record EmployeeDto(
        Long id,
        String name,
        Integer age,
        String employeeClass,
        List<String> subjects,
        Integer attendance,
        EmployeeRole role,
        Instant createdAt,
        Instant updatedAt
) {
}
