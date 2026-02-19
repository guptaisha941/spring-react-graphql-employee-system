package com.company.employee.infrastructure.persistence.repository;

import com.company.employee.infrastructure.persistence.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * JPA Repository interface for Employee persistence.
 * Infrastructure layer implementation detail.
 */
@Repository
public interface JpaEmployeeRepository extends JpaRepository<EmployeeEntity, Long>, JpaSpecificationExecutor<EmployeeEntity> {
}
