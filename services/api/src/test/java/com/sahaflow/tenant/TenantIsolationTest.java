package com.sahaflow.tenant;

import com.sahaflow.AbstractIntegrationTest;
import com.sahaflow.customer.domain.Customer;
import com.sahaflow.customer.repository.CustomerRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class TenantIsolationTest extends AbstractIntegrationTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    @DisplayName("Customer created in tenant-1 should NOT be visible to tenant-2")
    void crossTenantDataIsolation() {
        var customerT1 = new Customer();
        customerT1.setId("cust-t1-001");
        customerT1.setTenantId("tenant-default");
        customerT1.setName("Tenant 1 Customer");
        customerT1.setActive(true);
        customerRepository.save(customerT1);

        var customerT2 = new Customer();
        customerT2.setId("cust-t2-001");
        customerT2.setTenantId("tenant-2");
        customerT2.setName("Tenant 2 Customer");
        customerT2.setActive(true);
        customerRepository.save(customerT2);

        Optional<Customer> foundAsT1 = customerRepository.findByTenantIdAndId("tenant-default", "cust-t1-001");
        assertThat(foundAsT1).isPresent();
        assertThat(foundAsT1.get().getTenantId()).isEqualTo("tenant-default");

        Optional<Customer> foundAsT2 = customerRepository.findByTenantIdAndId("tenant-default", "cust-t2-001");
        assertThat(foundAsT2).isEmpty();

        Optional<Customer> tenant2Owns = customerRepository.findByTenantIdAndId("tenant-2", "cust-t2-001");
        assertThat(tenant2Owns).isPresent();
        assertThat(tenant2Owns.get().getName()).isEqualTo("Tenant 2 Customer");
    }

    @Test
    @DisplayName("Query by tenantId should only return that tenant's data")
    void queryByTenantShouldFilterCorrectly() {
        customerRepository.deleteAll();

        var customerT1 = new Customer();
        customerT1.setId("cust-iso-1");
        customerT1.setTenantId("tenant-default");
        customerT1.setName("ISO Customer 1");
        customerT1.setActive(true);
        customerRepository.save(customerT1);

        var customerT2 = new Customer();
        customerT2.setId("cust-iso-2");
        customerT2.setTenantId("tenant-other");
        customerT2.setName("ISO Customer 2");
        customerT2.setActive(true);
        customerRepository.save(customerT2);

        var page = customerRepository.findAllByTenantId("tenant-default",
            org.springframework.data.domain.Pageable.unpaged());

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).getTenantId()).isEqualTo("tenant-default");
        assertThat(page.getContent().get(0).getName()).isEqualTo("ISO Customer 1");
    }
}
