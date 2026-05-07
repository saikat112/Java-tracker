package com.expensemanager.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record BudgetRequest(
        @NotNull @Min(1) @Max(12) Integer month,
        @NotNull @Min(2020) Integer year,
        @NotNull @DecimalMin("0.01") BigDecimal totalBudget,
        @DecimalMin("0") BigDecimal savingsGoal,
        List<FixedExpenseItem> fixedExpenses
) {
    public record FixedExpenseItem(
            String name,
            @NotNull @DecimalMin("0.01") BigDecimal amount,
            String categoryId
    ) {}
}
