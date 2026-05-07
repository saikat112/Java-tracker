package com.expensemanager.repository;

import com.expensemanager.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, UUID> {

    @Query("SELECT c FROM ExpenseCategory c WHERE c.user.id = :userId OR c.isDefault = true ORDER BY c.isDefault DESC, c.name ASC")
    List<ExpenseCategory> findByUserIdOrDefault(UUID userId);

    List<ExpenseCategory> findByUserIdIsNull();
}
