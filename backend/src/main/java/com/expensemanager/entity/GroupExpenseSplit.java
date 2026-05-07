package com.expensemanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "group_expense_splits",
       uniqueConstraints = @UniqueConstraint(columnNames = {"expense_id", "user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GroupExpenseSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private GroupExpense expense;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "share_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal shareAmount;

    @Column(name = "is_settled")
    @Builder.Default
    private boolean isSettled = false;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;
}
