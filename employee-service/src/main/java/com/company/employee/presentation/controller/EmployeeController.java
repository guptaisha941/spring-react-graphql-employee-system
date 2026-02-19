package com.company.employee.presentation.controller;

import com.company.employee.application.dto.EmployeeDto;
import com.company.employee.application.dto.PageDto;
import com.company.employee.application.usecase.employee.*;
import com.company.employee.domain.valueobject.EmployeeFilter;
import com.company.employee.presentation.dto.EmployeeRequest;
import com.company.employee.presentation.dto.EmployeeResponse;
import com.company.employee.presentation.dto.PageResponse;
import com.company.employee.presentation.mapper.EmployeePresentationMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

/**
 * REST Controller for Employee management.
 * Presentation layer - handles HTTP requests and delegates to use cases.
 */
@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Slf4j
public class EmployeeController {
    
    private final CreateEmployeeUseCase createEmployeeUseCase;
    private final GetEmployeeUseCase getEmployeeUseCase;
    private final ListEmployeesUseCase listEmployeesUseCase;
    private final UpdateEmployeeUseCase updateEmployeeUseCase;
    private final DeleteEmployeeUseCase deleteEmployeeUseCase;
    private final EmployeePresentationMapper presentationMapper;
    
    /**
     * GET /api/v1/employees - List employees with pagination, sorting and optional filters.
     */
    @GetMapping
    public ResponseEntity<PageResponse<EmployeeResponse>> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "name,asc") String sort,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String employeeClass) {
        
        log.debug("GET /api/v1/employees - page: {}, size: {}, sort: {}", page, size, sort);
        
        EmployeeFilter filter = EmployeeFilter.builder()
                .name(name)
                .employeeClass(employeeClass)
                .build();
        
        PageDto<EmployeeDto> pageDto = listEmployeesUseCase.execute(page, size, sort, filter);
        PageResponse<EmployeeResponse> response = presentationMapper.toPageResponse(pageDto);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/v1/employees/{id} - Get a single employee by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        log.debug("GET /api/v1/employees/{}", id);
        
        EmployeeDto dto = getEmployeeUseCase.execute(id);
        EmployeeResponse response = presentationMapper.toResponse(dto);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/v1/employees - Create a new employee.
     */
    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        log.debug("POST /api/v1/employees - name: {}", request.name());
        
        var command = presentationMapper.toCommand(request);
        EmployeeDto dto = createEmployeeUseCase.execute(command);
        EmployeeResponse response = presentationMapper.toResponse(dto);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        
        return ResponseEntity.created(location).body(response);
    }
    
    /**
     * PUT /api/v1/employees/{id} - Full update of an employee.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        
        log.debug("PUT /api/v1/employees/{}", id);
        
        var command = presentationMapper.toCommand(request);
        EmployeeDto dto = updateEmployeeUseCase.execute(id, command);
        EmployeeResponse response = presentationMapper.toResponse(dto);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * DELETE /api/v1/employees/{id} - Delete an employee.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.debug("DELETE /api/v1/employees/{}", id);
        
        deleteEmployeeUseCase.execute(id);
        
        return ResponseEntity.noContent().build();
    }
}
