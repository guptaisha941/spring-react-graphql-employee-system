package com.company.employee.domain.repository;

import com.company.employee.domain.model.Employee;
import com.company.employee.domain.valueobject.EmployeeFilter;

import java.util.List;
import java.util.Optional;

/**
 * Port interface for Employee repository.
 * This is part of the domain layer and defines the contract
 * that infrastructure must implement (Dependency Inversion Principle).
 */
public interface EmployeeRepositoryPort {
    
    /**
     * Save an employee entity.
     */
    Employee save(Employee employee);
    
    /**
     * Find employee by ID.
     */
    Optional<Employee> findById(Long id);
    
    /**
     * Check if employee exists by ID.
     */
    boolean existsById(Long id);
    
    /**
     * Delete employee by ID.
     */
    void deleteById(Long id);
    
    /**
     * Find all employees with pagination and filtering.
     */
    PageResult<Employee> findAll(EmployeeFilter filter, int page, int size, String sort);
    
    /**
     * Page result wrapper for paginated queries.
     */
    record PageResult<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int currentPage,
        int pageSize
    ) {}
}
