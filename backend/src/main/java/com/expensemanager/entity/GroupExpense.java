package com.expensemanager.entity;

import com.expensemanager.enums.SplitType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "group_expenses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GroupExpense extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paid_by", nullable = false)
    private User paidBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ExpenseCategory category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "split_type")
    @Builder.Default
    private SplitType splitType = SplitType.EQUAL;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupExpenseSplit> splits;
}
