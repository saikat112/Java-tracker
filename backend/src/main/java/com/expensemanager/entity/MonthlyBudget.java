package com.expensemanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "monthly_budgets",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "month", "year"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MonthlyBudget extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "total_budget", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalBudget;

    @Column(name = "fixed_expenses_total", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal fixedExpensesTotal = BigDecimal.ZERO;

    @Column(name = "savings_goal", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal savingsGoal = BigDecimal.ZERO;

    @Column(name = "flexible_budget", insertable = false, updatable = false, precision = 12, scale = 2)
    private BigDecimal flexibleBudget;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FixedExpense> fixedExpenses;
}
