# Graph Report - saha-flow  (2026-07-21)

## Corpus Check
- 258 files · ~139,523 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2564 nodes · 4214 edges · 177 communities (160 shown, 17 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 196 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c272e85a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- REST API Controllers
- Spring Security & Auth
- JPA Repositories & HTTP
- API Constants & Config
- Work Order Domain
- Customer Frontend Hooks
- Next.js Customer Pages
- Audit & Event System
- CORS & OpenAPI Config
- Exception Handling
- Customer API DTOs
- JPA Audit Entities
- Mobile API Endpoints
- Dashboard UI Pages
- Customer Domain Model
- Work Order Status Flow
- Flutter UI Components
- Job Execution Provider
- Customer Detail Pages
- Customer Address Model
- Module 20
- Module 21
- Module 22
- Module 23
- Module 24
- Module 25
- Module 26
- Module 27
- Module 28
- Module 29
- Module 30
- Module 31
- Module 32
- Module 33
- Module 34
- Module 35
- Module 36
- Module 37
- Module 38
- Module 39
- Module 40
- Module 41
- Module 42
- Module 43
- Module 44
- Module 45
- Module 46
- Module 47
- Module 48
- Module 49
- Module 50
- Module 51
- Module 52
- Module 53
- Module 54
- Module 55
- Module 56
- Module 57
- Module 58
- Module 59
- Module 60
- Module 61
- Module 62
- Module 63
- Module 64
- Module 65
- Module 66
- Module 67
- Module 68
- Module 69
- Module 70
- Module 71
- Module 72
- Module 73
- Module 74
- Module 75
- Module 76
- Module 77
- Module 78
- Module 79
- Module 80
- Module 81
- Module 82
- Module 83
- Module 84
- Module 85
- Module 86
- Module 87
- Module 88
- Module 89
- Module 90
- Module 91
- Module 92
- Module 93
- Module 94
- Module 95
- Module 96
- Module 97
- Module 98
- Module 99
- Module 100
- Module 101
- Module 102
- Module 103
- Module 104
- Module 105
- Module 106
- Module 107
- Module 108
- Module 109
- Module 110
- Module 111
- Module 112
- Module 113
- Module 114
- Module 115
- Module 116
- Module 117
- Module 118
- Module 119
- Module 120
- Module 121
- Saha Flow Landing Page Redesign Plan
- Module 123
- Module 131
- Membership
- TenantFilter
- LifecycleStickySection.tsx
- 12. FAQ Drafts
- useCustomers.ts
- HealthController.java
- photo_capture.dart
- Header.tsx
- Saha Flow Landing Content
- Referans Siteler
- OperationsBeforeAfter.tsx
- 11. Pricing
- 2. Hero
- 6. Lifecycle Section
- 8. Problem-Focused Features
- LandingFaq.tsx
- 4.10 Pricing
- 4.5 Work-Order Lifecycle
- HeroOperationsFlow.tsx
- OperationalFeatureBento.tsx
- 10. Pilot Program
- 13. Final CTA
- 4.2 Split Hero — Live Operation
- 4.4 Before / After Comparison
- 4.6 Web + Mobile Synchronization
- StateNotifier
- 14. Footer
- 5. Before / After
- 7. Web + Mobile Showcase
- 4.12 Final CTA
- 4.13 Footer
- 4.1 Navbar
- 4.7 Problem-Focused Feature Bento
- Tasarım Referans Kuralları
- 5. Responsive Plan
- 2. Main Creative Direction
- 4.3 Trust Strip
- 4.8 Security and Control
- autoprefixer
- .onUpdate
- @testing-library/jest-dom

## God Nodes (most connected - your core abstractions)
1. `User` - 57 edges
2. `WorkOrder` - 56 edges
3. `cn()` - 42 edges
4. `Customer` - 37 edges
5. `CustomerAddress` - 35 edges
6. `Tenant` - 31 edges
7. `WorkOrderStatus` - 30 edges
8. `AuditEvent` - 28 edges
9. `WorkOrderResponse` - 28 edges
10. `Saha Flow Landing Page Redesign Plan` - 27 edges

## Surprising Connections (you probably didn't know these)
- `ADR-001: Modular Monolith over Microservices (Accepted)` --semantically_similar_to--> `Spring Boot 3.3 + Java 21 Virtual Threads (modular monolith)`  [INFERRED] [semantically similar]
  15_ADR.md → 05_TECH_STACK_DECISIONS.md
- `TenantIsolationTest (cross-tenant access matrix, 6 entity types)` --semantically_similar_to--> `RBAC (ADMIN/MANAGER/DISPATCHER/TECHNICIAN, @PreAuthorize method-level)`  [INFERRED] [semantically similar]
  13_TEST_STRATEGY.md → 07_BACKEND_ARCHITECTURE_SECURITY.md
- `KVKK Data Inventory (PII categories, legal basis per processing activity)` --semantically_similar_to--> `Audit Log (@Auditable AOP aspect + pgAudit SQL-level + audit_event table)`  [INFERRED] [semantically similar]
  11_PRIVACY_KVKK.md → 07_BACKEND_ARCHITECTURE_SECURITY.md
- `Transactional Outbox Pattern (outbox_event PostgreSQL table + polling publisher)` --semantically_similar_to--> `Domain Events (10 events, sync/async)`  [INFERRED] [semantically similar]
  04_SOLUTION_ARCHITECTURE.md → 03_DOMAIN_MODEL.md
- `Runbook: Tenant Data Leak Response (Runbooks 2+3, KVKK 72h obligation)` --investigates_failure_of--> `TenantContextFilter + TenantEntityInterceptor (ThreadLocal isolation)`  [INFERRED]
  18_OPERATIONS_RUNBOOK.md → 07_BACKEND_ARCHITECTURE_SECURITY.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Tenant Isolation Defense-in-Depth** — 07_backend_architecture_security_tenant_context_filter, 08_database_and_data_security_shared_schema, 07_backend_architecture_security_rbac, 10_threat_model_idor_tenant_bypass, 13_test_strategy_tenant_isolation_tests, 15_adr_002_shared_schema [EXTRACTED 1.00]
- **MVP Cost/Complexity Trade-off Cluster** — 05_tech_stack_decisions_caffeine_cache, 05_tech_stack_decisions_docker_compose_hetzner, 15_adr_001_modular_monolith, 15_adr_008_outbox_pattern, 04_solution_architecture_outbox_pattern [INFERRED 0.95]
- **KVKK Compliance Architecture** — 11_privacy_kvkk_data_inventory, 11_privacy_kvkk_consent_management, 07_backend_architecture_security_audit_log, 07_backend_architecture_security_aes_encryption, 11_privacy_kvkk_data_breach_response, 18_operations_runbook_tenant_data_leak [EXTRACTED 1.00]
- **Multi-Tenant Security Isolation Stack** — readme_multi_tenant_saas, docs_architecture_tenant_isolation, 20_project_structure_tenant_context_filter, docs_architecture_hibernate_filter, 19_traceability_matrix_tenant_isolation_req [EXTRACTED 0.95]
- **Offline-First Mobile Architecture** — 20_project_structure_offline_first, apps_mobile_pubspec_yaml_sembast_dep, 19_traceability_matrix_offline_mobile_req, 20_project_structure_clean_architecture_mobile [INFERRED 0.85]
- **CI/CD Security Scanning Pipeline** — infra_ci_github_actions_ci_pipeline, infra_ci_github_actions_security_scan_job, docs_security_owasp_sast_sca, 19_traceability_matrix_secure_sdlc_req [INFERRED 0.85]

## Communities (177 total, 17 thin omitted)

### Community 0 - "REST API Controllers"
Cohesion: 0.06
Nodes (28): ResourceNotFoundException, PageRequest, Entity, PrePersist, Table, WorkOrderAssignment, WorkOrderCreateRequest, WorkOrderResponse (+20 more)

### Community 1 - "Spring Security & Auth"
Cohesion: 0.05
Nodes (45): EnableMethodSecurity, EnableWebSecurity, HttpSecurity, OncePerRequestFilter, Order, SecurityFilterChain, Bean, Configuration (+37 more)

### Community 2 - "JPA Repositories & HTTP"
Cohesion: 0.07
Nodes (19): JpaRepository, Entity, PrePersist, PreUpdate, Table, Tenant, Repository, TenantRepository (+11 more)

### Community 3 - "API Constants & Config"
Cohesion: 0.04
Nodes (49): accessTokenKey, apiDateFormat, appBuildNumber, AppConstants, appName, appVersion, baseUrlDev, baseUrlProd (+41 more)

### Community 4 - "Work Order Domain"
Cohesion: 0.04
Nodes (4): Entity, Table, WorkOrder, work_order_status_history

### Community 5 - "Customer Frontend Hooks"
Cohesion: 0.21
Nodes (15): DashboardData, RECENT_WORK_ORDERS_PARAMS, WorkOrderList(), useWorkOrders(), UseWorkOrderDetailReturn, UseWorkOrdersReturn, WorkOrderFilters, ApiErrorResponse (+7 more)

### Community 6 - "Next.js Customer Pages"
Cohesion: 0.14
Nodes (19): Button, ButtonProps, sizes, variants, EmptyState(), EmptyStateProps, ErrorState(), ErrorStateProps (+11 more)

### Community 7 - "Audit & Event System"
Cohesion: 0.07
Nodes (13): Async, EventListener, AuditEvent, Entity, PrePersist, Table, AuditEventListener, Component (+5 more)

### Community 8 - "CORS & OpenAPI Config"
Cohesion: 0.08
Nodes (3): ErrorResponse, JsonInclude, ValidationError

### Community 9 - "Exception Handling"
Cohesion: 0.09
Nodes (32): AccessDeniedException, AuthenticationException, DataIntegrityViolationException, HttpMessageNotReadableException, HttpStatus, MaxUploadSizeExceededException, MethodArgumentNotValidException, MissingRequestHeaderException (+24 more)

### Community 10 - "Customer API DTOs"
Cohesion: 0.15
Nodes (16): DeleteMapping, CustomerRequest, AddressResponse, CustomerResponse, CustomerService, Page, Service, Transactional (+8 more)

### Community 11 - "JPA Audit Entities"
Cohesion: 0.08
Nodes (5): Entity, PrePersist, PreUpdate, Table, User

### Community 12 - "Mobile API Endpoints"
Cohesion: 0.06
Nodes (30): ApiEndpoints, basePath, changePassword, checklistItemComplete, completeWorkOrder, customerDetail, customerHistory, dashboard (+22 more)

### Community 13 - "Dashboard UI Pages"
Cohesion: 0.13
Nodes (21): DashboardPage(), Badge(), BadgeProps, badgeVariants, StatusBadge(), StatusBadgeProps, CustomerDetail(), RecentWorkOrders() (+13 more)

### Community 14 - "Customer Domain Model"
Cohesion: 0.06
Nodes (5): Customer, Entity, PrePersist, PreUpdate, Table

### Community 15 - "Work Order Status Flow"
Cohesion: 0.11
Nodes (4): Entity, PrePersist, Table, WorkOrderStatusHistory

### Community 16 - "Flutter UI Components"
Cohesion: 0.08
Nodes (27): ScaffoldWithNavBar, PhotoCapture, WorkOrderCard, action, build, EmptyState, icon, message (+19 more)

### Community 17 - "Job Execution Provider"
Cohesion: 0.07
Nodes (28): addPhoto, canSubmit, ChecklistItem, checklistItems, copyWith, error, fromJson, id (+20 more)

### Community 18 - "Customer Detail Pages"
Cohesion: 0.21
Nodes (5): PermissionGuard(), PermissionGuardProps, hasPermission(), Permission, PERMISSIONS

### Community 19 - "Customer Address Model"
Cohesion: 0.07
Nodes (4): CustomerAddress, Entity, PrePersist, Table

### Community 20 - "Module 20"
Cohesion: 0.07
Nodes (27): accent, accentLight, AppColors, background, disabled, divider, error, errorLight (+19 more)

### Community 21 - "Module 21"
Cohesion: 0.08
Nodes (27): build, _clear, color, createState, existingPath, _hasDrawn, _onPanEnd, _onPanStart (+19 more)

### Community 22 - "Module 22"
Cohesion: 0.22
Nodes (6): Claims, SecretKey, Logger, Service, JwtService, SuppressWarnings

### Community 23 - "Module 23"
Cohesion: 0.07
Nodes (26): _connectivityService, copyWith, createdAt, data, _dio, dispose, enqueue, fromJson (+18 more)

### Community 24 - "Module 24"
Cohesion: 0.07
Nodes (26): address, city, createdAt, customerName, customerPhone, deviceBrand, deviceModel, deviceType (+18 more)

### Community 25 - "Module 25"
Cohesion: 0.07
Nodes (26): address, canComplete, canStart, city, copyWith, createdAt, customerName, customerPhone (+18 more)

### Community 26 - "Module 26"
Cohesion: 0.09
Nodes (25): authState, build, _calculateSelectedIndex, child, createState, initState, _rootNavigatorKey, routerProvider (+17 more)

### Community 27 - "Module 27"
Cohesion: 0.08
Nodes (25): dependencies, clsx, date-fns, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form (+17 more)

### Community 28 - "Module 28"
Cohesion: 0.17
Nodes (17): SettingsPage(), useAuth(), AuthState, LoginFormValues, UseAuthReturn, getCurrentUser(), login(), logout() (+9 more)

### Community 29 - "Module 29"
Cohesion: 0.11
Nodes (18): ConstraintValidator, ConstraintValidatorContext, Override, TenantIdValidator, Constraint, Documented, Retention, Target (+10 more)

### Community 30 - "Module 30"
Cohesion: 0.08
Nodes (26): main, AppTheme, build, LoginScreen, build, fontSize, _getBackgroundColor, _getLabel (+18 more)

### Community 31 - "Module 31"
Cohesion: 0.09
Nodes (21): build, onTap, workOrder, build, _buildActionButtons, _buildCustomerSection, _buildDatesSection, _buildDetail (+13 more)

### Community 32 - "Module 32"
Cohesion: 0.09
Nodes (22): SyncQueue, apiClient, clearError, client, connectivity, connectivityService, copyWith, db (+14 more)

### Community 33 - "Module 33"
Cohesion: 0.09
Nodes (23): devDependencies, autoprefixer, eslint, jsdom, msw, @playwright/test, prettier, @testing-library/react (+15 more)

### Community 34 - "Module 34"
Cohesion: 0.12
Nodes (20): build, _buildChecklist, _buildChecklistItem, ChecklistScreen, _ChecklistScreenState, createState, orderId, build (+12 more)

### Community 35 - "Module 35"
Cohesion: 0.10
Nodes (14): FOOTER_LINKS, MarketingFooter(), BentoCard(), BentoCardProps, BentoItem, ITEMS, OperationalFeatureBento(), BENEFITS (+6 more)

### Community 36 - "Module 36"
Cohesion: 0.12
Nodes (26): useWorkOrderDetail(), apiClient(), ApiClientError, apiDelete(), ApiError, apiGet(), apiPatch(), apiPost() (+18 more)

### Community 37 - "Module 37"
Cohesion: 0.12
Nodes (20): SahaFlowApp, authStateProvider, build, _buildBody, _buildPendingAlert, _buildQuickActions, _buildStatCard, _buildStatsGrid (+12 more)

### Community 38 - "Module 38"
Cohesion: 0.06
Nodes (33): _calculateBackoff, _connectivityService, _createAuthInterceptor, _createConnectivityInterceptor, _createCorrelationIdInterceptor, _createErrorInterceptor, _createRetryInterceptor, delete (+25 more)

### Community 39 - "Module 39"
Cohesion: 0.10
Nodes (19): _apiDateFormat, _apiDateTimeFormat, _dateFormat, DateFormatter, dateOnly, _dateTimeFormat, formatDate, formatDateTime (+11 more)

### Community 40 - "Module 40"
Cohesion: 0.11
Nodes (3): JsonInclude, Page, PagedResponse

### Community 41 - "Module 41"
Cohesion: 0.12
Nodes (19): Traceability Matrix, Audit Log Requirement (FR-DASH-02), Secure Authentication Requirement (FR-AUTH-02), KVKK Compliance Requirement (NFR-SEC-01), Automatic PDF Service Report Requirement (FR-RPT-01), Push Notification Requirement (FR-MOB-02, FCM), Secure SDLC Requirement (NFR-SEC-03, OWASP ASVS L2), SLA Tracking Requirement (FR-WO-02) (+11 more)

### Community 42 - "Module 42"
Cohesion: 0.24
Nodes (6): AfterEach, CustomerServiceTest, BeforeEach, DisplayName, ExtendWith, Test

### Community 43 - "Module 43"
Cohesion: 0.11
Nodes (17): clearAll, getAccessToken, getRefreshToken, getUserEmail, getUserId, hasTokens, saveTokens, saveUserEmail (+9 more)

### Community 44 - "Module 44"
Cohesion: 0.24
Nodes (11): LoginResponse, AuthController, ExceptionHandler, HttpServletRequest, Logger, PostMapping, ProblemDetail, RequestMapping (+3 more)

### Community 45 - "Module 45"
Cohesion: 0.04
Nodes (44): 10. Product Screenshot Rules, 11. Motion, 12. Accessibility, 13. Responsive Behavior, 14. Component Guidance, 15. SaaS Clichés to Avoid, 16. Definition of Visual Success, 1. Brand Purpose (+36 more)

### Community 46 - "Module 46"
Cohesion: 0.12
Nodes (17): ApiClient, _apiClient, completedJobs, copyWith, DashboardNotifier, DashboardState, DashboardSummary, error (+9 more)

### Community 47 - "Module 47"
Cohesion: 0.06
Nodes (30): 1. Core Rule, 2. VibeUI, 3. Refero Styles, 4. Aceternity UI, 5. SuperDesign, 6. Anti-Copy Rules, 7. Coherence Checklist, 8. Originality Checklist (+22 more)

### Community 48 - "Module 48"
Cohesion: 0.12
Nodes (5): Entity, PrePersist, Table, Role, permission

### Community 49 - "Module 49"
Cohesion: 0.12
Nodes (16): authenticated, AuthState, AuthStatus, clearError, copyWith, error, isAuthenticated, isLoading (+8 more)

### Community 50 - "Module 50"
Cohesion: 0.12
Nodes (16): clearAll, close, count, _database, delete, deleteAll, getAll, _getStore (+8 more)

### Community 51 - "Module 51"
Cohesion: 0.12
Nodes (16): _apiClient, _cacheWorkOrder, _cacheWorkOrders, completeChecklistItem, completeWorkOrder, _getCachedWorkOrder, _getCachedWorkOrders, getWorkOrderDetail (+8 more)

### Community 52 - "Module 52"
Cohesion: 0.12
Nodes (16): apiClient, copyWith, error, _initialLoaded, isLoading, loadWorkOrders, localDb, refresh (+8 more)

### Community 53 - "Module 53"
Cohesion: 0.12
Nodes (14): extends, ignorePatterns, node_modules/, plugins, rules, import/order, @next/next/no-img-element, no-console (+6 more)

### Community 54 - "Module 54"
Cohesion: 0.12
Nodes (18): Select, SelectOption, SelectProps, Textarea, TextareaProps, LoginForm(), WorkOrderForm(), createWorkOrder() (+10 more)

### Community 55 - "Module 55"
Cohesion: 0.24
Nodes (7): Bucket, Map, Configuration, RateLimitConfig, DisplayName, Test, RateLimitTest

### Community 56 - "Module 56"
Cohesion: 0.20
Nodes (7): HttpServletRequestWrapper, ReadListener, CachedBodyHttpServletRequest, CachedBodyServletInputStream, HttpServletRequest, Override, ServletInputStream

### Community 57 - "Module 57"
Cohesion: 0.13
Nodes (17): FINAL_STATES, FinalWorkOrderCta(), FLOW_STATE_CONFIG, FlowConnector(), FlowConnectorProps, FlowLine(), FlowLineProps, FlowState (+9 more)

### Community 58 - "Module 58"
Cohesion: 0.14
Nodes (16): Offline Mobile Requirement (FR-MOB-01), Clean Architecture Mobile (presentation/domain/data), Feature-First Structure Web (Next.js), Hexagonal Architecture Backend (port-adapter), Monorepo Project Structure Decision, Monorepo Rationale (2-person team, atomic changes), Offline-First Mobile Strategy (SQLite + sync queue), Riverpod State Management (Flutter) (+8 more)

### Community 59 - "Module 59"
Cohesion: 0.13
Nodes (14): AnimatedWidget, AnimationController, AnimatedBuilder, _animationController, build, connectivityService, _connectivitySub, createState (+6 more)

### Community 60 - "Module 60"
Cohesion: 0.16
Nodes (14): build, createState, dispose, _emailController, _formKey, _handleLogin, LoginForm, _LoginFormState (+6 more)

### Community 61 - "Module 61"
Cohesion: 0.14
Nodes (14): actionError, completeWorkOrder, copyWith, error, isActionLoading, isLoading, loadDetail, _orderId (+6 more)

### Community 62 - "Module 62"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, module (+7 more)

### Community 64 - "Module 64"
Cohesion: 0.35
Nodes (7): CustomerRepository, Page, Pageable, Query, Repository, customer, customer_address

### Community 65 - "Module 65"
Cohesion: 0.12
Nodes (4): Entity, PrePersist, Table, Permission

### Community 66 - "Module 66"
Cohesion: 0.28
Nodes (8): LoginRequest, RegisterRequest, AuthControllerTest, AutoConfigureMockMvc, DisplayName, MockMvc, ObjectMapper, Test

### Community 67 - "Module 67"
Cohesion: 0.13
Nodes (15): AbstractIntegrationTest, DynamicPropertyRegistry, DynamicPropertySource, Logger, PostgreSQLContainer, SpringBootTest, Testcontainers, AutoConfigureMockMvc (+7 more)

### Community 68 - "Module 68"
Cohesion: 0.29
Nodes (5): List, AddressRequest, DisplayName, Test, TenantIsolationTest

### Community 69 - "Module 69"
Cohesion: 0.27
Nodes (14): Object Storage Requirement (FR-FILE-01, S3), MinIO S3-Compatible Storage, Local Development Guide, Rate Limiting (Redis-based), Docker Compose Development Stack, Docker Compose Orchestration, Flutter Mobile App, Next.js Web Frontend (+6 more)

### Community 70 - "Module 70"
Cohesion: 0.14
Nodes (13): ApiException, data, _extractMessage, fromDioError, isConflict, isConnectionError, isUnauthorized, message (+5 more)

### Community 71 - "Module 71"
Cohesion: 0.53
Nodes (4): CorsFilter, CorsConfig, Bean, Configuration

### Community 72 - "Module 72"
Cohesion: 0.53
Nodes (4): OpenAPI, Bean, Configuration, OpenApiConfig

### Community 73 - "Module 73"
Cohesion: 0.17
Nodes (11): _connectivity, _connectivityController, ConnectivityService, connectivityStream, dispose, _init, _isConnected, Connectivity (+3 more)

### Community 74 - "Module 74"
Cohesion: 0.17
Nodes (9): WorkOrderStatus, APPROVED, ASSIGNED, CANCELLED, COMPLETED, IN_PROGRESS, INVOICED, OPEN (+1 more)

### Community 75 - "Module 75"
Cohesion: 0.23
Nodes (8): Resource, FileController, GetMapping, MultipartFile, PostMapping, RequestMapping, ResponseEntity, RestController

### Community 76 - "Module 76"
Cohesion: 0.35
Nodes (5): BeforeEach, DisplayName, ExtendWith, Test, UserServiceTest

### Community 77 - "Module 77"
Cohesion: 0.24
Nodes (9): GetMapping, PostMapping, PreAuthorize, PutMapping, RequestMapping, ResponseEntity, RestController, UpdateProfileRequest (+1 more)

### Community 78 - "Module 78"
Cohesion: 0.20
Nodes (11): Acceptance Criteria AK-01..AK-07, Content Security Policy Headers (middleware.ts, frame-ancestors none), Rate Limiting (Bucket4j + Caffeine, login 5/min, files 10/min, general 60/min), STRIDE Threat Analysis (26 threats T-001..T-026, risk matrix), Supply Chain Attack T-018 (Critical, malicious NPM/Maven package), GitHub Actions CI/CD (ci-web.yml, ci-api.yml, ci-mobile.yml, deploy-staging.yml), Supply Chain Security (SBOM CycloneDX, Trivy, Gitleaks, Dependabot, SLSA L2 target), Negative Test Suite NT-01..NT-25 (JWT, IDOR, file upload, rate limit, optimistic lock) (+3 more)

### Community 79 - "Module 79"
Cohesion: 0.18
Nodes (11): Bootstrap Report, Prometheus + Grafana + Loki Monitoring Stack, Testing Guide, Flutter Test Mobile Tests, Playwright E2E Tests, Test Pyramid Strategy, Testcontainers Integration Testing, Vitest Frontend Unit Tests (+3 more)

### Community 80 - "Module 80"
Cohesion: 0.20
Nodes (10): User Personas (Ahmet owner / Ayşe dispatcher / Mehmet technician), Work Order Lifecycle (BEKLIYOR→TAMAMLANDI/IPTAL), 12 Bounded Contexts (DDD), WorkOrder State Machine (BEKLIYOR→ATANDI→YOLDA→BASLADI→TAMAMLANDI/IPTAL), WorkOrder Entity (core aggregate with @Version optimistic lock), S3 Presigned URL Upload/Download (15min TTL, never through backend), Zod Schema Client-Side Validation (workOrderCreateSchema example), Idempotency-Key Filter (POST /work-orders, /assign, /check-in, idempotency_store table) (+2 more)

### Community 81 - "Module 81"
Cohesion: 0.31
Nodes (9): build, _buildList, _buildStatusFilter, createState, initState, WorkOrderListScreen, _WorkOrderListScreenState, workOrderListProvider (+1 more)

### Community 82 - "Module 82"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, start, test, test:e2e (+2 more)

### Community 83 - "Module 83"
Cohesion: 0.33
Nodes (7): FileInfo, FileStorageService, JdbcClient, Logger, MultipartFile, Service, Transactional

### Community 85 - "Module 85"
Cohesion: 0.16
Nodes (6): Repository, UserRepository, Page, Service, Transactional, UserService

### Community 86 - "Module 86"
Cohesion: 0.22
Nodes (8): EnumSource, ParameterizedTest, Component, WorkOrderStateMachine, BeforeEach, DisplayName, Test, WorkOrderServiceTest

### Community 87 - "Module 87"
Cohesion: 0.22
Nodes (8): combine, email, maxLength, minLength, password, phone, required, Validators

### Community 88 - "Module 88"
Cohesion: 0.22
Nodes (8): address, _createMockWorkOrder, customerName, main, orderNumber, status, package:saha_flow_mobile/features/work_orders/domain/work_order.dart, package:saha_flow_mobile/features/work_orders/presentation/widgets/work_order_card.dart

### Community 90 - "Module 90"
Cohesion: 0.29
Nodes (8): Shared Schema Multi-tenancy Assumption V-024, TenantContextFilter + TenantEntityInterceptor (ThreadLocal isolation), Flyway Versioned Migrations V001..V012 + repeatable functions, PostgreSQL 16 + PostGIS (ST_DWithin, ST_Distance geospatial queries), Shared DB / Shared Schema (tenant_id NOT NULL on all tables, composite index), IDOR / Tenant Bypass Threat T-002 (Critical, impact 5, probability 3), TenantIsolationTest (cross-tenant access matrix, 6 entity types), ADR-002: Shared DB/Shared Schema Multi-tenancy (Accepted)

### Community 91 - "Module 91"
Cohesion: 0.36
Nodes (8): Docker Compose + Hetzner VPS (Kubernetes deferred), Audit Log (@Auditable AOP aspect + pgAudit SQL-level + audit_event table), Backup Strategy (pg_dump + WAL PITR, RPO 1h, RTO 4h, 30-day retention), Data Breach Response (72h KVKK Board notification obligation), OpenTelemetry Stack (OTel Collector → Prometheus + Loki + Tempo + Grafana), SLO Definitions (login 99.9%, API p95 <500ms, mobile sync 99%, file upload 99.5%), Operations Runbook (13 scenarios: login failure, DB slowness, deploy rollback, backup restore), Runbook: Tenant Data Leak Response (Runbooks 2+3, KVKK 72h obligation)

### Community 92 - "Module 92"
Cohesion: 0.25
Nodes (7): exclude, include, node_modules, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx

### Community 93 - "Module 93"
Cohesion: 0.29
Nodes (8): Deployment Guide, CDN / WAF (CloudFront or Cloudflare), HikariCP Connection Pooling, Kubernetes HPA Auto-Scaling, Flyway Database Migration, Spring Boot application-dev.yml Config, Spring Boot application-prod.yml Config, Spring Boot application.yml Base Config

### Community 94 - "Module 94"
Cohesion: 0.33
Nodes (3): getSession(), parseSession(), Session

### Community 95 - "Module 95"
Cohesion: 0.29
Nodes (7): paths, @components/*, @features/*, @lib/*, ./src/components/*, ./src/features/*, ./src/lib/*

### Community 96 - "Module 96"
Cohesion: 0.33
Nodes (7): HashiCorp Vault Secret Management, Hibernate TenantFilter, OpenAPI 3.0 REST Spec, PostGIS Geospatial Extension, Saha Flow System Architecture, Tenant Isolation Strategy (Row-Level), Docker Compose Production Override

### Community 97 - "Module 97"
Cohesion: 0.29
Nodes (6): audit_event, customer_approval, idempotency_keys, media_object, outbox_event, service_report

### Community 98 - "Module 98"
Cohesion: 0.33
Nodes (6): MVP Scope, Saha Flow SaaS Platform, Target Market (5-50 tech firms, Turkey then MENA), Pricing Model (500/450/400 TL per technician/month), MVP Epics (AUTH/CUSTOMER/WORKORDER/ASSIGN/MOBILE/CHECKLIST/REPORT/DASHBOARD), Project Phases (Discovery W1-W2 → Foundation W3-W5 → MVP W6-W13 → Pilot W14-W17 → V1 W21+)

### Community 99 - "Module 99"
Cohesion: 0.33
Nodes (6): Offline Mobile Constraint V-010 (50 WO, 200 photos max), Flutter 3.22 Offline-First (Hive/Isar local storage, sync engine), AES-256-GCM Field Encryption (JPA AttributeConverter, SecureRandom IV), Consent Management (versioned, revocable, granular per processing type), KVKK Data Inventory (PII categories, legal basis per processing activity), ADR-004: Flutter Offline-First Architecture (Accepted)

### Community 100 - "Module 100"
Cohesion: 0.33
Nodes (6): Domain Events (10 events, sync/async), Transactional Outbox Pattern (outbox_event PostgreSQL table + polling publisher), Caffeine In-Memory Cache (Redis deferred post-MVP), Spring Boot 3.3 + Java 21 Virtual Threads (modular monolith), RBAC (ADMIN/MANAGER/DISPATCHER/TECHNICIAN, @PreAuthorize method-level), ADR-008: Transactional Outbox Pattern (no RabbitMQ/Kafka) (Accepted)

### Community 101 - "Module 101"
Cohesion: 0.33
Nodes (6): Modular Monolith Architecture Decision, OpenTelemetry Observability, Saha Flow Generation Report, Shared DB Shared Schema Tenant Model, Transactional Outbox Pattern, Multi-Tenant SaaS Architecture

### Community 102 - "Module 102"
Cohesion: 0.33
Nodes (5): getCurrentPosition, hasLocationPermission, PermissionService, requestLocationPermission, package:geolocator/geolocator.dart

### Community 103 - "Module 103"
Cohesion: 0.33
Nodes (5): engines, node, name, private, version

### Community 104 - "Module 104"
Cohesion: 0.53
Nodes (4): ConfigurationPropertiesScan, EnableAsync, SahaFlowApplication, SpringBootApplication

### Community 105 - "Module 105"
Cohesion: 0.12
Nodes (16): AuthLayout(), AuthLayoutProps, MarketingNavbar(), MobileMenuButtonProps, NAV_LINKS, SahaFlowLogo(), Modal(), ModalProps (+8 more)

### Community 106 - "Module 106"
Cohesion: 0.40
Nodes (5): JWT Auth Assumption V-011 (access 15min, refresh 7day), BFF Pattern (Next.js proxies all API calls via /api/proxy), HttpOnly Secure SameSite=Strict Cookie (JWT transport), JWT Authentication (access 15min, refresh 7day, rotation + reuse detection), ADR-003: Next.js BFF + HttpOnly Cookie Auth (Accepted)

### Community 108 - "Module 108"
Cohesion: 0.60
Nodes (4): config, isPublicPath(), middleware(), PUBLIC_PATHS

### Community 109 - "Module 109"
Cohesion: 0.50
Nodes (3): nextConfig, path, securityHeaders

### Community 110 - "Module 110"
Cohesion: 0.50
Nodes (4): lib, dom, dom.iterable, esnext

### Community 111 - "Module 111"
Cohesion: 0.83
Nodes (3): Auditable, Retention, Target

### Community 116 - "Module 116"
Cohesion: 0.67
Nodes (5): membership, role, role_permission, tenant, user_account

### Community 117 - "Module 117"
Cohesion: 0.25
Nodes (6): BadCredentialsException, TokenRefreshRequest, AuthenticationService, PasswordEncoder, Service, Transactional

### Community 122 - "Saha Flow Landing Page Redesign Plan"
Cohesion: 0.12
Nodes (15): 1. Why the Landing Needs Redesign, 3. New Information Architecture, 4.11 FAQ, 4.9 Pilot Program or Social Proof, 4. Section-by-Section Plan, 6. Implementation Phases, 7. Acceptance Criteria, Decision Rule (+7 more)

### Community 135 - "Membership"
Cohesion: 0.14
Nodes (4): Entity, PrePersist, Table, Membership

### Community 136 - "TenantFilter"
Cohesion: 0.28
Nodes (7): Component, FilterChain, HttpServletRequest, HttpServletResponse, Logger, Override, TenantFilter

### Community 137 - "LifecycleStickySection.tsx"
Cohesion: 0.18
Nodes (3): LifecycleStickySection(), STEPS, useReducedMotion()

### Community 138 - "12. FAQ Drafts"
Cohesion: 0.18
Nodes (11): 12. FAQ Drafts, Destek pakete dahil mi?, Kullanıcı sayımı sonradan artırabilir miyim?, Kurulum ne kadar sürüyor?, Mevcut müşteri verilerimi aktarabilir miyim?, Mobil uygulama internetsiz çalışıyor mu?, Servis raporuna fotoğraf ve imza eklenebilir mi?, Teknisyenler birbirlerinin işlerini görebilir mi? (+3 more)

### Community 139 - "useCustomers.ts"
Cohesion: 0.33
Nodes (8): CustomerList(), useCustomerDetail(), useCustomers(), CustomerFilters, UseCustomerDetailReturn, UseCustomersReturn, getCustomerById(), Customer

### Community 140 - "HealthController.java"
Cohesion: 0.38
Nodes (6): HealthController, GetMapping, JdbcClient, RequestMapping, ResponseEntity, RestController

### Community 141 - "photo_capture.dart"
Cohesion: 0.22
Nodes (8): build, _capturePhoto, onPhotoAdded, onPhotoRemoved, photoPaths, ImageSource, package:image_picker/image_picker.dart, ValueChanged

### Community 142 - "Header.tsx"
Cohesion: 0.28
Nodes (5): Header(), HeaderProps, titleMap, navItems, Sidebar()

### Community 143 - "Saha Flow Landing Content"
Cohesion: 0.22
Nodes (8): 15. Prohibited Copy, 1. Navbar, 3. Hero Operation Timeline, 4. Trust Strip, 9. Security and Control, Heading, Saha Flow Landing Content, Supporting Copy

### Community 144 - "Referans Siteler"
Cohesion: 0.22
Nodes (8): 1. VibeUI — [vibeui.online](https://vibeui.online), 2. Refero Design Styles — [styles.refero.design](https://styles.refero.design), 3. Aceternity UI — [ui.aceternity.com/components](https://ui.aceternity.com/components), 4. Super Design — [superdesign.dev](https://superdesign.dev), İlgili Dokümanlar, Kullanım Notları, Referans Siteler, Saha Flow — Tasarım Referansları

### Community 145 - "OperationsBeforeAfter.tsx"
Cohesion: 0.25
Nodes (5): AFTER_ITEMS, BEFORE_ITEMS, OperationsBeforeAfter(), Side(), SideProps

### Community 146 - "11. Pricing"
Cohesion: 0.25
Nodes (8): 11. Pricing, CTA, Eyebrow, Heading, Included Features, Plan, Price, Supporting Copy

### Community 147 - "2. Hero"
Cohesion: 0.25
Nodes (8): 2. Hero, Alternative Heading, Eyebrow, Primary CTA, Primary Heading, Secondary CTA, Supporting Copy, Trust Line

### Community 148 - "6. Lifecycle Section"
Cohesion: 0.25
Nodes (8): 6. Lifecycle Section, Heading, Step 1, Step 2, Step 3, Step 4, Step 5, Supporting Copy

### Community 149 - "8. Problem-Focused Features"
Cohesion: 0.25
Nodes (8): 8. Problem-Focused Features, Card 1, Card 2, Card 3, Card 4, Card 5, Card 6, Section Heading

### Community 150 - "LandingFaq.tsx"
Cohesion: 0.29
Nodes (5): FAQS, LandingFaq(), TODO: Verify commercial policy, TODO: Define support channels and SLA, TODO: Cevaplar yayın öncesi doğrulanmalı.

### Community 151 - "4.10 Pricing"
Cohesion: 0.29
Nodes (7): 4.10 Pricing, CTA, Features, Layout, Plan, Price, Title

### Community 152 - "4.5 Work-Order Lifecycle"
Cohesion: 0.29
Nodes (7): 4.5 Work-Order Lifecycle, Interaction, Reference, Shared Story, Steps, Supporting Copy, Title

### Community 153 - "HeroOperationsFlow.tsx"
Cohesion: 0.33
Nodes (3): HeroOperationsFlow(), TODO: Verify all three claims before publishing (LANDING_CONTENT.md §2), TRUST_ITEMS

### Community 154 - "OperationalFeatureBento.tsx"
Cohesion: 0.29
Nodes (4): FEATURES, TODO: Verify pricing before publishing, TODO: Fiyat, deneme süresi ve iptal koşulları yayın öncesi doğrulanmalı., SinglePlanPricing()

### Community 155 - "10. Pilot Program"
Cohesion: 0.33
Nodes (6): 10. Pilot Program, Benefits, Copy, CTA, Eyebrow, Heading

### Community 156 - "13. Final CTA"
Cohesion: 0.33
Nodes (6): 13. Final CTA, Copy, Heading, Primary CTA, Secondary CTA, Trust Line

### Community 157 - "4.2 Split Hero — Live Operation"
Cohesion: 0.33
Nodes (6): 4.2 Split Hero — Live Operation, Interaction, Left Content, Purpose, References, Right Visual

### Community 158 - "4.4 Before / After Comparison"
Cohesion: 0.33
Nodes (6): 4.4 Before / After Comparison, Left: Without Saha Flow, Purpose, Reference, Right: With Saha Flow, Section Title

### Community 159 - "4.6 Web + Mobile Synchronization"
Cohesion: 0.33
Nodes (6): 4.6 Web + Mobile Synchronization, Desktop Layout, Main Message, Mobile Layout, Purpose, Required Product States

### Community 160 - "StateNotifier"
Cohesion: 0.40
Nodes (5): AuthNotifier, JobExecutionNotifier, JobExecutionState, AuthState, StateNotifier

### Community 162 - "14. Footer"
Cohesion: 0.40
Nodes (5): 14. Footer, Company, Legal, Product, Resources

### Community 163 - "5. Before / After"
Cohesion: 0.40
Nodes (5): 5. Before / After, Section Heading, Supporting Copy, With Saha Flow, Without Saha Flow

### Community 164 - "7. Web + Mobile Showcase"
Cohesion: 0.40
Nodes (5): 7. Web + Mobile Showcase, Copy, Heading, Mobile Caption, Web Caption

### Community 165 - "4.12 Final CTA"
Cohesion: 0.40
Nodes (5): 4.12 Final CTA, Actions, Copy, Title, Visual

### Community 166 - "4.13 Footer"
Cohesion: 0.40
Nodes (5): 4.13 Footer, Company, Legal, Product, Resources

### Community 167 - "4.1 Navbar"
Cohesion: 0.40
Nodes (5): 4.1 Navbar, Behavior, Links, Purpose, Reference Use

### Community 168 - "4.7 Problem-Focused Feature Bento"
Cohesion: 0.40
Nodes (5): 4.7 Problem-Focused Feature Bento, Cards, Interaction, Layout, Title

### Community 169 - "Tasarım Referans Kuralları"
Cohesion: 0.50
Nodes (3): Kural, Referans Siteler, Tasarım Referans Kuralları

### Community 170 - "5. Responsive Plan"
Cohesion: 0.50
Nodes (4): 1024px+, 320–767px, 5. Responsive Plan, 768–1023px

### Community 171 - "2. Main Creative Direction"
Cohesion: 0.67
Nodes (3): 2. Main Creative Direction, Selected Direction, Supporting Influences

### Community 172 - "4.3 Trust Strip"
Cohesion: 0.67
Nodes (3): 4.3 Trust Strip, Layout, Purpose

### Community 173 - "4.8 Security and Control"
Cohesion: 0.67
Nodes (3): 4.8 Security and Control, Important, Purpose

## Knowledge Gaps
- **891 isolated node(s):** `main`, `_rootNavigatorKey`, `_shellNavigatorKey`, `authState`, `child` (+886 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WorkOrder` connect `Work Order Domain` to `Module 74`, `.onUpdate`, `Module 86`, `Module 121`, `Module 31`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `User` connect `JPA Audit Entities` to `Membership`, `Module 76`, `Module 77`, `Module 117`, `Module 85`, `Module 22`, `Module 89`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `JwtService` connect `Module 22` to `TenantFilter`, `JPA Audit Entities`, `Module 117`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Customer` (e.g. with `.create_shouldCreateCustomer()` and `.deactivate_shouldSetActiveToFalse()`) actually correct?**
  _`Customer` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `main`, `_rootNavigatorKey`, `_shellNavigatorKey` to the rest of the system?**
  _891 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `REST API Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.05515151515151515 - nodes in this community are weakly interconnected._
- **Should `Spring Security & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.05300207039337474 - nodes in this community are weakly interconnected._