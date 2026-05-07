package com.expensemanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "weekly_summaries",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "week_number", "month", "year"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WeeklySummary extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private MonthlyBudget budget;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "weekly_budget", nullable = false, precision = 12, scale = 2)
    private BigDecimal weeklyBudget;

    @Column(name = "total_spent", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalSpent = BigDecimal.ZERO;

    @Column(insertable = false, updatable = false, precision = 12, scale = 2)
    private BigDecimal remaining;
}
