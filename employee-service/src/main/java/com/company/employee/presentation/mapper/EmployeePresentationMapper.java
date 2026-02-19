package com.company.employee.presentation.mapper;

import com.company.employee.application.dto.EmployeeCommand;
import com.company.employee.application.dto.EmployeeDto;
import com.company.employee.application.dto.PageDto;
import com.company.employee.presentation.dto.EmployeeRequest;
import com.company.employee.presentation.dto.EmployeeResponse;
import com.company.employee.presentation.dto.PageResponse;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapper between presentation layer DTOs and application layer DTOs.
 */
@Component
public class EmployeePresentationMapper {
    
    public EmployeeCommand toCommand(EmployeeRequest request) {
        if (request == null) {
            return null;
        }
        
        return new EmployeeCommand(
                request.name(),
                request.age(),
                request.employeeClass(),
                request.subjects(),
                request.attendance(),
                request.role()
        );
    }
    
    public EmployeeResponse toResponse(EmployeeDto dto) {
        if (dto == null) {
            return null;
        }
        
        return new EmployeeResponse(
                dto.id(),
                dto.name(),
                dto.age(),
                dto.employeeClass(),
                dto.subjects(),
                dto.attendance(),
                dto.role(),
                dto.createdAt(),
                dto.updatedAt()
        );
    }
    
    public PageResponse<EmployeeResponse> toPageResponse(PageDto<EmployeeDto> pageDto) {
        if (pageDto == null) {
            return null;
        }
        
        List<EmployeeResponse> content = pageDto.content().stream()
                .map(this::toResponse)
                .toList();
        
        return PageResponse.<EmployeeResponse>builder()
                .content(content)
                .totalElements(pageDto.totalElements())
                .totalPages(pageDto.totalPages())
                .currentPage(pageDto.currentPage())
                .pageSize(pageDto.pageSize())
                .build();
    }
}
