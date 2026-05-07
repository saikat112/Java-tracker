package com.expensemanager.service.impl;

import com.expensemanager.dto.response.*;
import com.expensemanager.repository.*;
import com.expensemanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final MonthlyBudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final WeeklySummaryRepository weeklySummaryRepository;

    public DashboardResponse getDashboard(UUID userId) {
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();
        int currentWeek = DateUtil.getWeekOfMonth(today);

        var budgetOpt = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        if (budgetOpt.isEmpty()) {
            return new DashboardResponse(null, null, List.of(), List.of(), BigDecimal.ZERO);
        }

        var budget = budgetOpt.get();
        BigDecimal flexible = budget.getFlexibleBudget() != null ? budget.getFlexibleBudget()
                : budget.getTotalBudget().subtract(budget.getFixedExpensesTotal()).subtract(budget.getSavingsGoal());
        BigDecimal totalSpent = expenseRepository.sumByUserAndPeriod(userId, month, year);
        BigDecimal remaining = flexible.subtract(totalSpent);
        String health = remaining.compareTo(BigDecimal.ZERO) < 0 ? "OVER_BUDGET"
                : remaining.compareTo(flexible.multiply(new BigDecimal("0.2"))) < 0 ? "WARNING" : "HEALTHY";

        var budgetSummary = new DashboardResponse.BudgetSummary(
                budget.getTotalBudget(), budget.getFixedExpensesTotal(),
                flexible, totalSpent, remaining, health);

        // Current week
        var weekSummaryOpt = weeklySummaryRepository.findByUserIdAndWeekNumberAndMonthAndYear(userId, currentWeek, month, year);
        DashboardResponse.WeekSummary weekSummary = null;
        if (weekSummaryOpt.isPresent()) {
            var ws = weekSummaryOpt.get();
            BigDecimal weekSpent = expenseRepository.sumByUserAndWeek(userId, currentWeek, month, year);
            BigDecimal weekRemaining = ws.getWeeklyBudget().subtract(weekSpent);
            int daysLeft = DateUtil.getDaysLeftInWeek(today);
            BigDecimal dailySafe = daysLeft > 0 && weekRemaining.compareTo(BigDecimal.ZERO) > 0
                    ? weekRemaining.divide(BigDecimal.valueOf(daysLeft), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            weekSummary = new DashboardResponse.WeekSummary(currentWeek, ws.getWeeklyBudget(), weekSpent, weekRemaining, dailySafe, daysLeft);
        }

        // Category breakdown
        List<Object[]> catData = expenseRepository.sumByCategoryForPeriod(userId, month, year);
        List<DashboardResponse.CategorySpend> categoryBreakdown = catData.stream().map(row -> {
            String catName = row[0] != null ? (String) row[0] : "Others";
            BigDecimal amount = (BigDecimal) row[1];
            double pct = totalSpent.compareTo(BigDecimal.ZERO) > 0
                    ? amount.divide(totalSpent, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue() : 0;
            return new DashboardResponse.CategorySpend(catName, null, null, amount, pct);
        }).toList();

        // Weekly trends
        List<Object[]> weeklyData = expenseRepository.weeklyTotalsForPeriod(userId, month, year);
        var weeklies = weeklySummaryRepository.findByUserIdAndMonthAndYearOrderByWeekNumber(userId, month, year);
        List<DashboardResponse.WeeklyTrend> weeklyTrends = weeklies.stream().map(ws -> {
            BigDecimal spent = weeklyData.stream()
                    .filter(r -> r[0] != null && ((Number) r[0]).intValue() == ws.getWeekNumber())
                    .map(r -> (BigDecimal) r[1]).findFirst().orElse(BigDecimal.ZERO);
            return new DashboardResponse.WeeklyTrend(ws.getWeekNumber(), ws.getWeeklyBudget(), spent);
        }).toList();

        // Savings prediction
        BigDecimal savingsPrediction = remaining.compareTo(BigDecimal.ZERO) > 0
                ? budget.getSavingsGoal().add(remaining) : budget.getSavingsGoal();

        return new DashboardResponse(budgetSummary, weekSummary, categoryBreakdown, weeklyTrends, savingsPrediction);
    }
}
