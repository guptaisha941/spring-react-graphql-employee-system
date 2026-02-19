package com.company.employee.application.dto;

import com.company.employee.domain.valueobject.EmployeeRole;

import java.util.List;

/**
 * Application command DTO for creating/updating employees.
 * Immutable record for data transfer.
 */
public record EmployeeCommand(
        String name,
        Integer age,
        String employeeClass,
        List<String> subjects,
        Integer attendance,
        EmployeeRole role
) {
}
