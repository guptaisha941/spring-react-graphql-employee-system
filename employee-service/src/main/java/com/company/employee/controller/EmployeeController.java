package com.company.employee.controller;

import com.company.employee.dto.EmployeeFilter;
import com.company.employee.dto.EmployeeRequest;
import com.company.employee.dto.EmployeeResponse;
import com.company.employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    /**
     * GET /employees - List employees with pagination, sorting and optional filters.
     * Query params: page (0-based), size, sort (e.g. name,asc), name (filter), employeeClass (filter).
     */
    @GetMapping
    public ResponseEntity<Page<EmployeeResponse>> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "name,asc") String sort,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String employeeClass) {
        EmployeeFilter filter = EmployeeFilter.builder()
                .name(name)
                .employeeClass(employeeClass)
                .build();
        Page<EmployeeResponse> body = employeeService.getAllEmployees(page, size, sort, filter);
        return ResponseEntity.ok(body);
    }

    /**
     * GET /employees/{id} - Get a single employee by id.
     * Returns 404 if not found (handled by GlobalExceptionHandler).
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse body = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(body);
    }

    /**
     * POST /employees - Create a new employee.
     * Returns 201 Created with Location header and response body.
     * Returns 400 for validation errors.
     */
    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    /**
     * PUT /employees/{id} - Full update of an employee.
     * Returns 200 OK with updated body. Returns 404 if not found, 400 for invalid input.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
