package com.expensemanager.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SettlementSummaryResponse(
        UUID groupId,
        String groupName,
        BigDecimal totalExpenses,
        List<MemberBalance> balances,
        List<SettlementTransaction> suggestedSettlements
) {
    public record MemberBalance(UUID userId, String name, BigDecimal totalPaid, BigDecimal equalShare, BigDecimal balance) {}
    public record SettlementTransaction(UUID payerId, String payerName, UUID receiverId, String receiverName, BigDecimal amount) {}
}
