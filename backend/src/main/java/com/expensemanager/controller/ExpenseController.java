package com.expensemanager.controller;

import com.expensemanager.dto.request.ExpenseRequest;
import com.expensemanager.dto.response.ExpenseResponse;
import com.expensemanager.dto.response.PageResponse;
import com.expensemanager.service.impl.ExpenseService;
import com.expensemanager.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Management")
@SecurityRequirement(name = "bearerAuth")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @Operation(summary = "Add expense")
    public ResponseEntity<ExpenseResponse> add(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.addExpense(SecurityUtil.getCurrentUserId(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update expense")
    public ResponseEntity<ExpenseResponse> update(@PathVariable UUID id, @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(SecurityUtil.getCurrentUserId(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete expense")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        expenseService.deleteExpense(SecurityUtil.getCurrentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get expenses with pagination")
    public ResponseEntity<PageResponse<ExpenseResponse>> getAll(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("expenseDate").descending());
        return ResponseEntity.ok(expenseService.getExpenses(SecurityUtil.getCurrentUserId(), month, year, pageable));
    }
}
