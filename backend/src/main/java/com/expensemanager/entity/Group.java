package com.expensemanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "groups")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Group extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupMember> members;
}
