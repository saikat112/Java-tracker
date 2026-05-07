package com.expensemanager.entity;

import com.expensemanager.enums.RecurringFrequency;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "recurring_expenses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecurringExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ExpenseCategory category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecurringFrequency frequency;

    @Column(name = "next_due_date", nullable = false)
    private LocalDate nextDueDate;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;
}
