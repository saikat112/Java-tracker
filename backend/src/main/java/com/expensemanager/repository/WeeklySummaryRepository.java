package com.expensemanager.repository;

import com.expensemanager.entity.WeeklySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeeklySummaryRepository extends JpaRepository<WeeklySummary, UUID> {
    Optional<WeeklySummary> findByUserIdAndWeekNumberAndMonthAndYear(UUID userId, Integer weekNumber, Integer month, Integer year);
    List<WeeklySummary> findByUserIdAndMonthAndYearOrderByWeekNumber(UUID userId, Integer month, Integer year);
}
