package com.company.employee.presentation.dto;

import lombok.Builder;

import java.util.List;

/**
 * Presentation DTO for paginated responses.
 */
@Builder
public record PageResponse<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {
}
