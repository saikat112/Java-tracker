package com.expensemanager.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record FixedExpenseResponse(UUID id, String name, BigDecimal amount, String categoryName) {}
