package com.expensemanager.dto.response;

import java.util.UUID;

public record GroupMemberResponse(UUID userId, String name, String email, String avatarUrl, String role) {}
