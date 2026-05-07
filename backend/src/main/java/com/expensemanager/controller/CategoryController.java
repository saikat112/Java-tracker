package com.expensemanager.controller;

import com.expensemanager.dto.response.CategoryResponse;
import com.expensemanager.mapper.EntityMapper;
import com.expensemanager.repository.ExpenseCategoryRepository;
import com.expensemanager.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories")
public class CategoryController {

    private final ExpenseCategoryRepository categoryRepository;
    private final EntityMapper mapper;

    @GetMapping
    @Operation(summary = "Get all categories for current user")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        return ResponseEntity.ok(
                categoryRepository.findByUserIdOrDefault(SecurityUtil.getCurrentUserId())
                        .stream().map(mapper::toCategoryResponse).toList());
    }

    @GetMapping("/defaults")
    @Operation(summary = "Get default categories")
    public ResponseEntity<List<CategoryResponse>> getDefaults() {
        return ResponseEntity.ok(
                categoryRepository.findByUserIdIsNull()
                        .stream().map(mapper::toCategoryResponse).toList());
    }
}
