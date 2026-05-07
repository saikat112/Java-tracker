package com.expensemanager.dto.response;

import com.expensemanager.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ExpenseResponse(
        UUID id,
        String title,
        BigDecimal amount,
        String notes,
        PaymentMethod paymentMethod,
        LocalDate expenseDate,
        Integer weekNumber,
        CategoryResponse category
) {}
