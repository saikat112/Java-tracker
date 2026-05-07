package com.expensemanager.repository;

import com.expensemanager.entity.GroupExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface GroupExpenseSplitRepository extends JpaRepository<GroupExpenseSplit, UUID> {

    List<GroupExpenseSplit> findByExpenseId(UUID expenseId);

    @Query("SELECT COALESCE(SUM(s.shareAmount), 0) FROM GroupExpenseSplit s WHERE s.user.id = :userId AND s.expense.group.id = :groupId AND s.isSettled = false")
    BigDecimal sumUnsettledShareByUserInGroup(UUID userId, UUID groupId);
}
