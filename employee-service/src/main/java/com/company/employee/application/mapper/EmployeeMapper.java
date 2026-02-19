package com.company.employee.application.mapper;

import com.company.employee.application.dto.EmployeeCommand;
import com.company.employee.application.dto.EmployeeDto;
import com.company.employee.domain.model.Employee;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Mapper for converting between domain entities and application DTOs.
 * Implements the mapping logic between layers.
 */
@Component
public class EmployeeMapper {
    
    /**
     * Convert domain entity to application DTO.
     */
    public EmployeeDto toDto(Employee employee) {
        if (employee == null) {
            return null;
        }
        
        return new EmployeeDto(
                employee.getId(),
                employee.getName(),
                employee.getAge(),
                employee.getEmployeeClass(),
                employee.getSubjects() != null ? new ArrayList<>(employee.getSubjects()) : new ArrayList<>(),
                employee.getAttendance(),
                employee.getRole(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }
    
    /**
     * Convert application command to domain entity.
     */
    public Employee toDomain(EmployeeCommand command) {
        if (command == null) {
            return null;
        }
        
        return Employee.builder()
                .name(command.name())
                .age(command.age())
                .employeeClass(command.employeeClass())
                .subjects(command.subjects() != null ? new ArrayList<>(command.subjects()) : new ArrayList<>())
                .attendance(command.attendance())
                .role(command.role())
                .build();
    }
}
