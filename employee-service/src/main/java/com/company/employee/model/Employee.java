package com.company.employee.model;

import javax.persistence.*;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "employees",
    indexes = {
        @Index(name = "idx_employee_name", columnList = "name"),
        @Index(name = "idx_employee_class", columnList = "employee_class")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "age")
    private Integer age;

    @Column(name = "employee_class", length = 100)
    private String employeeClass;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "employee_subjects", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "subject")
    @Builder.Default
    private List<String> subjects = new ArrayList<>();

    @Column(name = "attendance")
    private Integer attendance;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 20)
    private EmployeeRole role;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
