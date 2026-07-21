package com.sahaflow.identity.web;

import com.sahaflow.identity.domain.User;
import com.sahaflow.identity.service.UserService;
import com.sahaflow.shared.tenant.TenantContextHolder;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        var tenantId = TenantContextHolder.getTenantId();
        var userId = TenantContextHolder.getUserId();
        var user = userService.findById(tenantId, userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me/profile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        var tenantId = TenantContextHolder.getTenantId();
        var userId = TenantContextHolder.getUserId();
        var user = userService.updateProfile(tenantId, userId,
            request.firstName(), request.lastName(), request.phone());
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<User>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var tenantId = TenantContextHolder.getTenantId();
        var pageRequest = new com.sahaflow.shared.pagination.PageRequest(page, size, "createdAt", "DESC");
        var result = userService.findAll(tenantId, pageRequest);
        return ResponseEntity.ok(result.getContent());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        var tenantId = TenantContextHolder.getTenantId();
        var user = userService.findById(tenantId, userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/{userId}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> disableUser(@PathVariable String userId) {
        var tenantId = TenantContextHolder.getTenantId();
        userService.disableUser(tenantId, userId);
        return ResponseEntity.ok(Map.of("status", "disabled"));
    }

    @PostMapping("/{userId}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> enableUser(@PathVariable String userId) {
        var tenantId = TenantContextHolder.getTenantId();
        userService.enableUser(tenantId, userId);
        return ResponseEntity.ok(Map.of("status", "enabled"));
    }

    public record UpdateProfileRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        String phone
    ) {}
}
