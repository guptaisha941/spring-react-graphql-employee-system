package com.company.employee.dto;

import com.company.employee.model.EmployeeRole;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    private String name;

    @Min(value = 0, message = "Age must be 0 or greater")
    @Max(value = 150, message = "Age must not exceed 150")
    private Integer age;

    @Size(max = 100, message = "Employee class must not exceed 100 characters")
    private String employeeClass;

    @Size(max = 50, message = "At most 50 subjects allowed")
    @Builder.Default
    private List<String> subjects = List.of();

    @Min(value = 0, message = "Attendance must be 0 or greater")
    @Max(value = 100, message = "Attendance must not exceed 100")
    private Integer attendance;

    private EmployeeRole role;
}
