package com.expensemanager.dto.response;

import java.util.UUID;

public record CategoryResponse(UUID id, String name, String icon, String color) {}
