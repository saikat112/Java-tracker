package com.expensemanager.repository;

import com.expensemanager.entity.MonthlyBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, UUID> {
    Optional<MonthlyBudget> findByUserIdAndMonthAndYear(UUID userId, Integer month, Integer year);
    boolean existsByUserIdAndMonthAndYear(UUID userId, Integer month, Integer year);
}
