package com.company.employee.application.dto;

import lombok.Builder;

import java.util.List;

/**
 * Generic pagination DTO.
 */
@Builder
public record PageDto<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {
}
