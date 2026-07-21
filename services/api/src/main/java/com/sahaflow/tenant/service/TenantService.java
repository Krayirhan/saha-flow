package com.sahaflow.tenant.service;

import com.sahaflow.shared.error.ResourceNotFoundException;
import com.sahaflow.tenant.domain.Tenant;
import com.sahaflow.tenant.repository.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @Transactional
    public Tenant create(String slug, String name) {
        var tenant = new Tenant();
        tenant.setSlug(slug.toLowerCase().trim());
        tenant.setName(name.trim());
        tenant.setPlan("FREE");
        tenant.setActive(true);
        return tenantRepository.save(tenant);
    }

    @Transactional(readOnly = true)
    public Tenant findById(String tenantId) {
        return tenantRepository.findByIdAndActiveTrue(tenantId)
            .orElseThrow(() -> ResourceNotFoundException.of("Tenant", tenantId));
    }

    @Transactional(readOnly = true)
    public Tenant findBySlug(String slug) {
        return tenantRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Tenant not found for slug: " + slug));
    }

    @Transactional(readOnly = true)
    public boolean existsBySlug(String slug) {
        return tenantRepository.existsBySlug(slug);
    }

    @Transactional
    public void deactivate(String tenantId) {
        var tenant = findById(tenantId);
        tenant.setActive(false);
        tenantRepository.save(tenant);
    }

    @Transactional
    public Tenant updatePlan(String tenantId, String plan) {
        var tenant = findById(tenantId);
        tenant.setPlan(plan);
        return tenantRepository.save(tenant);
    }
}
