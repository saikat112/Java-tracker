package com.expensemanager.repository;

import com.expensemanager.entity.GroupExpense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface GroupExpenseRepository extends JpaRepository<GroupExpense, UUID> {

    Page<GroupExpense> findByGroupIdOrderByExpenseDateDesc(UUID groupId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM GroupExpense e WHERE e.group.id = :groupId")
    BigDecimal sumTotalByGroupId(UUID groupId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM GroupExpense e WHERE e.group.id = :groupId AND e.paidBy.id = :userId")
    BigDecimal sumPaidByUserInGroup(UUID groupId, UUID userId);
}
