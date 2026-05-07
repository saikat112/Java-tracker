package com.expensemanager.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardResponse(
        BudgetSummary budget,
        WeekSummary currentWeek,
        List<CategorySpend> categoryBreakdown,
        List<WeeklyTrend> weeklyTrends,
        BigDecimal savingsPrediction
) {
    public record BudgetSummary(
            BigDecimal totalBudget,
            BigDecimal fixedExpenses,
            BigDecimal flexibleBudget,
            BigDecimal totalSpent,
            BigDecimal remaining,
            String healthStatus
    ) {}

    public record WeekSummary(
            Integer weekNumber,
            BigDecimal weeklyBudget,
            BigDecimal spent,
            BigDecimal remaining,
            BigDecimal dailySafeSpend,
            Integer daysLeft
    ) {}

    public record CategorySpend(String category, String icon, String color, BigDecimal amount, double percentage) {}

    public record WeeklyTrend(Integer week, BigDecimal budget, BigDecimal spent) {}
}
