package com.expensemanager.repository;

import com.expensemanager.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    Page<Expense> findByUserIdOrderByExpenseDateDesc(UUID userId, Pageable pageable);

    Page<Expense> findByUserIdAndMonthAndYearOrderByExpenseDateDesc(UUID userId, Integer month, Integer year, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.month = :month AND e.year = :year")
    BigDecimal sumByUserAndPeriod(UUID userId, Integer month, Integer year);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.weekNumber = :week AND e.month = :month AND e.year = :year")
    BigDecimal sumByUserAndWeek(UUID userId, Integer week, Integer month, Integer year);

    @Query("SELECT e.category.name, COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.month = :month AND e.year = :year GROUP BY e.category.name")
    List<Object[]> sumByCategoryForPeriod(UUID userId, Integer month, Integer year);

    @Query("SELECT e.weekNumber, COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.month = :month AND e.year = :year GROUP BY e.weekNumber ORDER BY e.weekNumber")
    List<Object[]> weeklyTotalsForPeriod(UUID userId, Integer month, Integer year);

    List<Expense> findByUserIdAndExpenseDateBetween(UUID userId, LocalDate start, LocalDate end);
}
