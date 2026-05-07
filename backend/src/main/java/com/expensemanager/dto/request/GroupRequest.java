package com.expensemanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record GroupRequest(
        @NotBlank @Size(min = 2, max = 100) String name,
        String description,
        List<String> memberEmails
) {}
