package com.expensemanager.controller;

import com.expensemanager.dto.request.BudgetRequest;
import com.expensemanager.dto.response.BudgetResponse;
import com.expensemanager.service.impl.BudgetService;
import com.expensemanager.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget Management")
@SecurityRequirement(name = "bearerAuth")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @Operation(summary = "Create or update monthly budget")
    public ResponseEntity<BudgetResponse> createOrUpdate(@Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.createOrUpdateBudget(SecurityUtil.getCurrentUserId(), request));
    }

    @GetMapping("/{year}/{month}")
    @Operation(summary = "Get budget for specific month")
    public ResponseEntity<BudgetResponse> getBudget(@PathVariable Integer year, @PathVariable Integer month) {
        return ResponseEntity.ok(budgetService.getBudget(SecurityUtil.getCurrentUserId(), month, year));
    }
}
