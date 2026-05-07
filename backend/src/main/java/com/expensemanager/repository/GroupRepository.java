package com.expensemanager.repository;

import com.expensemanager.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {

    @Query("SELECT g FROM Group g JOIN g.members m WHERE m.user.id = :userId AND g.isActive = true")
    List<Group> findGroupsByUserId(UUID userId);
}
