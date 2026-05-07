package com.expensemanager.service.impl;

import com.expensemanager.dto.request.ExpenseRequest;
import com.expensemanager.dto.response.ExpenseResponse;
import com.expensemanager.dto.response.PageResponse;
import com.expensemanager.entity.Expense;
import com.expensemanager.entity.ExpenseCategory;
import com.expensemanager.entity.User;
import com.expensemanager.exception.AccessDeniedException;
import com.expensemanager.exception.ResourceNotFoundException;
import com.expensemanager.mapper.EntityMapper;
import com.expensemanager.repository.ExpenseCategoryRepository;
import com.expensemanager.repository.ExpenseRepository;
import com.expensemanager.repository.UserRepository;
import com.expensemanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public ExpenseResponse addExpense(UUID userId, ExpenseRequest request) {
        User user = userRepository.getReferenceById(userId);
        ExpenseCategory category = resolveCategory(request.categoryId());

        Expense expense = Expense.builder()
                .user(user)
                .title(request.title())
                .amount(request.amount())
                .notes(request.notes())
                .paymentMethod(request.paymentMethod() != null ? request.paymentMethod() : com.expensemanager.enums.PaymentMethod.CASH)
                .expenseDate(request.expenseDate())
                .weekNumber(DateUtil.getWeekOfMonth(request.expenseDate()))
                .month(request.expenseDate().getMonthValue())
                .year(request.expenseDate().getYear())
                .category(category)
                .build();

        return mapper.toExpenseResponse(expenseRepository.save(expense));
    }

    public ExpenseResponse updateExpense(UUID userId, UUID expenseId, ExpenseRequest request) {
        Expense expense = getExpenseForUser(userId, expenseId);
        expense.setTitle(request.title());
        expense.setAmount(request.amount());
        expense.setNotes(request.notes());
        if (request.paymentMethod() != null) expense.setPaymentMethod(request.paymentMethod());
        expense.setExpenseDate(request.expenseDate());
        expense.setWeekNumber(DateUtil.getWeekOfMonth(request.expenseDate()));
        expense.setMonth(request.expenseDate().getMonthValue());
        expense.setYear(request.expenseDate().getYear());
        expense.setCategory(resolveCategory(request.categoryId()));
        return mapper.toExpenseResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(UUID userId, UUID expenseId) {
        Expense expense = getExpenseForUser(userId, expenseId);
        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public PageResponse<ExpenseResponse> getExpenses(UUID userId, Integer month, Integer year, Pageable pageable) {
        var page = (month != null && year != null)
                ? expenseRepository.findByUserIdAndMonthAndYearOrderByExpenseDateDesc(userId, month, year, pageable)
                : expenseRepository.findByUserIdOrderByExpenseDateDesc(userId, pageable);
        return PageResponse.of(page.map(mapper::toExpenseResponse));
    }

    private Expense getExpenseForUser(UUID userId, UUID expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", expenseId.toString()));
        if (!expense.getUser().getId().equals(userId)) throw new AccessDeniedException("Access denied");
        return expense;
    }

    private ExpenseCategory resolveCategory(String categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(UUID.fromString(categoryId))
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
    }
}
