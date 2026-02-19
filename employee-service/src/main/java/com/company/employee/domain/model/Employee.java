package com.company.employee.domain.model;

import com.company.employee.domain.valueobject.EmployeeRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Domain entity representing an Employee.
 * This is a pure domain model with no framework dependencies.
 * Contains business logic and validation rules.
 */
@Getter
@Setter
@Builder
public class Employee {

    private Long id;
    private String name;
    private Integer age;
    private String employeeClass;
    @Builder.Default
    private List<String> subjects = new ArrayList<>();
    private Integer attendance;
    private EmployeeRole role;
    private Instant createdAt;
    private Instant updatedAt;

    /**
     * Domain validation: Employee name must not be blank.
     */
    public boolean isValid() {
        return name != null && !name.trim().isEmpty();
    }

    /**
     * Domain business rule: Employee age must be within valid range.
     */
    public boolean hasValidAge() {
        return age == null || (age >= 0 && age <= 150);
    }

    /**
     * Domain business rule: Attendance must be within valid range.
     */
    public boolean hasValidAttendance() {
        return attendance == null || (attendance >= 0 && attendance <= 100);
    }

    /**
     * Domain operation: Update employee details.
     */
    public void updateDetails(String name, Integer age, String employeeClass, 
                             List<String> subjects, Integer attendance, EmployeeRole role) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
        this.age = age;
        this.employeeClass = employeeClass;
        this.subjects = subjects != null ? new ArrayList<>(subjects) : new ArrayList<>();
        this.attendance = attendance;
        this.role = role;
    }
}
