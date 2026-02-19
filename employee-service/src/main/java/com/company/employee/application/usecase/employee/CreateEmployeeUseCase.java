package com.company.employee.application.usecase.employee;

import com.company.employee.application.dto.EmployeeCommand;
import com.company.employee.application.dto.EmployeeDto;
import com.company.employee.application.mapper.EmployeeMapper;
import com.company.employee.domain.exception.InvalidEmployeeException;
import com.company.employee.domain.model.Employee;
import com.company.employee.domain.repository.EmployeeRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use case for creating a new employee.
 * Implements the application business logic for employee creation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreateEmployeeUseCase {
    
    private final EmployeeRepositoryPort employeeRepository;
    private final EmployeeMapper employeeMapper;
    
    @Transactional
    public EmployeeDto execute(EmployeeCommand command) {
        log.debug("Creating employee with name: {}", command.name());
        
        // Domain validation
        Employee employee = employeeMapper.toDomain(command);
        if (!employee.isValid()) {
            throw new InvalidEmployeeException("Employee name is required");
        }
        if (!employee.hasValidAge()) {
            throw new InvalidEmployeeException("Employee age must be between 0 and 150");
        }
        if (!employee.hasValidAttendance()) {
            throw new InvalidEmployeeException("Employee attendance must be between 0 and 100");
        }
        
        Employee savedEmployee = employeeRepository.save(employee);
        log.info("Employee created successfully with id: {}", savedEmployee.getId());
        
        return employeeMapper.toDto(savedEmployee);
    }
}
