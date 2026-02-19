package com.company.employee.dto;

import com.company.employee.model.EmployeeRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {

    private Long id;
    private String name;
    private Integer age;
    private String employeeClass;
    private List<String> subjects;
    private Integer attendance;
    private EmployeeRole role;
    private Instant createdAt;
    private Instant updatedAt;
}
