package com.expensemanager.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record GroupExpenseResponse(
        UUID id,
        String title,
        BigDecimal amount,
        String notes,
        LocalDate expenseDate,
        UserResponse paidBy,
        CategoryResponse category,
        String splitType,
        List<SplitDetail> splits
) {
    public record SplitDetail(UUID userId, String userName, BigDecimal shareAmount, boolean isSettled) {}
}
