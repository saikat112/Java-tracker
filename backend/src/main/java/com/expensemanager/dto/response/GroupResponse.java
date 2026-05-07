package com.expensemanager.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record GroupResponse(
        UUID id,
        String name,
        String description,
        String avatarUrl,
        UserResponse createdBy,
        List<GroupMemberResponse> members,
        BigDecimal totalExpenses,
        int memberCount
) {}
