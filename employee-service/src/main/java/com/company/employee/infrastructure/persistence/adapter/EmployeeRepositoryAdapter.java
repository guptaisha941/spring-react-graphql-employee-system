package com.company.employee.infrastructure.persistence.adapter;

import com.company.employee.domain.model.Employee;
import com.company.employee.domain.repository.EmployeeRepositoryPort;
import com.company.employee.domain.valueobject.EmployeeFilter;
import com.company.employee.infrastructure.persistence.entity.EmployeeEntity;
import com.company.employee.infrastructure.persistence.repository.JpaEmployeeRepository;
import com.company.employee.infrastructure.persistence.specification.EmployeeSpecificationBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Adapter implementing the EmployeeRepositoryPort.
 * Adapts domain repository interface to JPA implementation.
 * This is the infrastructure layer's implementation of the domain port.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EmployeeRepositoryAdapter implements EmployeeRepositoryPort {
    
    private final JpaEmployeeRepository jpaRepository;
    private final EmployeeSpecificationBuilder specificationBuilder;
    
    @Override
    public Employee save(Employee employee) {
        log.debug("Saving employee: {}", employee.getName());
        EmployeeEntity entity = EmployeeEntity.fromDomain(employee);
        EmployeeEntity saved = jpaRepository.save(entity);
        return saved.toDomain();
    }
    
    @Override
    public Optional<Employee> findById(Long id) {
        log.debug("Finding employee by id: {}", id);
        return jpaRepository.findById(id)
                .map(EmployeeEntity::toDomain);
    }
    
    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }
    
    @Override
    public void deleteById(Long id) {
        log.debug("Deleting employee by id: {}", id);
        jpaRepository.deleteById(id);
    }
    
    @Override
    public PageResult<Employee> findAll(EmployeeFilter filter, int page, int size, String sort) {
        log.debug("Finding all employees - page: {}, size: {}, sort: {}", page, size, sort);
        
        Specification<EmployeeEntity> spec = specificationBuilder.build(filter);
        Pageable pageable = buildPageable(page, size, sort);
        
        Page<EmployeeEntity> pageResult = jpaRepository.findAll(spec, pageable);
        
        List<Employee> domainEntities = pageResult.getContent().stream()
                .map(EmployeeEntity::toDomain)
                .toList();
        
        return new PageResult<>(
                domainEntities,
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber(),
                pageResult.getSize()
        );
    }
    
    private Pageable buildPageable(int page, int size, String sort) {
        Sort sortObj = parseSort(sort);
        return PageRequest.of(page, size, sortObj);
    }
    
    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "name");
        }
        
        String[] parts = sort.trim().split(",");
        String property = parts[0].trim().isEmpty() ? "name" : parts[0].trim();
        Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        
        return Sort.by(direction, property);
    }
}
