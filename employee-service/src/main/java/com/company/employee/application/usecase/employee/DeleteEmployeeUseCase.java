package com.company.employee.application.usecase.employee;

import com.company.employee.domain.exception.EmployeeNotFoundException;
import com.company.employee.domain.repository.EmployeeRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use case for deleting an employee.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DeleteEmployeeUseCase {
    
    private final EmployeeRepositoryPort employeeRepository;
    
    @Transactional
    public void execute(Long id) {
        log.debug("Deleting employee with id: {}", id);
        
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(id);
        }
        
        employeeRepository.deleteById(id);
        log.info("Employee deleted successfully with id: {}", id);
    }
}
