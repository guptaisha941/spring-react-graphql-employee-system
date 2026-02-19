package com.company.employee.presentation.dto;

import com.company.employee.domain.valueobject.EmployeeRole;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Presentation DTO for employee creation/update requests.
 * Contains validation annotations for API layer.
 */
public record EmployeeRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
        String name,
        
        @Min(value = 0, message = "Age must be 0 or greater")
        @Max(value = 150, message = "Age must not exceed 150")
        Integer age,
        
        @Size(max = 100, message = "Employee class must not exceed 100 characters")
        String employeeClass,
        
        @Size(max = 50, message = "At most 50 subjects allowed")
        List<String> subjects,
        
        @Min(value = 0, message = "Attendance must be 0 or greater")
        @Max(value = 100, message = "Attendance must not exceed 100")
        Integer attendance,
        
        EmployeeRole role
) {
}
