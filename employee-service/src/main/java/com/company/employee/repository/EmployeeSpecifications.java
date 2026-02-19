package com.company.employee.repository;

import com.company.employee.model.Employee;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;


public final class EmployeeSpecifications {

    private EmployeeSpecifications() {
    }

    /**
     * Specification that filters by name (contains, case-insensitive) when name is not blank.
     */
    public static Specification<Employee> withNameContaining(String name) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(name)) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("name")), "%" + name.trim().toLowerCase() + "%");
        };
    }

    /**
     * Specification that filters by employeeClass (contains, case-insensitive) when employeeClass is not blank.
     */
    public static Specification<Employee> withEmployeeClass(String employeeClass) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(employeeClass)) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("employeeClass")), "%" + employeeClass.trim().toLowerCase() + "%");
        };
    }

    /**
     * Combined specification for optional name and employeeClass filters.
     */
    public static Specification<Employee> withFilters(String name, String employeeClass) {
        return Specification.where(withNameContaining(name)).and(withEmployeeClass(employeeClass));
    }
}
