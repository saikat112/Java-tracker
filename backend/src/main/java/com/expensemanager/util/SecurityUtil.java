package com.expensemanager.util;

import com.expensemanager.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {

    private SecurityUtil() {}

    public static User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static java.util.UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
