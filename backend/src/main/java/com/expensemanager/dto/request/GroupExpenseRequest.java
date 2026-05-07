package com.expensemanager.dto.request;

import com.expensemanager.enums.SplitType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record GroupExpenseRequest(
        @NotBlank String title,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        String notes,
        @NotNull LocalDate expenseDate,
        String categoryId,
        SplitType splitType,
        Map<String, BigDecimal> customSplits
) {}
