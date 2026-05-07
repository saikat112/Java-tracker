package com.expensemanager.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record BudgetResponse(
        UUID id,
        Integer month,
        Integer year,
        BigDecimal totalBudget,
        BigDecimal fixedExpensesTotal,
        BigDecimal savingsGoal,
        BigDecimal flexibleBudget,
        BigDecimal totalSpent,
        BigDecimal remainingBudget,
        List<FixedExpenseResponse> fixedExpenses,
        List<WeeklyBudgetResponse> weeklyBreakdown
) {}
