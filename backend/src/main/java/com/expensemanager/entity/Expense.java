package com.expensemanager.entity;

import com.expensemanager.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense extends BaseEntity {

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

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.CASH;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Column(name = "week_number")
    private Integer weekNumber;

    @Column
    private Integer month;

    @Column
    private Integer year;

    @Column(name = "is_recurring")
    @Builder.Default
    private boolean isRecurring = false;
}
