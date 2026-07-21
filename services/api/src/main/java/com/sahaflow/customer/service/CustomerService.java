package com.sahaflow.customer.service;

import com.sahaflow.customer.domain.Customer;
import com.sahaflow.customer.domain.CustomerAddress;
import com.sahaflow.customer.dto.CustomerRequest;
import com.sahaflow.customer.dto.CustomerResponse;
import com.sahaflow.customer.repository.CustomerRepository;
import com.sahaflow.shared.pagination.PageRequest;
import com.sahaflow.shared.tenant.TenantContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public CustomerResponse create(String tenantId, CustomerRequest request) {
        var customer = new Customer();
        customer.setTenantId(tenantId);
        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setTaxId(request.taxId());
        customer.setTaxOffice(request.taxOffice());
        customer.setNotes(request.notes());
        customer.setCreatedBy(TenantContextHolder.getUserId());
        customer.setActive(true);

        if (request.addresses() != null) {
            for (var addrReq : request.addresses()) {
                var address = new CustomerAddress();
                address.setCustomer(customer);
                address.setLabel(addrReq.label());
                address.setAddressLine1(addrReq.addressLine1());
                address.setAddressLine2(addrReq.addressLine2());
                address.setCity(addrReq.city());
                address.setDistrict(addrReq.district());
                address.setPostalCode(addrReq.postalCode());
                address.setCountry(addrReq.country() != null ? addrReq.country() : "TR");
                address.setLatitude(addrReq.latitude());
                address.setLongitude(addrReq.longitude());
                address.setDefault(addrReq.isDefault());
                customer.getAddresses().add(address);
            }
        }

        customer = customerRepository.save(customer);
        return toResponse(customer);
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(String tenantId, String id) {
        var customer = customerRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
        return toResponse(customer);
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponse> findAll(String tenantId, PageRequest pageRequest) {
        return customerRepository.findAllByTenantId(tenantId, pageRequest.toSpringPageRequest())
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponse> search(String tenantId, String searchQuery, PageRequest pageRequest) {
        return customerRepository.searchByTenantId(tenantId, searchQuery, pageRequest.toSpringPageRequest())
            .map(this::toResponse);
    }

    @Transactional
    public CustomerResponse update(String tenantId, String id, CustomerRequest request) {
        var customer = customerRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));

        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setTaxId(request.taxId());
        customer.setTaxOffice(request.taxOffice());
        customer.setNotes(request.notes());

        customer.getAddresses().clear();
        if (request.addresses() != null) {
            for (var addrReq : request.addresses()) {
                var address = new CustomerAddress();
                address.setCustomer(customer);
                address.setLabel(addrReq.label());
                address.setAddressLine1(addrReq.addressLine1());
                address.setAddressLine2(addrReq.addressLine2());
                address.setCity(addrReq.city());
                address.setDistrict(addrReq.district());
                address.setPostalCode(addrReq.postalCode());
                address.setCountry(addrReq.country() != null ? addrReq.country() : "TR");
                address.setLatitude(addrReq.latitude());
                address.setLongitude(addrReq.longitude());
                address.setDefault(addrReq.isDefault());
                customer.getAddresses().add(address);
            }
        }

        customer = customerRepository.save(customer);
        return toResponse(customer);
    }

    @Transactional
    public void deactivate(String tenantId, String id) {
        var customer = customerRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
        customer.setActive(false);
        customerRepository.save(customer);
    }

    @Transactional
    public void delete(String tenantId, String id) {
        var customer = customerRepository.findByTenantIdAndId(tenantId, id)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
        customerRepository.delete(customer);
    }

    private CustomerResponse toResponse(Customer c) {
        var addresses = c.getAddresses().stream()
            .map(a -> new CustomerResponse.AddressResponse(
                a.getId(), a.getLabel(), a.getAddressLine1(), a.getAddressLine2(),
                a.getCity(), a.getDistrict(), a.getPostalCode(), a.getCountry(),
                a.getLatitude(), a.getLongitude(), a.isDefault()
            ))
            .toList();

        return new CustomerResponse(
            c.getId(), c.getTenantId(), c.getName(), c.getEmail(), c.getPhone(),
            c.getTaxId(), c.getTaxOffice(), c.getNotes(), c.isActive(),
            c.getCreatedAt(), c.getUpdatedAt(), c.getCreatedBy(), addresses
        );
    }
}
