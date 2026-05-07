package com.expensemanager.dto.request;

import com.expensemanager.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotBlank String title,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        String notes,
        PaymentMethod paymentMethod,
        @NotNull LocalDate expenseDate,
        String categoryId
) {}
