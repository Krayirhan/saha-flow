package com.sahaflow.identity.service;

import com.sahaflow.identity.domain.User;
import com.sahaflow.identity.repository.UserRepository;
import com.sahaflow.shared.pagination.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User findById(String tenantId, String userId) {
        return userRepository.findByTenantIdAndId(tenantId, userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    @Transactional(readOnly = true)
    public Page<User> findAll(String tenantId, PageRequest pageRequest) {
        return userRepository.findAll(pageRequest.toSpringPageRequest());
    }

    @Transactional(readOnly = true)
    public User findByEmail(String tenantId, String email) {
        return userRepository.findByTenantIdAndEmailIgnoreCase(tenantId, email)
            .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    @Transactional
    public User updateProfile(String tenantId, String userId, String firstName, String lastName, String phone) {
        var user = findById(tenantId, userId);
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (phone != null) user.setPhone(phone);
        return userRepository.save(user);
    }

    @Transactional
    public void disableUser(String tenantId, String userId) {
        var user = findById(tenantId, userId);
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Transactional
    public void enableUser(String tenantId, String userId) {
        var user = findById(tenantId, userId);
        user.setEnabled(true);
        userRepository.save(user);
    }

    public long countByTenant(String tenantId) {
        return userRepository.countByTenantId(tenantId);
    }

    public boolean exists(String tenantId, String email) {
        return userRepository.existsByTenantIdAndEmailIgnoreCase(tenantId, email);
    }
}
