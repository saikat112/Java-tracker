package com.expensemanager.service.impl;

import com.expensemanager.dto.request.BudgetRequest;
import com.expensemanager.dto.response.*;
import com.expensemanager.entity.*;
import com.expensemanager.exception.BadRequestException;
import com.expensemanager.exception.ResourceNotFoundException;
import com.expensemanager.mapper.EntityMapper;
import com.expensemanager.repository.*;
import com.expensemanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetService {

    private final MonthlyBudgetRepository budgetRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final WeeklySummaryRepository weeklySummaryRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public BudgetResponse createOrUpdateBudget(UUID userId, BudgetRequest request) {
        User user = userRepository.getReferenceById(userId);

        MonthlyBudget budget = budgetRepository
                .findByUserIdAndMonthAndYear(userId, request.month(), request.year())
                .orElse(MonthlyBudget.builder().user(user).month(request.month()).year(request.year()).build());

        BigDecimal savingsGoal = request.savingsGoal() != null ? request.savingsGoal() : BigDecimal.ZERO;
        BigDecimal fixedTotal = request.fixedExpenses() != null
                ? request.fixedExpenses().stream().map(BudgetRequest.FixedExpenseItem::amount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                : BigDecimal.ZERO;

        if (fixedTotal.add(savingsGoal).compareTo(request.totalBudget()) >= 0) {
            throw new BadRequestException("Fixed expenses + savings goal must be less than total budget");
        }

        budget.setTotalBudget(request.totalBudget());
        budget.setSavingsGoal(savingsGoal);
        budget.setFixedExpensesTotal(fixedTotal);

        if (budget.getFixedExpenses() != null) budget.getFixedExpenses().clear();
        budget = budgetRepository.save(budget);

        if (request.fixedExpenses() != null) {
            List<FixedExpense> fixedExpenses = new ArrayList<>();
            for (BudgetRequest.FixedExpenseItem item : request.fixedExpenses()) {
                ExpenseCategory cat = item.categoryId() != null
                        ? categoryRepository.findById(UUID.fromString(item.categoryId())).orElse(null) : null;
                fixedExpenses.add(FixedExpense.builder()
                        .user(user).budget(budget).name(item.name()).amount(item.amount()).category(cat).build());
            }
            budget.setFixedExpenses(fixedExpenses);
            budget = budgetRepository.save(budget);
        }

        generateWeeklySummaries(budget, userId);
        return toBudgetResponse(budget, userId);
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudget(UUID userId, Integer month, Integer year) {
        MonthlyBudget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found for " + month + "/" + year));
        return toBudgetResponse(budget, userId);
    }

    private void generateWeeklySummaries(MonthlyBudget budget, UUID userId) {
        int weeksInMonth = DateUtil.getWeeksInMonth(budget.getMonth(), budget.getYear());
        BigDecimal weeklyBudget = budget.getFlexibleBudget() != null
                ? budget.getFlexibleBudget().divide(BigDecimal.valueOf(weeksInMonth), 2, RoundingMode.HALF_UP)
                : budget.getTotalBudget().subtract(budget.getFixedExpensesTotal()).subtract(budget.getSavingsGoal())
                        .divide(BigDecimal.valueOf(weeksInMonth), 2, RoundingMode.HALF_UP);

        User user = userRepository.getReferenceById(userId);
        for (int week = 1; week <= weeksInMonth; week++) {
            int finalWeek = week;
            WeeklySummary summary = weeklySummaryRepository
                    .findByUserIdAndWeekNumberAndMonthAndYear(userId, week, budget.getMonth(), budget.getYear())
                    .orElse(WeeklySummary.builder().user(user).budget(budget)
                            .weekNumber(finalWeek).month(budget.getMonth()).year(budget.getYear()).build());
            summary.setWeeklyBudget(weeklyBudget);
            weeklySummaryRepository.save(summary);
        }
    }

    private BudgetResponse toBudgetResponse(MonthlyBudget budget, UUID userId) {
        BigDecimal totalSpent = expenseRepository.sumByUserAndPeriod(userId, budget.getMonth(), budget.getYear());
        BigDecimal flexible = budget.getFlexibleBudget() != null ? budget.getFlexibleBudget()
                : budget.getTotalBudget().subtract(budget.getFixedExpensesTotal()).subtract(budget.getSavingsGoal());

        List<FixedExpenseResponse> fixedList = budget.getFixedExpenses() != null
                ? budget.getFixedExpenses().stream().map(mapper::toFixedExpenseResponse).toList()
                : List.of();

        List<WeeklySummary> weeklies = weeklySummaryRepository
                .findByUserIdAndMonthAndYearOrderByWeekNumber(userId, budget.getMonth(), budget.getYear());

        List<WeeklyBudgetResponse> weeklyBreakdown = weeklies.stream().map(w -> {
            BigDecimal spent = expenseRepository.sumByUserAndWeek(userId, w.getWeekNumber(), budget.getMonth(), budget.getYear());
            BigDecimal rem = w.getWeeklyBudget().subtract(spent);
            String status = rem.compareTo(BigDecimal.ZERO) < 0 ? "OVER" : rem.compareTo(w.getWeeklyBudget().multiply(new BigDecimal("0.2"))) < 0 ? "WARNING" : "HEALTHY";
            return new WeeklyBudgetResponse(w.getWeekNumber(), w.getWeeklyBudget(), spent, rem, status);
        }).toList();

        return new BudgetResponse(budget.getId(), budget.getMonth(), budget.getYear(),
                budget.getTotalBudget(), budget.getFixedExpensesTotal(), budget.getSavingsGoal(),
                flexible, totalSpent, flexible.subtract(totalSpent), fixedList, weeklyBreakdown);
    }
}
