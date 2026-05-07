package com.expensemanager.dto.response;

import java.math.BigDecimal;

public record WeeklyBudgetResponse(
        Integer weekNumber,
        BigDecimal weeklyBudget,
        BigDecimal totalSpent,
        BigDecimal remaining,
        String status
) {}
