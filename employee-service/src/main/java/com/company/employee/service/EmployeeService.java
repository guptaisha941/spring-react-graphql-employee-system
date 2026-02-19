package com.company.employee.service;

import com.company.employee.dto.EmployeeFilter;
import com.company.employee.dto.EmployeeRequest;
import com.company.employee.dto.EmployeeResponse;
import com.company.employee.exception.BadRequestException;
import com.company.employee.exception.ResourceNotFoundException;
import com.company.employee.model.Employee;
import com.company.employee.repository.EmployeeRepository;
import com.company.employee.repository.EmployeeSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private static final int MAX_PAGE_SIZE = 100;
    private static final String DEFAULT_SORT = "name,asc";

    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getAllEmployees(int page, int size, String sort, EmployeeFilter filters) {
        log.debug("Fetching employees - page: {}, size: {}, sort: {}", page, size, sort);
        
        if (page < 0) {
            log.warn("Invalid page index: {}", page);
            throw new BadRequestException("Page index must not be less than zero");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            log.warn("Invalid page size: {} (max: {})", size, MAX_PAGE_SIZE);
            throw new BadRequestException("Page size must be between 1 and " + MAX_PAGE_SIZE);
        }
        
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        String name = filters != null ? filters.getName() : null;
        String employeeClass = filters != null ? filters.getEmployeeClass() : null;
        
        Page<EmployeeResponse> result = employeeRepository.findAll(
                EmployeeSpecifications.withFilters(name, employeeClass),
                pageable
        ).map(this::toResponse);
        
        log.debug("Found {} employees (page {} of {})", result.getNumberOfElements(), page + 1, result.getTotalPages());
        return result;
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        log.debug("Fetching employee with id: {}", id);
        validateId(id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Employee not found with id: {}", id);
                    return new ResourceNotFoundException("Employee", "id", id);
                });
        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (request == null) {
            throw new BadRequestException("Employee request must not be null");
        }
        Employee employee = toEntity(request);
        employee = employeeRepository.save(employee);
        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        validateId(id);
        if (request == null) {
            throw new BadRequestException("Employee request must not be null");
        }
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        updateEntity(employee, request);
        return toResponse(employeeRepository.save(employee));
    }

    @Transactional
    public void deleteById(Long id) {
        validateId(id);
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee", "id", id);
        }
        employeeRepository.deleteById(id);
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new BadRequestException("Employee id must be a positive number");
        }
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            sort = DEFAULT_SORT;
        }
        String trimmed = sort.trim();
        String[] parts = trimmed.split(",");
        String property = parts[0].trim().isEmpty() ? "name" : parts[0].trim();
        Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        return Sort.by(direction, property);
    }

    private Employee toEntity(EmployeeRequest request) {
        return Employee.builder()
                .name(request.getName())
                .age(request.getAge())
                .employeeClass(request.getEmployeeClass())
                .subjects(request.getSubjects() != null ? new ArrayList<>(request.getSubjects()) : new ArrayList<>())
                .attendance(request.getAttendance())
                .role(request.getRole())
                .build();
    }

    private EmployeeResponse toResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .age(employee.getAge())
                .employeeClass(employee.getEmployeeClass())
                .subjects(employee.getSubjects() != null ? new ArrayList<>(employee.getSubjects()) : new ArrayList<>())
                .attendance(employee.getAttendance())
                .role(employee.getRole())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }

    private void updateEntity(Employee employee, EmployeeRequest request) {
        employee.setName(request.getName());
        employee.setAge(request.getAge());
        employee.setEmployeeClass(request.getEmployeeClass());
        employee.setSubjects(request.getSubjects() != null ? new ArrayList<>(request.getSubjects()) : new ArrayList<>());
        employee.setAttendance(request.getAttendance());
        employee.setRole(request.getRole());
    }
}
