package com.sahaflow.identity;

import com.sahaflow.identity.domain.User;
import com.sahaflow.identity.repository.UserRepository;
import com.sahaflow.identity.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user-1");
        testUser.setTenantId("tenant-1");
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEnabled(true);
    }

    @Test
    @DisplayName("findById - should return user when found")
    void findById_shouldReturnUser() {
        when(userRepository.findByTenantIdAndId("tenant-1", "user-1"))
            .thenReturn(Optional.of(testUser));

        var result = userService.findById("tenant-1", "user-1");

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("findById - should throw when user not found")
    void findById_shouldThrowWhenNotFound() {
        when(userRepository.findByTenantIdAndId(anyString(), anyString()))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById("tenant-1", "user-404"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("disableUser - should set enabled to false")
    void disableUser_shouldSetEnabledToFalse() {
        when(userRepository.findByTenantIdAndId("tenant-1", "user-1"))
            .thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.disableUser("tenant-1", "user-1");

        assertThat(testUser.isEnabled()).isFalse();
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("updateProfile - should update name and phone")
    void updateProfile_shouldUpdateFields() {
        when(userRepository.findByTenantIdAndId("tenant-1", "user-1"))
            .thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        var result = userService.updateProfile("tenant-1", "user-1",
            "Updated", "Name", "555-1234");

        assertThat(result.getFirstName()).isEqualTo("Updated");
        assertThat(result.getLastName()).isEqualTo("Name");
        assertThat(result.getPhone()).isEqualTo("555-1234");
    }
}
