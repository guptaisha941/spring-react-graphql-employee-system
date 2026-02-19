package com.company.employee.model;

/**
 * Security roles for JWT authentication and authorization.
 * Used with Spring Security: hasRole("ADMIN") checks for ROLE_ADMIN.
 *
 * - ROLE_ADMIN: Can create/update/delete employees and view all.
 * - ROLE_EMPLOYEE: Can only view employees (GET).
 */
public enum Role {
    ROLE_ADMIN,
    ROLE_EMPLOYEE
}
