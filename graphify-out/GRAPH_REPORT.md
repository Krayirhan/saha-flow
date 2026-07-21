# Graph Report - D:/saha-flow  (2026-07-22)

## Corpus Check
- 119 files · ~199,779 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2314 nodes · 3741 edges · 163 communities (126 shown, 37 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 139 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Spring Security & Auth
- API Error Handling
- Tenant & Repository Layer
- Work Order Domain
- Mobile App Core
- Project Documentation
- Audit & Event System
- Customer Feature (Web)
- Web Layout & Navigation
- UI Component Library
- Marketing Landing Page
- Auth & Brand UI
- Exception Handlers
- Mobile UI & Theming
- Mobile API Client
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 150
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 161

## God Nodes (most connected - your core abstractions)
1. `WorkOrder` - 56 edges
2. `User` - 47 edges
3. `Customer` - 37 edges
4. `CustomerAddress` - 32 edges
5. `AuditEvent` - 28 edges
6. `WorkOrderStatus` - 27 edges
7. `cn()` - 26 edges
8. `Tenant` - 26 edges
9. `WorkOrderService` - 24 edges
10. `PagedResponse` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Core Tech Stack (Java21 + Next.js + Flutter + PostgreSQL)` --semantically_similar_to--> `Spring Boot 3.4 + Java 21 Backend`  [INFERRED] [semantically similar]
  README.md → docs/ARCHITECTURE.md
- `Transactional Outbox Pattern for Domain Events` --semantically_similar_to--> `Async PDF Service Report Generation`  [INFERRED] [semantically similar]
  05_TECH_STACK_DECISIONS.md → 04_SOLUTION_ARCHITECTURE.md
- `flutter_secure_storage` --conceptually_related_to--> `Security Document`  [INFERRED]
  apps/mobile/pubspec.yaml → docs/SECURITY.md
- `Docker Compose Deployment` --references--> `Docker Compose Development Config`  [INFERRED]
  docs/DEPLOYMENT.md → infra/docker-compose.yml
- `Security Scan Job (Gitleaks + Trivy + OWASP)` --conceptually_related_to--> `Security Document`  [INFERRED]
  infra/ci/github-actions.yml → docs/SECURITY.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Security Triad: Tenant Isolation + RBAC + JWT form the core auth/authz stack** — concept_tenant_isolation, concept_rbac, concept_jwt_auth [INFERRED 0.95]
- **Core Tech Stack: Next.js + Spring Boot + Flutter form the three-tier application platform** — tech_nextjs_14, tech_spring_boot_3, tech_flutter_3 [EXTRACTED 1.00]
- **MVP Core Flow: WorkOrder state machine + Offline-first mobile + PDF service report together deliver the end-to-end field service workflow** — concept_workorder_state_machine, concept_offline_first_mobile, concept_pdf_service_report [INFERRED 0.85]
- **Design Reference Ecosystem (VibeUI, Refero, Aceternity, SuperDesign)** — docs_design_references_md_vibeui, docs_design_references_md_refero, docs_design_references_md_aceternity, docs_design_references_md_superdesign, apps_web_design_md, docs_design_landing_redesign_plan_md, docs_design_reference_guide_md [EXTRACTED 1.00]
- **Multi-Tenant Security Controls** — docs_architecture_md_multitenant, docs_security_md_rls, docs_security_md_rbac, 19_traceability_matrix_tenant_isolation, 18_operations_runbook_tenant_isolation_breach [INFERRED 0.90]
- **CI/CD Pipeline Jobs** — infra_ci_github_actions_yml, infra_ci_github_actions_yml_security_scan, infra_ci_github_actions_yml_build_docker, docs_testing_md_testcontainers, docs_testing_md_playwright [EXTRACTED 1.00]
- **Mobile Offline-First Stack** — apps_mobile_pubspec_yaml_sembast, apps_mobile_pubspec_yaml_riverpod, apps_mobile_pubspec_yaml_go_router, 19_traceability_matrix_offline_mobile, 20_project_structure_mobile_clean_arch [INFERRED 0.85]

## Communities (163 total, 37 thin omitted)

### Community 0 - "Spring Security & Auth"
Cohesion: 0.05
Nodes (45): EnableMethodSecurity, EnableWebSecurity, HttpSecurity, OncePerRequestFilter, Order, SecurityFilterChain, Bean, Configuration (+37 more)

### Community 1 - "API Error Handling"
Cohesion: 0.11
Nodes (23): ResourceNotFoundException, WorkOrderCreateRequest, WorkOrderResponse, WorkOrderUpdateRequest, Page, PageRequest, Service, Transactional (+15 more)

### Community 2 - "Tenant & Repository Layer"
Cohesion: 0.06
Nodes (21): JpaRepository, Entity, PrePersist, PreUpdate, Table, Tenant, Repository, TenantRepository (+13 more)

### Community 3 - "Work Order Domain"
Cohesion: 0.04
Nodes (6): Entity, PrePersist, PreUpdate, Table, WorkOrder, work_order_status_history

### Community 4 - "Mobile App Core"
Cohesion: 0.04
Nodes (49): accessTokenKey, apiDateFormat, appBuildNumber, AppConstants, appName, appVersion, baseUrlDev, baseUrlProd (+41 more)

### Community 5 - "Project Documentation"
Cohesion: 0.07
Nodes (49): Executive Summary, Assumptions and Open Questions, Product Requirements Document, Domain Model, Solution Architecture, Tech Stack Decisions, Frontend Architecture and Security, Backend Architecture and Security (+41 more)

### Community 6 - "Audit & Event System"
Cohesion: 0.07
Nodes (13): Async, EventListener, AuditEvent, Entity, PrePersist, Table, AuditEventListener, Component (+5 more)

### Community 7 - "Customer Feature (Web)"
Cohesion: 0.12
Nodes (33): CustomerFilters, UseCustomerDetailReturn, UseCustomersReturn, DashboardData, RECENT_WORK_ORDERS_PARAMS, WorkOrderList(), useWorkOrderDetail(), useWorkOrders() (+25 more)

### Community 8 - "Web Layout & Navigation"
Cohesion: 0.09
Nodes (32): Header(), HeaderProps, titleMap, useAuth(), AuthState, LoginFormValues, UseAuthReturn, getCurrentUser() (+24 more)

### Community 9 - "UI Component Library"
Cohesion: 0.11
Nodes (28): Badge, Button, ButtonProps, sizes, variantClass, EmptyState(), EmptyStateProps, ErrorState() (+20 more)

### Community 10 - "Marketing Landing Page"
Cohesion: 0.07
Nodes (16): FINAL_STATES, FlowState, TODO: Verify all three claims before publishing (LANDING_CONTENT.md §2), TRUST_ITEMS, LifecycleStickySection(), STEPS, useReducedMotion(), OperationTimeline() (+8 more)

### Community 11 - "Auth & Brand UI"
Cohesion: 0.08
Nodes (21): BrandLogo, AuthLayout(), AuthLayoutProps, navItems, Sidebar(), FOOTER_LINKS, MarketingNavbar(), MobileMenuButtonProps (+13 more)

### Community 12 - "Exception Handlers"
Cohesion: 0.17
Nodes (16): AccessDeniedException, AuthenticationException, DataIntegrityViolationException, ExceptionHandler, HttpMessageNotReadableException, IdempotencyConflictException, MaxUploadSizeExceededException, MethodArgumentNotValidException (+8 more)

### Community 13 - "Mobile UI & Theming"
Cohesion: 0.07
Nodes (29): ScaffoldWithNavBar, AppTheme, PhotoCapture, WorkOrderCard, action, build, EmptyState, icon (+21 more)

### Community 14 - "Mobile API Client"
Cohesion: 0.06
Nodes (30): ApiEndpoints, basePath, changePassword, checklistItemComplete, completeWorkOrder, customerDetail, customerHistory, dashboard (+22 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (5): Customer, Entity, PrePersist, PreUpdate, Table

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (5): Entity, PrePersist, PreUpdate, Table, User

### Community 17 - "Community 17"
Cohesion: 0.07
Nodes (28): addPhoto, canSubmit, ChecklistItem, checklistItems, copyWith, error, fromJson, id (+20 more)

### Community 18 - "Community 18"
Cohesion: 0.07
Nodes (4): CustomerAddress, Entity, PrePersist, Table

### Community 19 - "Community 19"
Cohesion: 0.08
Nodes (13): WorkOrderStatus, APPROVED, ASSIGNED, CANCELLED, COMPLETED, IN_PROGRESS, INVOICED, OPEN (+5 more)

### Community 20 - "Community 20"
Cohesion: 0.07
Nodes (27): accent, accentLight, AppColors, background, disabled, divider, error, errorLight (+19 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (27): build, _clear, color, createState, existingPath, _hasDrawn, _onPanEnd, _onPanStart (+19 more)

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (13): SettingsPage(), PermissionGuard, CardSpotlight, Select, SelectOption, SelectProps, WorkOrderForm(), createWorkOrder() (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.08
Nodes (3): ErrorResponse, JsonInclude, ValidationError

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (26): apiClientProvider, authState, build, _calculateSelectedIndex, child, createState, initState, _rootNavigatorKey (+18 more)

### Community 25 - "Community 25"
Cohesion: 0.07
Nodes (26): _connectivityService, copyWith, createdAt, data, _dio, dispose, enqueue, fromJson (+18 more)

### Community 26 - "Community 26"
Cohesion: 0.07
Nodes (26): address, city, createdAt, customerName, customerPhone, deviceBrand, deviceModel, deviceType (+18 more)

### Community 27 - "Community 27"
Cohesion: 0.07
Nodes (26): address, canComplete, canStart, city, copyWith, createdAt, customerName, customerPhone (+18 more)

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (11): Claims, Component, FilterChain, HttpServletResponse, Override, SecretKey, JwtService, HttpServletRequest (+3 more)

### Community 29 - "Community 29"
Cohesion: 0.08
Nodes (25): dependencies, clsx, date-fns, @hookform/resolvers, lucide-react, next, react, react-dom (+17 more)

### Community 30 - "Community 30"
Cohesion: 0.08
Nodes (25): devDependencies, autoprefixer, eslint, eslint-config-next, msw, @playwright/test, prettier, @testing-library/jest-dom (+17 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (18): ConstraintValidator, ConstraintValidatorContext, Override, TenantIdValidator, Constraint, Documented, Retention, Target (+10 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (22): DashboardScreen, build, _buildChecklist, _buildChecklistItem, ChecklistScreen, _ChecklistScreenState, createState, orderId (+14 more)

### Community 33 - "Community 33"
Cohesion: 0.09
Nodes (23): apiClient, apiClientProvider, clearError, client, connectivity, connectivityService, copyWith, db (+15 more)

### Community 34 - "Community 34"
Cohesion: 0.09
Nodes (21): build, onTap, workOrder, build, _buildActionButtons, _buildCustomerSection, _buildDatesSection, _buildDetail (+13 more)

### Community 35 - "Community 35"
Cohesion: 0.11
Nodes (10): Entity, PrePersist, Table, Role, membership, permission, role, role_permission (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.09
Nodes (21): _calculateBackoff, _connectivityService, _createAuthInterceptor, _createConnectivityInterceptor, _createCorrelationIdInterceptor, _createErrorInterceptor, _createRetryInterceptor, delete (+13 more)

### Community 37 - "Community 37"
Cohesion: 0.15
Nodes (12): DeleteMapping, Map, AddressResponse, CustomerResponse, CustomerController, GetMapping, PostMapping, PreAuthorize (+4 more)

### Community 38 - "Community 38"
Cohesion: 0.22
Nodes (8): EnumSource, ParameterizedTest, Component, WorkOrderStateMachine, BeforeEach, DisplayName, Test, WorkOrderServiceTest

### Community 39 - "Community 39"
Cohesion: 0.13
Nodes (16): main, build, LoginScreen, main, setPreferredOrientations, main, main, ConsumerWidget (+8 more)

### Community 40 - "Community 40"
Cohesion: 0.16
Nodes (13): Input, InputProps, Textarea, TextareaProps, LoginForm(), CustomerInput, customerSchema, LoginInput (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.19
Nodes (12): LoginResponse, TokenRefreshRequest, AuthController, ExceptionHandler, HttpServletRequest, Logger, PostMapping, ProblemDetail (+4 more)

### Community 42 - "Community 42"
Cohesion: 0.10
Nodes (19): _apiDateFormat, _apiDateTimeFormat, _dateFormat, DateFormatter, dateOnly, _dateTimeFormat, formatDate, formatDateTime (+11 more)

### Community 43 - "Community 43"
Cohesion: 0.23
Nodes (11): BadCredentialsException, LoginRequest, LoginResponse, PasswordEncoder, RegisterRequest, AuthenticationService, Service, Transactional (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.11
Nodes (3): JsonInclude, Page, PagedResponse

### Community 45 - "Community 45"
Cohesion: 0.11
Nodes (17): clearAll, getAccessToken, getRefreshToken, getUserEmail, getUserId, hasTokens, saveTokens, saveUserEmail (+9 more)

### Community 46 - "Community 46"
Cohesion: 0.26
Nodes (9): Customer, CustomerRepository, CustomerRequest, CustomerResponse, CustomerService, Page, PageRequest, Service (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.25
Nodes (8): Page, Pageable, Query, Repository, WorkOrderRepository, location_event, work_order, work_order_assignment

### Community 48 - "Community 48"
Cohesion: 0.12
Nodes (17): ApiClient, _apiClient, completedJobs, copyWith, DashboardNotifier, DashboardState, DashboardSummary, error (+9 more)

### Community 49 - "Community 49"
Cohesion: 0.10
Nodes (16): build, _capturePhoto, onPhotoAdded, onPhotoRemoved, photoPaths, build, fontSize, _getBackgroundColor (+8 more)

### Community 50 - "Community 50"
Cohesion: 0.23
Nodes (7): Page, PageRequest, Service, Transactional, User, UserRepository, UserService

### Community 51 - "Community 51"
Cohesion: 0.11
Nodes (4): Entity, PrePersist, Table, WorkOrderAssignment

### Community 52 - "Community 52"
Cohesion: 0.12
Nodes (16): authenticated, AuthState, AuthStatus, clearError, copyWith, error, isAuthenticated, isLoading (+8 more)

### Community 53 - "Community 53"
Cohesion: 0.15
Nodes (16): authStateProvider, build, _buildBody, _buildPendingAlert, _buildQuickActions, _buildStatCard, _buildStatsGrid, _buildWelcomeCard (+8 more)

### Community 54 - "Community 54"
Cohesion: 0.12
Nodes (16): clearAll, close, count, _database, delete, deleteAll, getAll, _getStore (+8 more)

### Community 55 - "Community 55"
Cohesion: 0.12
Nodes (16): _apiClient, _cacheWorkOrder, _cacheWorkOrders, completeChecklistItem, completeWorkOrder, _getCachedWorkOrder, _getCachedWorkOrders, getWorkOrderDetail (+8 more)

### Community 56 - "Community 56"
Cohesion: 0.12
Nodes (14): extends, ignorePatterns, node_modules/, plugins, rules, import/order, @next/next/no-img-element, no-console (+6 more)

### Community 57 - "Community 57"
Cohesion: 0.26
Nodes (6): Bucket, Configuration, RateLimitConfig, DisplayName, Test, RateLimitTest

### Community 58 - "Community 58"
Cohesion: 0.20
Nodes (7): HttpServletRequestWrapper, ReadListener, CachedBodyHttpServletRequest, CachedBodyServletInputStream, HttpServletRequest, Override, ServletInputStream

### Community 59 - "Community 59"
Cohesion: 0.12
Nodes (14): ErrorCode, DUPLICATE_RESOURCE, FILE_TOO_LARGE, FORBIDDEN, IDEMPOTENCY_CONFLICT, INTERNAL_ERROR, INVALID_FILE_TYPE, INVALID_STATE_TRANSITION (+6 more)

### Community 60 - "Community 60"
Cohesion: 0.13
Nodes (15): apiClient, copyWith, error, _initialLoaded, isLoading, loadWorkOrders, localDb, refresh (+7 more)

### Community 61 - "Community 61"
Cohesion: 0.24
Nodes (9): GetMapping, PostMapping, PreAuthorize, PutMapping, RequestMapping, ResponseEntity, RestController, UpdateProfileRequest (+1 more)

### Community 62 - "Community 62"
Cohesion: 0.13
Nodes (14): AnimatedWidget, AnimationController, AnimatedBuilder, _animationController, build, connectivityService, _connectivitySub, createState (+6 more)

### Community 63 - "Community 63"
Cohesion: 0.16
Nodes (14): build, createState, dispose, _emailController, _formKey, _handleLogin, LoginForm, _LoginFormState (+6 more)

### Community 64 - "Community 64"
Cohesion: 0.14
Nodes (14): actionError, completeWorkOrder, copyWith, error, isActionLoading, isLoading, loadDetail, _orderId (+6 more)

### Community 65 - "Community 65"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, module (+7 more)

### Community 66 - "Community 66"
Cohesion: 0.13
Nodes (4): Entity, PrePersist, Table, Membership

### Community 67 - "Community 67"
Cohesion: 0.13
Nodes (4): Entity, PrePersist, Table, Permission

### Community 68 - "Community 68"
Cohesion: 0.28
Nodes (8): LoginRequest, RegisterRequest, AuthControllerTest, AutoConfigureMockMvc, DisplayName, MockMvc, ObjectMapper, Test

### Community 69 - "Community 69"
Cohesion: 0.20
Nodes (8): AutoConfigureMockMvc, BeforeEach, DisplayName, MockMvc, ObjectMapper, Test, WorkOrderControllerIntegrationTest, WithMockUser

### Community 70 - "Community 70"
Cohesion: 0.25
Nodes (6): AfterEach, CustomerServiceTest, BeforeEach, DisplayName, ExtendWith, Test

### Community 71 - "Community 71"
Cohesion: 0.14
Nodes (13): ApiException, data, _extractMessage, fromDioError, isConflict, isConnectionError, isUnauthorized, message (+5 more)

### Community 72 - "Community 72"
Cohesion: 0.14
Nodes (13): AuthService, _dio, login, logout, _ref, refreshAccessToken, _tokenStorage, tryAutoLogin (+5 more)

### Community 73 - "Community 73"
Cohesion: 0.24
Nodes (14): Web Design System, Design Color Tokens, Flow Line Visual System, Landing Page Content, Hero: Field Service Lifecycle Copy, Pricing Plan (₺119/user/month), Landing Redesign Plan, Operations Control Center Direction (+6 more)

### Community 74 - "Community 74"
Cohesion: 0.31
Nodes (7): CustomerRepository, Page, Pageable, Query, Repository, customer, customer_address

### Community 75 - "Community 75"
Cohesion: 0.17
Nodes (11): _connectivity, _connectivityController, ConnectivityService, connectivityStream, dispose, _init, _isConnected, Connectivity (+3 more)

### Community 76 - "Community 76"
Cohesion: 0.24
Nodes (11): build, _buildList, _buildStatusFilter, createState, initState, WorkOrderListScreen, _WorkOrderListScreenState, workOrderListProvider (+3 more)

### Community 77 - "Community 77"
Cohesion: 0.23
Nodes (8): Resource, FileController, GetMapping, MultipartFile, PostMapping, RequestMapping, ResponseEntity, RestController

### Community 78 - "Community 78"
Cohesion: 0.20
Nodes (3): Logger, Service, Uuid

### Community 79 - "Community 79"
Cohesion: 0.35
Nodes (5): BeforeEach, DisplayName, ExtendWith, Test, UserServiceTest

### Community 81 - "Community 81"
Cohesion: 0.20
Nodes (11): Operations Runbook, Runbook: Backup Restore, Runbook: Connection Pool Exhaustion, Runbook: Database Slowness, Runbook: Deployment Rollback, Runbook: Login Failure, Runbook: Secret Leak, Deployment Document (+3 more)

### Community 82 - "Community 82"
Cohesion: 0.18
Nodes (11): scripts, build, dev, format, lint, postbuild, start, test (+3 more)

### Community 83 - "Community 83"
Cohesion: 0.25
Nodes (7): CorsFilter, List, AddressRequest, CustomerRequest, CorsConfig, Bean, Configuration

### Community 84 - "Community 84"
Cohesion: 0.18
Nodes (11): Testing Document, Playwright E2E Tests, Test Pyramid Strategy, Testcontainers Integration Tests, GitHub Actions CI/CD Pipeline, Docker Build + SBOM Job, Security Scan Job (Gitleaks + Trivy + OWASP), Docker Compose Production Override (+3 more)

### Community 85 - "Community 85"
Cohesion: 0.29
Nodes (7): FileInfo, FileStorageService, JdbcClient, Logger, MultipartFile, Service, Transactional

### Community 87 - "Community 87"
Cohesion: 0.38
Nodes (6): HealthController, GetMapping, JdbcClient, RequestMapping, ResponseEntity, RestController

### Community 88 - "Community 88"
Cohesion: 0.22
Nodes (8): combine, email, maxLength, minLength, password, phone, required, Validators

### Community 89 - "Community 89"
Cohesion: 0.22
Nodes (8): address, _createMockWorkOrder, customerName, main, orderNumber, status, package:saha_flow_mobile/features/work_orders/domain/work_order.dart, package:saha_flow_mobile/features/work_orders/presentation/widgets/work_order_card.dart

### Community 90 - "Community 90"
Cohesion: 0.22
Nodes (8): fs, path, publicSource, publicTarget, root, standalone, staticSource, staticTarget

### Community 91 - "Community 91"
Cohesion: 0.39
Nodes (7): AbstractIntegrationTest, DynamicPropertyRegistry, DynamicPropertySource, Logger, PostgreSQLContainer, SpringBootTest, Testcontainers

### Community 92 - "Community 92"
Cohesion: 0.36
Nodes (6): DashboardPage(), RecentWorkOrders(), RecentWorkOrdersProps, StatsCard, useDashboard(), formatCurrency

### Community 93 - "Community 93"
Cohesion: 0.25
Nodes (7): exclude, include, node_modules, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx

### Community 94 - "Community 94"
Cohesion: 0.29
Nodes (7): Traceability Matrix, Traceability: High Availability (NFR-AVAIL-01), Traceability: KVKK Compliance (NFR-SEC-01), Traceability: Offline Mobile (FR-MOB-01), Traceability: PDF Service Report (FR-RPT-01), Traceability: Work Order Status (FR-WO-01), KVKK Compliance (Turkish Data Protection)

### Community 95 - "Community 95"
Cohesion: 0.29
Nodes (7): Generation Report, ADR Summary (12 Decisions), Bootstrap Report, Logo Design Brief, Project README, İşAkış SaaS Platform, Core Tech Stack (Java21 + Next.js + Flutter + PostgreSQL)

### Community 96 - "Community 96"
Cohesion: 0.29
Nodes (3): FEATURES, TODO: Verify pricing before publishing, TODO: Fiyat, deneme süresi ve iptal koşulları yayın öncesi doğrulanmalı.

### Community 97 - "Community 97"
Cohesion: 0.33
Nodes (3): getSession(), parseSession(), Session

### Community 98 - "Community 98"
Cohesion: 0.29
Nodes (7): paths, @components/*, @features/*, @lib/*, ./src/components/*, ./src/features/*, ./src/lib/*

### Community 100 - "Community 100"
Cohesion: 0.29
Nodes (6): audit_event, customer_approval, idempotency_keys, media_object, outbox_event, service_report

### Community 101 - "Community 101"
Cohesion: 0.33
Nodes (6): Runbook: Tenant Data Leak, Traceability: Tenant Data Isolation (FR-AUTH-01), Architecture Document, Multi-Tenant Strategy: Shared DB Row-Level, PostgreSQL 16 + PostGIS, Spring Boot 3.4 + Java 21 Backend

### Community 102 - "Community 102"
Cohesion: 0.33
Nodes (6): Traceability: Secure Authentication (FR-AUTH-02), JWT Access + Refresh Token Auth, Security Document, BCrypt Password Hashing (cost >= 12), RBAC Role Hierarchy, PostgreSQL Row-Level Security

### Community 103 - "Community 103"
Cohesion: 0.33
Nodes (5): getCurrentPosition, hasLocationPermission, PermissionService, requestLocationPermission, package:geolocator/geolocator.dart

### Community 104 - "Community 104"
Cohesion: 0.33
Nodes (5): engines, node, name, private, version

### Community 105 - "Community 105"
Cohesion: 0.53
Nodes (4): Bean, Configuration, OpenAPI, OpenApiConfig

### Community 106 - "Community 106"
Cohesion: 0.53
Nodes (4): ConfigurationPropertiesScan, EnableAsync, SahaFlowApplication, SpringBootApplication

### Community 107 - "Community 107"
Cohesion: 0.47
Nodes (3): HttpStatus, ProblemDetail, ProblemDetailBuilder

### Community 108 - "Community 108"
Cohesion: 0.60
Nodes (3): DisplayName, Test, TenantIsolationTest

### Community 109 - "Community 109"
Cohesion: 0.40
Nodes (5): Project Structure Document, Backend Module Structure (com.sahaflow), Frontend Feature-Based Structure, Mobile Clean Architecture (Presentation/Domain/Data), Monorepo Architecture Decision

### Community 110 - "Community 110"
Cohesion: 0.40
Nodes (5): AuthNotifier, JobExecutionNotifier, JobExecutionState, AuthState, StateNotifier

### Community 111 - "Community 111"
Cohesion: 0.40
Nodes (5): Mobile pubspec.yaml, flutter_secure_storage, go_router Navigation, Riverpod State Management, Sembast Local Storage

### Community 113 - "Community 113"
Cohesion: 0.50
Nodes (3): nextConfig, path, securityHeaders

### Community 116 - "Community 116"
Cohesion: 0.50
Nodes (4): lib, dom, dom.iterable, esnext

### Community 117 - "Community 117"
Cohesion: 0.50
Nodes (4): Local Development Guide, Spring Boot application-dev.yml Config, Spring Boot application-prod.yml Config, Spring Boot application.yml Base Config

### Community 118 - "Community 118"
Cohesion: 0.83
Nodes (3): Auditable, Retention, Target

### Community 119 - "Community 119"
Cohesion: 0.67
Nodes (3): Design References Rules, Aceternity UI - Animated React/Tailwind Components, VibeUI - Dashboard UI Reference

### Community 120 - "Community 120"
Cohesion: 1.00
Nodes (3): İşAkış Logo (Mobile), İşAkış Logo (Web Brand), İşAkış Brand Identity

## Knowledge Gaps
- **697 isolated node(s):** `main`, `dio`, `_tokenStorage`, `_connectivityService`, `_syncQueue` (+692 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `Community 16` to `Community 66`, `Community 99`, `Community 78`, `Community 79`, `Community 61`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `WorkOrder` connect `Work Order Domain` to `Community 34`, `Community 19`, `Community 38`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `Customer` connect `Community 15` to `Community 69`, `Community 70`, `Community 108`, `Community 18`, `Community 83`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Customer` (e.g. with `.create_shouldCreateCustomer()` and `.deactivate_shouldSetActiveToFalse()`) actually correct?**
  _`Customer` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `main`, `dio`, `_tokenStorage` to the rest of the system?**
  _697 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Spring Security & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.05191146881287726 - nodes in this community are weakly interconnected._
- **Should `API Error Handling` be split into smaller, more focused modules?**
  _Cohesion score 0.108708357685564 - nodes in this community are weakly interconnected._