package com.expensemanager.service.impl;

import com.expensemanager.dto.request.GroupExpenseRequest;
import com.expensemanager.dto.request.GroupRequest;
import com.expensemanager.dto.response.*;
import com.expensemanager.entity.*;
import com.expensemanager.enums.GroupRole;
import com.expensemanager.enums.PaymentMethod;
import com.expensemanager.enums.SplitType;
import com.expensemanager.exception.AccessDeniedException;
import com.expensemanager.exception.BadRequestException;
import com.expensemanager.exception.ResourceNotFoundException;
import com.expensemanager.mapper.EntityMapper;
import com.expensemanager.repository.*;
import com.expensemanager.enums.PaymentMethod;
import com.expensemanager.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupExpenseRepository groupExpenseRepository;
    private final GroupExpenseSplitRepository splitRepository;
    private final SettlementRepository settlementRepository;
    private final UserRepository userRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final EntityMapper mapper;

    public GroupResponse createGroup(UUID userId, GroupRequest request) {
        User creator = userRepository.findById(userId).orElseThrow();
        Group group = Group.builder().name(request.name()).description(request.description()).createdBy(creator).build();
        group = groupRepository.save(group);

        GroupMember adminMember = GroupMember.builder().group(group).user(creator).role(GroupRole.ADMIN).build();
        groupMemberRepository.save(adminMember);

        if (request.memberEmails() != null) {
            final Group savedGroup = group;
            for (String email : request.memberEmails()) {
                userRepository.findByEmail(email).ifPresent(member -> {
                    if (!groupMemberRepository.existsByGroupIdAndUserId(savedGroup.getId(), member.getId())) {
                        groupMemberRepository.save(GroupMember.builder().group(savedGroup).user(member).role(GroupRole.MEMBER).build());
                    }
                });
            }
        }

        return toGroupResponse(groupRepository.findById(group.getId()).orElseThrow(), userId);
    }

    @Transactional(readOnly = true)
    public List<GroupResponse> getUserGroups(UUID userId) {
        return groupRepository.findGroupsByUserId(userId).stream()
                .map(g -> toGroupResponse(g, userId)).toList();
    }

    @Transactional(readOnly = true)
    public GroupResponse getGroup(UUID userId, UUID groupId) {
        Group group = getGroupForMember(userId, groupId);
        return toGroupResponse(group, userId);
    }

    public void addMember(UUID userId, UUID groupId, String memberEmail) {
        assertGroupAdmin(userId, groupId);
        User member = userRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + memberEmail));
        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, member.getId())) {
            throw new BadRequestException("User is already a member");
        }
        Group group = groupRepository.getReferenceById(groupId);
        groupMemberRepository.save(GroupMember.builder().group(group).user(member).role(GroupRole.MEMBER).build());
    }

    public void removeMember(UUID userId, UUID groupId, UUID memberId) {
        assertGroupAdmin(userId, groupId);
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        groupMemberRepository.delete(member);
    }

    public GroupExpenseResponse addGroupExpense(UUID userId, UUID groupId, GroupExpenseRequest request) {
        Group group = getGroupForMember(userId, groupId);
        User paidBy = userRepository.getReferenceById(userId);
        ExpenseCategory category = request.categoryId() != null
                ? categoryRepository.findById(UUID.fromString(request.categoryId())).orElse(null) : null;

        GroupExpense expense = GroupExpense.builder()
                .group(group).paidBy(paidBy).title(request.title()).amount(request.amount())
                .notes(request.notes()).expenseDate(request.expenseDate()).category(category)
                .splitType(request.splitType() != null ? request.splitType() : SplitType.EQUAL)
                .build();
        expense = groupExpenseRepository.save(expense);

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        createSplits(expense, members, request);

        // Auto-create personal expense for the payer
        try {
            String notes = String.format("[Group: %s] %s", group.getName(),
                    request.notes() != null ? request.notes() : "").trim();
            Expense personalExpense = Expense.builder()
                    .user(paidBy)
                    .title(request.title())
                    .amount(request.amount())
                    .notes(notes)
                    .paymentMethod(PaymentMethod.CASH)
                    .expenseDate(request.expenseDate())
                    .weekNumber(com.expensemanager.util.DateUtil.getWeekOfMonth(request.expenseDate()))
                    .month(request.expenseDate().getMonthValue())
                    .year(request.expenseDate().getYear())
                    .category(category)
                    .build();
            expenseRepository.save(personalExpense);
        } catch (Exception e) {
            log.warn("Could not create personal expense for group payment: {}", e.getMessage());
        }

        return toGroupExpenseResponse(groupExpenseRepository.findById(expense.getId()).orElseThrow());
    }

    @Transactional(readOnly = true)
    public PageResponse<GroupExpenseResponse> getGroupExpenses(UUID userId, UUID groupId, Pageable pageable) {
        getGroupForMember(userId, groupId);
        return PageResponse.of(groupExpenseRepository.findByGroupIdOrderByExpenseDateDesc(groupId, pageable)
                .map(this::toGroupExpenseResponse));
    }

    @Transactional(readOnly = true)
    public SettlementSummaryResponse getSettlementSummary(UUID userId, UUID groupId) {
        Group group = getGroupForMember(userId, groupId);
        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        BigDecimal totalExpenses = groupExpenseRepository.sumTotalByGroupId(groupId);
        int memberCount = members.size();
        BigDecimal equalShare = memberCount > 0
                ? totalExpenses.divide(BigDecimal.valueOf(memberCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<SettlementSummaryResponse.MemberBalance> balances = members.stream().map(m -> {
            BigDecimal paid = groupExpenseRepository.sumPaidByUserInGroup(groupId, m.getUser().getId());
            BigDecimal balance = paid.subtract(equalShare);
            return new SettlementSummaryResponse.MemberBalance(
                    m.getUser().getId(), m.getUser().getName(), paid, equalShare, balance);
        }).toList();

        List<SettlementSummaryResponse.SettlementTransaction> transactions = calculateSettlements(balances);

        return new SettlementSummaryResponse(groupId, group.getName(), totalExpenses, balances, transactions);
    }

    public void recordSettlement(UUID userId, UUID groupId, UUID receiverId, BigDecimal amount, String notes) {
        getGroupForMember(userId, groupId);
        Group group = groupRepository.getReferenceById(groupId);
        User payer = userRepository.getReferenceById(userId);
        User receiver = userRepository.getReferenceById(receiverId);
        settlementRepository.save(Settlement.builder()
                .group(group).payer(payer).receiver(receiver).amount(amount).notes(notes).build());
    }

    private void createSplits(GroupExpense expense, List<GroupMember> members, GroupExpenseRequest request) {
        if (expense.getSplitType() == SplitType.EQUAL) {
            BigDecimal share = expense.getAmount().divide(BigDecimal.valueOf(members.size()), 2, RoundingMode.HALF_UP);
            members.forEach(m -> splitRepository.save(GroupExpenseSplit.builder()
                    .expense(expense).user(m.getUser()).shareAmount(share).build()));
        } else if (request.customSplits() != null) {
            request.customSplits().forEach((uid, amount) ->
                    userRepository.findById(UUID.fromString(uid)).ifPresent(user ->
                            splitRepository.save(GroupExpenseSplit.builder()
                                    .expense(expense).user(user).shareAmount(amount).build())));
        }
    }

    private List<SettlementSummaryResponse.SettlementTransaction> calculateSettlements(
            List<SettlementSummaryResponse.MemberBalance> balances) {
        List<SettlementSummaryResponse.SettlementTransaction> transactions = new ArrayList<>();
        List<SettlementSummaryResponse.MemberBalance> debtors = new ArrayList<>(
                balances.stream().filter(b -> b.balance().compareTo(BigDecimal.ZERO) < 0).toList());
        List<SettlementSummaryResponse.MemberBalance> creditors = new ArrayList<>(
                balances.stream().filter(b -> b.balance().compareTo(BigDecimal.ZERO) > 0).toList());

        int i = 0, j = 0;
        BigDecimal[] debtAmounts = debtors.stream().map(b -> b.balance().negate()).toArray(BigDecimal[]::new);
        BigDecimal[] creditAmounts = creditors.stream().map(SettlementSummaryResponse.MemberBalance::balance).toArray(BigDecimal[]::new);

        while (i < debtors.size() && j < creditors.size()) {
            BigDecimal settle = debtAmounts[i].min(creditAmounts[j]);
            transactions.add(new SettlementSummaryResponse.SettlementTransaction(
                    debtors.get(i).userId(), debtors.get(i).name(),
                    creditors.get(j).userId(), creditors.get(j).name(), settle));
            debtAmounts[i] = debtAmounts[i].subtract(settle);
            creditAmounts[j] = creditAmounts[j].subtract(settle);
            if (debtAmounts[i].compareTo(BigDecimal.ZERO) == 0) i++;
            if (creditAmounts[j].compareTo(BigDecimal.ZERO) == 0) j++;
        }
        return transactions;
    }

    private Group getGroupForMember(UUID userId, UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId.toString()));
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new AccessDeniedException("You are not a member of this group");
        }
        return group;
    }

    private void assertGroupAdmin(UUID userId, UUID groupId) {
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new AccessDeniedException("Not a group member"));
        if (member.getRole() != GroupRole.ADMIN) throw new AccessDeniedException("Admin access required");
    }

    private GroupResponse toGroupResponse(Group group, UUID currentUserId) {
        List<GroupMemberResponse> members = group.getMembers() != null
                ? group.getMembers().stream().map(mapper::toGroupMemberResponse).toList() : List.of();
        BigDecimal total = groupExpenseRepository.sumTotalByGroupId(group.getId());
        return new GroupResponse(group.getId(), group.getName(), group.getDescription(),
                group.getAvatarUrl(), mapper.toUserResponse(group.getCreatedBy()),
                members, total, members.size());
    }

    private GroupExpenseResponse toGroupExpenseResponse(GroupExpense expense) {
        List<GroupExpenseResponse.SplitDetail> splits = expense.getSplits() != null
                ? expense.getSplits().stream().map(s -> new GroupExpenseResponse.SplitDetail(
                        s.getUser().getId(), s.getUser().getName(), s.getShareAmount(), s.isSettled())).toList()
                : List.of();
        return new GroupExpenseResponse(expense.getId(), expense.getTitle(), expense.getAmount(),
                expense.getNotes(), expense.getExpenseDate(), mapper.toUserResponse(expense.getPaidBy()),
                mapper.toCategoryResponse(expense.getCategory()), expense.getSplitType().name(), splits);
    }
}
