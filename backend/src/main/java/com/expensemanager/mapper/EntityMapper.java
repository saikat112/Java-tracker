package com.expensemanager.mapper;

import com.expensemanager.dto.response.*;
import com.expensemanager.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),
                user.getAvatarUrl(), user.getRole().name());
    }

    public CategoryResponse toCategoryResponse(ExpenseCategory cat) {
        if (cat == null) return null;
        return new CategoryResponse(cat.getId(), cat.getName(), cat.getIcon(), cat.getColor());
    }

    public ExpenseResponse toExpenseResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(), expense.getTitle(), expense.getAmount(),
                expense.getNotes(), expense.getPaymentMethod(), expense.getExpenseDate(),
                expense.getWeekNumber(), toCategoryResponse(expense.getCategory())
        );
    }

    public GroupMemberResponse toGroupMemberResponse(GroupMember member) {
        User user = member.getUser();
        return new GroupMemberResponse(user.getId(), user.getName(), user.getEmail(),
                user.getAvatarUrl(), member.getRole().name());
    }

    public FixedExpenseResponse toFixedExpenseResponse(FixedExpense fe) {
        String catName = fe.getCategory() != null ? fe.getCategory().getName() : null;
        return new FixedExpenseResponse(fe.getId(), fe.getName(), fe.getAmount(), catName);
    }
}
