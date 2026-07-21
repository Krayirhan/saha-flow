package com.sahaflow.customer;

import com.sahaflow.customer.domain.Customer;
import com.sahaflow.customer.dto.CustomerRequest;
import com.sahaflow.customer.repository.CustomerRepository;
import com.sahaflow.customer.service.CustomerService;
import com.sahaflow.shared.tenant.TenantContext;
import com.sahaflow.shared.tenant.TenantContextHolder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        TenantContextHolder.set(new TenantContext("tenant-1", "user-1", "ADMIN"));
    }

    @AfterEach
    void tearDown() {
        TenantContextHolder.clear();
    }

    @Test
    @DisplayName("create - should create customer with addresses")
    void create_shouldCreateCustomer() {
        var request = new CustomerRequest(
            "Test Customer", "customer@test.com", "555-1111",
            "1234567890", "Test Tax Office", "Test notes",
            new ArrayList<>()
        );

        var customer = new Customer();
        customer.setId("cust-1");
        customer.setTenantId("tenant-1");
        customer.setName("Test Customer");
        customer.setEmail("customer@test.com");
        customer.setCreatedBy("user-1");
        customer.setActive(true);

        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        var result = customerService.create("tenant-1", request);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Test Customer");
        assertThat(result.email()).isEqualTo("customer@test.com");
        assertThat(result.active()).isTrue();
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    @DisplayName("findById - should throw when customer not found")
    void findById_shouldThrowWhenNotFound() {
        when(customerRepository.findByTenantIdAndId("tenant-1", "cust-404"))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerService.findById("tenant-1", "cust-404"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Customer not found");
    }

    @Test
    @DisplayName("deactivate - should set active to false")
    void deactivate_shouldSetActiveToFalse() {
        var customer = new Customer();
        customer.setId("cust-1");
        customer.setTenantId("tenant-1");
        customer.setName("Test");
        customer.setActive(true);

        when(customerRepository.findByTenantIdAndId("tenant-1", "cust-1"))
            .thenReturn(Optional.of(customer));

        customerService.deactivate("tenant-1", "cust-1");

        assertThat(customer.isActive()).isFalse();
        verify(customerRepository).save(customer);
    }
}
