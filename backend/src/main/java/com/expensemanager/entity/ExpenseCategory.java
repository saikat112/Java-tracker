package com.expensemanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "expense_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpenseCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    private String icon;
    private String color;

    @Column(name = "is_default")
    @Builder.Default
    private boolean isDefault = false;
}
