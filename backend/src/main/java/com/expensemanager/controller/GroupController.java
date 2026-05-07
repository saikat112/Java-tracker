package com.expensemanager.controller;

import com.expensemanager.dto.request.GroupExpenseRequest;
import com.expensemanager.dto.request.GroupRequest;
import com.expensemanager.dto.response.*;
import com.expensemanager.service.impl.GroupService;
import com.expensemanager.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
@Tag(name = "Group Management")
@SecurityRequirement(name = "bearerAuth")
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    @Operation(summary = "Create group")
    public ResponseEntity<GroupResponse> create(@Valid @RequestBody GroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupService.createGroup(SecurityUtil.getCurrentUserId(), request));
    }

    @GetMapping
    @Operation(summary = "Get user's groups")
    public ResponseEntity<List<GroupResponse>> getGroups() {
        return ResponseEntity.ok(groupService.getUserGroups(SecurityUtil.getCurrentUserId()));
    }

    @GetMapping("/{groupId}")
    @Operation(summary = "Get group details")
    public ResponseEntity<GroupResponse> getGroup(@PathVariable UUID groupId) {
        return ResponseEntity.ok(groupService.getGroup(SecurityUtil.getCurrentUserId(), groupId));
    }

    @PostMapping("/{groupId}/members")
    @Operation(summary = "Add member to group")
    public ResponseEntity<Void> addMember(@PathVariable UUID groupId, @RequestBody Map<String, String> body) {
        groupService.addMember(SecurityUtil.getCurrentUserId(), groupId, body.get("email"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{groupId}/members/{memberId}")
    @Operation(summary = "Remove member from group")
    public ResponseEntity<Void> removeMember(@PathVariable UUID groupId, @PathVariable UUID memberId) {
        groupService.removeMember(SecurityUtil.getCurrentUserId(), groupId, memberId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{groupId}/expenses")
    @Operation(summary = "Add group expense")
    public ResponseEntity<GroupExpenseResponse> addExpense(
            @PathVariable UUID groupId, @Valid @RequestBody GroupExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupService.addGroupExpense(SecurityUtil.getCurrentUserId(), groupId, request));
    }

    @GetMapping("/{groupId}/expenses")
    @Operation(summary = "Get group expenses")
    public ResponseEntity<PageResponse<GroupExpenseResponse>> getExpenses(
            @PathVariable UUID groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(groupService.getGroupExpenses(
                SecurityUtil.getCurrentUserId(), groupId, PageRequest.of(page, size)));
    }

    @GetMapping("/{groupId}/settlements")
    @Operation(summary = "Get settlement summary")
    public ResponseEntity<SettlementSummaryResponse> getSettlements(@PathVariable UUID groupId) {
        return ResponseEntity.ok(groupService.getSettlementSummary(SecurityUtil.getCurrentUserId(), groupId));
    }

    @PostMapping("/{groupId}/settlements")
    @Operation(summary = "Record a settlement payment")
    public ResponseEntity<Void> recordSettlement(@PathVariable UUID groupId, @RequestBody Map<String, Object> body) {
        groupService.recordSettlement(
                SecurityUtil.getCurrentUserId(), groupId,
                UUID.fromString((String) body.get("receiverId")),
                new BigDecimal(body.get("amount").toString()),
                (String) body.get("notes"));
        return ResponseEntity.ok().build();
    }
}
