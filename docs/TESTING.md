# İşAkış - Test Dokumani

## Test Stratejisi Ozeti

İşAkış, test piramidi yaklasimiyla katmanli bir test stratejisi uygular:

```
        ╱  E2E   ╲          Playwright (web), integration_test (mobil)
       ╱──────────╲
      ╱ Integration ╲       Testcontainers (backend), API contract tests
     ╱────────────────╲
    ╱    Unit Tests     ╲    JUnit 5 + MockK (backend), Vitest (web), flutter_test
   ╱──────────────────────╲
```

Coverage hedefleri:
- Backend unit test: >= 80%
- Backend integration test: >= 60%
- Web unit/component test: >= 75%
- Mobile unit/widget test: >= 70%

## Backend Test

### Unit Tests (JUnit 5 + MockK)

```bash
# Tum unit testler
./gradlew :services:api:test

# Belirli paket
./gradlew :services:api:test --tests "com.sahaflow.domain.booking.*"

# Belirli test sinifi
./gradlew :services:api:test --tests "com.sahaflow.domain.auth.AuthServiceTest"
```

Test iskeleti:

```kotlin
class AuthServiceTest {
    @MockK
    private lateinit var userRepository: UserRepository

    @MockK
    private lateinit var tokenProvider: TokenProvider

    @InjectMockKs
    private lateinit var authService: AuthService

    @BeforeEach
    fun setup() = MockKAnnotations.init(this, relaxUnitFun = true)

    @Test
    fun `login with valid credentials should return token pair`() {
        // Given
        val email = "test@example.com"
        val password = "ValidP@ss1"
        val user = createTestUser(email, password)
        every { userRepository.findByEmail(email) } returns user

        // When
        val result = authService.login(email, password)

        // Then
        result shouldNotBeNull ""
        result.accessToken shouldNotBeNullOrEmpty ""
        result.refreshToken shouldNotBeNullOrEmpty ""
    }
}
```

### Integration Tests (Testcontainers)

Gerçek PostgreSQL container'i ile:

```kotlin
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookingIntegrationTest {

    companion object {
        @Container
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:16-alpine")
            .withDatabaseName("sahaflow_test")
            .withUsername("sahaflow")
            .withPassword("test")

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
        }
    }

    @Autowired
    private lateinit var webTestClient: WebTestClient

    @Test
    fun `should create booking and return 201`() {
        webTestClient.post()
            .uri("/api/v1/tenants/{tenantId}/bookings", tenantId)
            .bodyValue(createBookingRequest())
            .exchange()
            .expectStatus().isCreated
            .expectBody<BookingResponse>()
            .consumeWith { response ->
                response.responseBody!!.status shouldEqual BookingStatus.PENDING
            }
    }
}
```

### Contract Tests

API uyumlulugunu garanti altina almak icin Spring Cloud Contract veya Pact.

## Frontend Test

### Unit Tests (Vitest)

```bash
cd web
npm test                     # Watch mode
npm test -- --coverage       # Coverage raporu
npm test -- -t "formatDate"  # Belirli test adina gore
```

```typescript
// lib/utils/date.test.ts
import { describe, it, expect } from 'vitest';
import { formatBookingDate } from './date';

describe('formatBookingDate', () => {
  it('should format ISO date to Turkish locale', () => {
    const result = formatBookingDate('2026-07-21T14:00:00Z');
    expect(result).toBe('21 Temmuz 2026, 17:00');
  });

  it('should return empty string for null input', () => {
    expect(formatBookingDate(null!)).toBe('');
  });
});
```

### Component Tests (Testing Library)

```typescript
// components/features/BookingCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BookingCard } from './BookingCard';

describe('BookingCard', () => {
  it('should display court name and time', () => {
    render(<BookingCard
      courtName="Kort 1"
      date="2026-07-21T14:00:00Z"
      status="CONFIRMED"
    />);

    expect(screen.getByText('Kort 1')).toBeInTheDocument();
    expect(screen.getByText(/CONFIRMED/)).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```bash
cd web
npx playwright install
npm run test:e2e                # Tum E2E testler
npm run test:e2e -- --grep "login"  # Belirli test
npx playwright test --ui        # UI modunda
```

```typescript
import { test, expect } from '@playwright/test';

test('should login and show dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'ValidP@ss1');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

## Mobil Test (Flutter)

### Unit Tests

```bash
cd mobile
flutter test test/unit/
flutter test test/unit/services/auth_service_test.dart
```

### Widget Tests

```dart
testWidgets('should show available courts', (tester) async {
  await tester.pumpWidget(
    MaterialApp(home: CourtListScreen()),
  );

  expect(find.text('Musait Kortlar'), findsOneWidget);
  expect(find.byType(CourtCard), findsNWidgets(3));
});
```

### Integration Tests

```bash
cd mobile
flutter test integration_test/
```

## Test Verisi

- Test verileri factory pattern ile olusturulur
- Her test sinifi kendi veri setini hazirlar (bagimsizlik)
- Paylasilan test helper'lari: `TestDataFactory`, `createTestUser()`, `createTestBooking()`
- Hassas/gercek veri testlerde kesinlikle kullanilmaz

```kotlin
object TestDataFactory {
    fun createTestUser(
        email: String = "test@example.com",
        tenantId: UUID = UUID.randomUUID()
    ) = User(
        id = UUID.randomUUID(),
        email = email,
        passwordHash = BCrypt.withDefaults().hashToString(12, "ValidP@ss1".toCharArray()),
        tenantId = tenantId,
        role = Role.CUSTOMER
    )
}
```

## CI'da Testler

| Job              | Trigger            | Sure Limit |
| ---------------- | ------------------ | ---------- |
| test-backend     | PR main, push main | 15 dk      |
| test-web         | PR main, push main | 10 dk      |
| test-mobile      | PR main, push main | 10 dk      |
| integration-test | PR main only       | 15 dk      |

Tum test job'lari `github-actions.yml` icinde tanimlidir. Coverage raporlari artifact olarak saklanir.

## Test Yazma Kilavuzu

### Genel Prensipler

1. **AAA Pattern**: Arrange, Act, Assert
2. **Tek sorumluluk**: Her test tek bir davranisi dogrulamali
3. **Anlamli isimlendirme**: `should_expectedBehavior_whenCondition`
4. **Bagimsizlik**: Testler birbirinden bagimsiz calisabilmeli
5. **Deterministik**: Ayni input her zaman ayni sonucu vermeli
6. **Hizli**: Unit testler ms duzeyinde, integration saniyeler icinde tamamlanmali

### Kadin

- [ ] Yeni her domain sinifi icin unit test yazildi mi?
- [ ] Yeni her endpoint icin integration test yazildi mi?
- [ ] Mutant testleri (boundary, null, empty input) kapsandi mi?
- [ ] Coverage hedefleri karsilandi mi?
- [ ] CI pipeline'inda testler basariyla geciyor mu?
