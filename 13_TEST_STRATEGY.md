# Test Stratejisi

> Proje: İşAkış
> Dokuman: Test Stratejisi (Test Strategy)
> Durum: Draft
> Uretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

---

## 1. Test Piramidi

```
                    /\
                   /  \
                  /E2E \             Playwright (5-10 test)
                 /      \
                /--------\
               /  API     \           API Contract / E2E (20-30 test)
              / Contract   \
             /--------------\
            /   Integration   \      Spring Boot Test + Testcontainers (60-80 test)
           /                   \
          /----------------------\
         /     Unit Tests         \   JUnit+Mockito, Vitest, flutter_test (300+ test)
        /___________________________\
```

**Dagilim Hedefleri:**
- Unit test: %70
- Integration test: %20
- API Contract / E2E: %10

---

## 2. Test Seviyeleri ve Araclar

| Seviye | Backend (Spring Boot) | Web (Next.js) | Mobil (Flutter) |
|---|---|---|---|
| **Unit** | JUnit 5 + Mockito | Vitest + Testing Library | flutter_test + mockito |
| **Repository/DB** | @DataJpaTest + Testcontainers | - | - |
| **Integration** | @SpringBootTest + Testcontainers | - | flutter_test (integration_test) |
| **API Contract** | Spring Cloud Contract / OpenAPI diff | - | - |
| **E2E** | - | Playwright | flutter integration_test |
| **Güvenlik** | OWASP ZAP, Semgrep, Gitleaks, npm audit | OWASP ZAP, Semgrep, npm audit | Mobile Security Framework (MobSF) |
| **Performans** | k6 | Lighthouse | - |
| **Offline/Sync** | - | - | flutter_test (offline mod) |

---

## 3. Unit Test Stratejisi

### 3.1 Backend Unit Test (JUnit 5 + Mockito)

**Kapsam Zorunluluklari:**
- Servis katmanindaki tum public metodlar test edilir
- Controller katmanindaki tum endpoint'ler icin `@WebMvcTest` ile request/response testi
- Utility ve helper siniflari %100 coverage
- Her domain servisi icin basarili ve hata senaryolari

```java
// Ornek: WorkOrderServiceTest.java
@ExtendWith(MockitoExtension.class)
class WorkOrderServiceTest {

    @Mock private WorkOrderRepository repository;
    @Mock private TenantContext tenantContext;
    @InjectMocks private WorkOrderService service;

    @Test
    void createWorkOrder_ShouldAssignTenantId_WhenValidInput() {
        when(tenantContext.getCurrentTenantId()).thenReturn(UUID.fromString("..."));
        // ...
        WorkOrder result = service.create(dto);
        assertThat(result.getTenantId()).isEqualTo(tenantId);
        verify(repository).save(any());
    }

    @Test
    void createWorkOrder_ShouldThrowValidationException_WhenTitleBlank() {
        var dto = new CreateWorkOrderDto();
        dto.setTitle("");
        assertThrows(ValidationException.class, () -> service.create(dto));
    }

    @Test
    void assignTechnician_ShouldSetAssignedAt_WhenValidAssignment() { /* ... */ }

    @Test
    void assignTechnician_ShouldThrow_WhenTechnicianDifferentTenant() { /* ... */ }
}
```

### 3.2 Frontend Unit Test (Vitest + Testing Library)

```typescript
// Ornek: WorkOrderForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('WorkOrderForm', () => {
  it('should show validation error when title is empty', async () => {
    render(<WorkOrderForm />);
    fireEvent.click(screen.getByRole('button', { name: /oluştur/i }));
    expect(await screen.findByText(/başlık zorunludur/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data when valid', () => {
    const onSubmit = vi.fn();
    render(<WorkOrderForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/başlık/i), { target: { value: 'Test İş' } });
    fireEvent.click(screen.getByRole('button', { name: /oluştur/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test İş' }));
  });
});
```

### 3.3 Mobil Unit Test (flutter_test + mockito)

```dart
// Ornek: work_order_bloc_test.dart
void main() {
  late MockWorkOrderRepository mockRepo;
  late WorkOrderBloc bloc;

  setUp(() {
    mockRepo = MockWorkOrderRepository();
    bloc = WorkOrderBloc(repository: mockRepo);
  });

  blocTest<WorkOrderBloc, WorkOrderState>(
    'should emit [Loading, Loaded] when fetchWorkOrders succeeds',
    build: () => bloc,
    act: (bloc) => bloc.add(FetchWorkOrders()),
    expect: () => [
      WorkOrderLoading(),
      WorkOrderLoaded(workOrders: sampleWorkOrders),
    ],
  );

  blocTest<WorkOrderBloc, WorkOrderState>(
    'should emit [Loading, Error] when fetchWorkOrders fails',
    build: () => bloc,
    act: (bloc) => bloc.add(FetchWorkOrders()),
    setUp: () => mockRepo.fetchAll().thenThrow(NetworkException()),
    expect: () => [
      WorkOrderLoading(),
      WorkOrderError(message: 'İş emirleri yüklenemedi'),
    ],
  );
}
```

---

## 4. Integration Test Stratejisi

### 4.1 Backend Integration (@SpringBootTest + Testcontainers)

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
class WorkOrderIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgis/postgis:15-3.4")
        .withDatabaseName("sahaflow_test")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired private TestRestTemplate restTemplate;
    @Autowired private WorkOrderRepository repository;

    @Test
    void createAndFetchWorkOrder_ShouldReturnSameData() {
        HttpHeaders headers = createAuthHeaders("tenant-a", "technician");
        CreateWorkOrderRequest request = new CreateWorkOrderRequest("Arıza Onarım", "Adres", "Müşteri");

        ResponseEntity<WorkOrderResponse> createResp = restTemplate.exchange(
            "/api/v1/work-orders", HttpMethod.POST, new HttpEntity<>(request, headers),
            WorkOrderResponse.class);

        assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<WorkOrderResponse> fetchResp = restTemplate.exchange(
            "/api/v1/work-orders/" + createResp.getBody().getId(), HttpMethod.GET,
            new HttpEntity<>(headers), WorkOrderResponse.class);

        assertThat(fetchResp.getBody().getTitle()).isEqualTo("Arıza Onarım");
    }

    @Test
    void fetchWorkOrder_ShouldReturn404_WhenDifferentTenant() {
        HttpHeaders headersA = createAuthHeaders("tenant-a", "technician");
        HttpHeaders headersB = createAuthHeaders("tenant-b", "technician");

        UUID id = createWorkOrder(headersA, "Test").getId();

        ResponseEntity<String> resp = restTemplate.exchange(
            "/api/v1/work-orders/" + id, HttpMethod.GET,
            new HttpEntity<>(headersB), String.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
```

### 4.2 Transactional Outbox Integration

```java
@Test
void saveWorkOrder_ShouldPublishOutboxEvent_InSameTransaction() {
    WorkOrder saved = workOrderService.create(dto);
    List<OutboxEvent> events = outboxRepository.findByAggregateId(saved.getId());
    assertThat(events).hasSize(1);
    assertThat(events.get(0).getEventType()).isEqualTo("WORK_ORDER_CREATED");
}
```

---

## 5. Repository / Veri Tabani Testleri

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestContainersConfig.class)
class WorkOrderRepositoryTest {

    @Autowired private WorkOrderRepository repository;
    @Autowired private TestEntityManager em;

    @Test
    void findAllByTenantId_ShouldReturnOnlyTenantOrders() {
        UUID tenantA = UUID.randomUUID();
        UUID tenantB = UUID.randomUUID();

        em.persist(new WorkOrder(tenantA, "A-İş 1"));
        em.persist(new WorkOrder(tenantA, "A-İş 2"));
        em.persist(new WorkOrder(tenantB, "B-İş 1"));
        em.flush();

        List<WorkOrder> results = repository.findAllByTenantId(tenantA);
        assertThat(results).hasSize(2);
        assertThat(results).allMatch(wo -> wo.getTenantId().equals(tenantA));
    }

    @Test
    void save_ShouldPersistPostGISGeometry_WhenLocationProvided() {
        WorkOrder wo = WorkOrder.builder()
            .tenantId(UUID.randomUUID())
            .location(new Point(29.0, 41.0)) // PostGIS Point
            .build();
        WorkOrder saved = repository.save(wo);
        em.flush();
        em.clear();

        WorkOrder found = repository.findById(saved.getId()).orElseThrow();
        assertThat(found.getLocation()).isNotNull();
        assertThat(found.getLocation().getX()).isCloseTo(29.0, within(0.01));
        assertThat(found.getLocation().getY()).isCloseTo(41.0, within(0.01));
    }

    @Test
    void findNearbyWorkOrders_ShouldReturnOrdersWithinRadius() {
        // PostGIS ST_DWithin sorgusu test edilir
        // ...
    }
}
```

---

## 6. API Contract Test

| Yaklasim | Arac |
|---|---|
| Backend'de OpenAPI 3.0 spesifikasyonu uretimi ve dogrulamasi | `springdoc-openapi-starter-webmvc-ui` |
| Consumer-driven contract test (frontend -> backend) | Pact (ileri faz), simdilik manuel contract review |
| OpenAPI diff: PR'da breaking change tespiti | `openapi-diff` GitHub Action |
| Response schema dogrulamasi | Integration test'lerde JSON Schema dogrulamasi |

```java
@Test
void workOrderResponse_ShouldMatchApiSchema() {
    // OpenAPI schema ile response body dogrulamasi
    var response = restTemplate.getForEntity("/api/v1/work-orders/{id}", WorkOrderResponse.class, id);
    var validator = SchemaValidator.fromClasspath("/api-spec/openapi.json");
    assertThat(validator.validate(response.getBody(), "WorkOrderResponse")).isEmpty();
}
```

---

## 7. E2E Test Stratejisi

### 7.1 Playwright (Web E2E)

```typescript
// tests/e2e/work-order-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('İş Emri Akışı', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', 'teknisyen@test.com');
    await page.fill('[name=password]', 'Test123!');
    await page.click('button[type=submit]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('yeni iş emri oluşturma ve listeleme', async ({ page }) => {
    await page.click('a[href="/is-emirleri"]');
    await page.click('button:has-text("Yeni İş Emri")');

    await page.fill('[name=title]', 'Klima Arızası');
    await page.fill('[name=customerName]', 'Ahmet Yılmaz');
    await page.fill('[name=address]', 'Bağdat Cad. No:123, İstanbul');
    await page.click('button:has-text("Oluştur")');

    await expect(page.locator('text=Klima Arızası')).toBeVisible();
    await expect(page.locator('text=Ahmet Yılmaz')).toBeVisible();
  });

  test('teknisyen kendisine atanmamış iş emrini göremez', async ({ browser }) => {
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    // Tenant B kullanicisi ile giris
    // Tenant A'nin is emrini goruntulemeye calisir -> 404
  });
});
```

### 7.2 E2E Test Kapsami (Kritik Yolculuklar)

| Yolculuk | Test Adedi |
|---|---|
| Kullanici girisi / cikisi | 2 |
| Is emri olusturma -> atama -> durum guncelleme -> tamamlama | 3 |
| Musteri kaydi olusturma | 1 |
| Fatura olusturma goruntuleme | 1 |
| Sifre sifirlama akisi | 1 |
| Yetkilendirme: farkli rollere ait islemler reddedilir | 3 |

---

## 8. Mobil Test Stratejisi

### 8.1 Widget Testi

```dart
testWidgets('WorkOrderCard should display title and status', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: Scaffold(
        body: WorkOrderCard(
          workOrder: WorkOrder(id: '1', title: 'Arıza', status: 'OPEN'),
        ),
      ),
    ),
  );

  expect(find.text('Arıza'), findsOneWidget);
  expect(find.text('Açık'), findsOneWidget);
});
```

### 8.2 Offline / Senkronizasyon Testi

| Test Senaryosu | Yontem |
|---|---|
| Internet baglantisi kesildiginde is emirleri goruntulenebilir | `flutter_test` ile offline mod simule edilir |
| Offline iken is emri durum degistirilebilir, baglanti gelince senkronize olur | Integration test: NetworkInterceptor ile baglanti kesilir, local DB'ye yazma dogrulanir, baglanti acilinca API cagrisi dogrulanir |
| Cakisma cozumu (conflict resolution): Ayni is emri hem web'den hem offline mobil'den guncellenirse | Unit test: conflict resolver strateji testi |
| SQLite veri tabani sifreleme dogrulamasi | sqlcipher acik olmadiginda dosya okunamaz |
| flutter_secure_storage veri guvenligi | Root/jailbreak olan cihazda erisim engeli dogrulamasi |

### 8.3 Mobil Platform Testi

| Platform | Test Ortami |
|---|---|
| Android | Android Emulator API 33+, Firebase Test Lab (hedef) |
| iOS | iOS Simulator iPhone 15+ (macOS CI runner, hedef) |
| Gercek cihaz | En az 3 Android (dusuk-orta-yuksek), 2 iOS cihazda manuel test |

---

## 9. Tenant Izolasyonu Testleri

```java
@SpringBootTest
@ActiveProfiles("test")
class TenantIsolationTest {

    @Test
    void tenantA_CannotAccessTenantB_WorkOrders() {
        String tokenA = getToken("tenant-a", "tech-a@test.com");
        String tokenB = getToken("tenant-b", "tech-b@test.com");

        UUID workOrderIdOfB = createResource(tokenB, "/api/v1/work-orders", body);

        // Tenant A, B'nin is emrine erisemez
        var respA = given()
            .header("Authorization", "Bearer " + tokenA)
            .get("/api/v1/work-orders/" + workOrderIdOfB);
        assertThat(respA.statusCode()).isEqualTo(404); // veya 403
    }

    @Test
    void tenantA_CannotAccessTenantB_Customers() { /* ... */ }
    @Test
    void tenantA_CannotAccessTenantB_Files() { /* ... */ }
    @Test
    void tenantA_CannotAccessTenantB_Reports() { /* ... */ }
    @Test
    void tenantA_CannotAccessTenantB_Invoices() { /* ... */ }
    @Test
    void tenantA_CannotListTenantB_Users() { /* ... */ }
}
```

**Tenant Izolasyonu Test Matrisi:**

| Varlik | Endpoint | Tenant A Token ile Tenant B Verisine Erisim | Beklenen Sonuc |
|---|---|---|---|
| Is Emri | GET /api/v1/work-orders/{id} | Dene | 404 NOT_FOUND |
| Musteri | GET /api/v1/customers/{id} | Dene | 404 NOT_FOUND |
| Dosya/Resim | GET /api/v1/files/{id}/download | Dene | 404 NOT_FOUND |
| Fatura | GET /api/v1/invoices/{id} | Dene | 404 NOT_FOUND |
| Rapor | GET /api/v1/reports/{id} | Dene | 404 NOT_FOUND |
| Kullanici Listesi | GET /api/v1/users | Dene | Yalnizca kendi tenant kullanicilari |
| Admin Panel | GET /api/v1/admin/* | Dene (teknisyen rol) | 403 FORBIDDEN |
| Tenant ID Header Manipulasyonu | POST/PUT (farkli tenant_id header) | Dene | 403 FORBIDDEN (header-JWT tenant_id eslesmezse) |

---

## 10. Yetkilendirme Testleri

```java
class AuthorizationTest {

    @ParameterizedTest
    @CsvSource({
        "ADMIN, POST /api/v1/admin/tenants, 200",
        "SUPERVISOR, POST /api/v1/admin/tenants, 403",
        "TECHNICIAN, POST /api/v1/admin/tenants, 403",
        "TECHNICIAN, PATCH /api/v1/work-orders/{id}/assign, 403",
        "SUPERVISOR, PATCH /api/v1/work-orders/{id}/assign, 200",
        "TECHNICIAN, PUT /api/v1/work-orders/{id}/status, 200",
        "SUPERVISOR, PUT /api/v1/work-orders/{id}/status, 200",
    })
    void authorize_ShouldReturnExpectedStatus(String role, String endpoint, int expectedStatus) {
        String token = getToken("tenant-a", role);
        var resp = given()
            .auth().oauth2(token)
            .when().request(getHttpMethod(endpoint), resolveEndpoint(endpoint));
        assertThat(resp.statusCode()).isEqualTo(expectedStatus);
    }
}
```

---

## 11. Guvenlik Testleri

### 11.1 Zorunlu Otomatik Guvenlik Testleri

| Test | Arac | Zamanlama | Esik |
|---|---|---|---|
| SAST (Statik Analiz) | Semgrep, SpotBugs + FindSecBugs | Her PR | 0 HIGH/CRITICAL |
| SCA (Bagimlilik Zafiyet) | Trivy, Dependabot, npm audit, OWASP Dependency Check | Her PR | 0 CRITICAL, en fazla 3 HIGH |
| Secret Taramasi | Gitleaks | Her PR + pre-commit hook | 0 bulgu |
| Container Taramasi | Trivy | Her PR, gece yapisi | 0 CRITICAL, 0 HIGH |
| DAST (Dinamik Analiz) | OWASP ZAP | Staging deployment sonrasi, haftalik | 0 HIGH, en fazla 2 MEDIUM |
| CSP Header Dogrulamasi | csp-evaluator + Playwright | Staging E2E | Tum politikalarda hata olmamali |
| TLS Yapilandirma | sslscan, testssl.sh | Aylik | A+ puani |
| SQL Injection | sqlmap (staging) | Haftalik | 0 bulgu |
| XSS | OWASP ZAP + manual | Haftalik | 0 bulgu |
| File Upload Guvenligi | Ozel test betigi | Her PR | Tum zararli dosya turleri reddedilmeli |

### 11.2 Zorunlu Negatif Test Listesi

| No | Negatif Test Senaryosu | Beklenen Sonuc | Test Seviyesi |
|---|---|---|---|
| NT-01 | Gecersiz JWT token ile API istegi | 401 UNAUTHORIZED | Integration |
| NT-02 | Suresi gecmis JWT token ile API istegi | 401 UNAUTHORIZED | Integration |
| NT-03 | Yetkisiz rol ile admin endpoint'ine erisim | 403 FORBIDDEN | Integration |
| NT-04 | Farkli tenant ID header'i ile veri erisimi | 404 veya 403 | Integration |
| NT-05 | SQL injection payload: `' OR '1'='1` | Input validation reddeder, sorgu calismaz | Unit + Integration |
| NT-06 | XSS payload: `<script>alert(1)</script>` isim alaninda | HTML encoding ile guvensiz karakterler encode edilir | Unit + E2E |
| NT-07 | 100MB dosya yukleme denemesi | 413 PAYLOAD_TOO_LARGE | Integration |
| NT-08 | .php, .jsp, .svg uzantili dosya yukleme | 400 BAD_REQUEST (gecersiz dosya turu) | Integration |
| NT-09 | ZIP bomb (decompressed size > quota) yukleme | 400 BAD_REQUEST | Integration |
| NT-10 | EICAR test virusu dosyasi yukleme | ClamAV tarafindan reddedilir | Integration |
| NT-11 | Bos JSON body ile POST istegi | 400 BAD_REQUEST, detayli hata mesaji yok | Integration |
| NT-12 | Eksik zorunlu alan ile POST istegi | 422 UNPROCESSABLE_ENTITY, alan bazli hata | Integration |
| NT-13 | Gecersiz UUID formatinda ID ile GET istegi | 400 BAD_REQUEST | Integration |
| NT-14 | Cok uzun string (10000 karakterlik ad) | 400 BAD_REQUEST, max length asimi | Unit + Integration |
| NT-15 | Rate limit asimi (dakikada 100'den fazla istek) | 429 TOO_MANY_REQUESTS | Integration |
| NT-16 | CORS ihlali: izinsiz origin'den withCredentials istek | CORS hatasi, yanit donmez | E2E (Playwright) |
| NT-17 | Sifre sifirlama: gecersiz/expire token ile sifir denemesi | 400 BAD_REQUEST | Integration |
| NT-18 | Hesap kilidi: 5 basarisiz giris denemesi sonrasi giris engeli | 423 LOCKED, 15 dakika sureyle | Integration |
| NT-19 | Dosya indirme: baskasinin tenantina ait dosya ID'si ile indirme | 404 NOT_FOUND | Integration |
| NT-20 | Webhook: gecersiz HMAC imzasi ile webhook payload | 401 UNAUTHORIZED | Integration |
| NT-21 | Concurrent request: Ayni is emri eszamanli iki kullanici tarafindan guncellenir | Optimistic lock / version kontrolu, biri 409 CONFLICT | Integration |
| NT-22 | Bos veya null search parametresi | 200 OK, bos sonuc veya varsayilan listeleme | Integration |
| NT-23 | Truncation: input maxLength'i asan deger | Kesilmez, 400 BAD_REQUEST doner | Unit |
| NT-24 | Unicode homograph saldirisi: Kiril alfabesi ile `admin` kullanici adi | IDN homograph kontrolu, kayit engellenir | Unit + Integration |
| NT-25 | Kayit sirasinda var olan e-posta ile yeniden kayit | 409 CONFLICT | Integration |

---

## 12. Performans / Yuk Testleri

| Test | Arac | Hedef | Esik |
|---|---|---|---|
| API yuk testi (is emri listeleme) | k6 | 100 eszamanli kullanici | p95 < 500ms |
| API yuk testi (is emri olusturma) | k6 | 50 eszamanli istek | p95 < 1s |
| Dosya yukleme yuk testi | k6 | 20 eszamanli 5MB dosya | p95 < 3s |
| Web sayfa yuklenme suresi | Lighthouse / Playwright | Lighthouse score | Performance > 90, FCP < 1.5s, LCP < 2.5s |
| Mobil uygulama baslangic suresi | Manuel + Firebase Performance | Soguk baslangic | < 3s (Android), < 2s (iOS) |

**k6 Test Senaryosu Ornegi:**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const token = `Bearer ${__ENV.TEST_TOKEN}`;
  const params = { headers: { 'Authorization': token, 'X-Tenant-Id': 'tenant-a-id' } };

  const res = http.get('http://staging-api.sahaflow.com/api/v1/work-orders', params);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

---

## 13. Backup / Restore Testi

| Test | Periyot | Yontem |
|---|---|---|
| Backup dosyasi varligi ve boyut kontrolu | Gunluk (otomatik) | Monitoring alert |
| Backup'tan restore tatbikati | Aylik | Staging ortaminda tatbikat: backup'tan yeni bir DB olustur, uygulama baglanabiliyor mu, veri butunlugu kontrolu |
| Point-in-Time Recovery (PITR) testi | 3 ayda bir | Belirli bir zamana geri donme testi, is emirlerinin o anki durumunun dogrulanmasi |
| Felaket kurtarma tatbikati | 6 ayda bir | Sifirdan yeni sunucuda tum sistemi ayaga kaldirma |

---

## 14. UAT (Kullanici Kabul Testi) Stratejisi

| Faz | Katilimcilar | Sure | Kapsam |
|---|---|---|---|
| Alpha (dahili test) | Gelistirme ekibi + 1-2 dost musteri | 1-2 hafta | Kritik yolculuklar, mobil + web kullanimi |
| Beta (sinirli dis test) | 3-5 gercek teknik servis firmasi | 2-4 hafta | Tum ozellikler, gercek saha kosullari, farkli cihazlar |
| GA (genel kullanima acma) | Tum musteriler | - | Tum fonksiyonlar |

**UAT Kabul Kriterleri:**
- Tum kritik yolculuklar hatasiz calisir
- 0 P0/P1 bug
- Mobil uygulama en az 3 farkli Android modelde test edilir
- KVKK aydinlatma metinleri gozden gecilir

---

## 15. Test Verisi Guvenligi

| Kural | Aciklama |
|---|---|
| Production verisi asla test ortamina kopyalanmaz | Anonimlestirilse bile riskli |
| Sentetik test verisi | `Faker` kutuphanesi ile uretilir (Java Faker, @faker-js/faker) |
| Test verisinde gercek kisisel veri yok | Ad, telefon, e-posta, adres tumu sentetik |
| Test token'lari ve sifreleri | Sadece test ortamlarinda gecerli, surekli degisen |
| KVKK uyumlu test verisi | TC Kimlik, gercek telefon gibi veriler kullanilmaz |

```java
// Test verisi ureteci
public class TestDataFactory {
    private static final Faker faker = new Faker(new Locale("tr"));

    public static CreateWorkOrderDto randomWorkOrderDto() {
        return CreateWorkOrderDto.builder()
            .title(faker.lorem().sentence(3))
            .customerName(faker.name().fullName())
            .address(faker.address().fullAddress())
            .build();
    }
}
```

---

## 16. Gereksinim - Test Matrisi

| Gereksinim ID | Gereksinim | Unit Test | Integration Test | E2E Test | Negatif Test |
|---|---|---|---|---|---|
| REQ-001 | Kullanici girisi (e-mail + parola) | AuthServiceTest | AuthIntegrationTest | login-flow.spec.ts | NT-01, NT-02, NT-18 |
| REQ-002 | Sifre sifirlama akisi | PasswordResetServiceTest | PasswordResetIntegrationTest | password-reset.spec.ts | NT-17 |
| REQ-003 | MFA (TOTP) destegi | TotpServiceTest | TotpIntegrationTest | - | NT-03 |
| REQ-004 | RBAC ile yetkilendirme | AuthorizationTest | AuthorizationIntegrationTest | authorization.spec.ts | NT-03, NT-04 |
| REQ-005 | Tenant izolasyonu | TenantIsolationTest | TenantIsolationIntegrationTest | tenant-isolation.spec.ts | NT-04, NT-19 |
| REQ-006 | Is emri olusturma | WorkOrderServiceTest | WorkOrderIntegrationTest | work-order-flow.spec.ts | NT-11, NT-12, NT-14 |
| REQ-007 | Is emri listeleme (sayfalama, filtreleme) | WorkOrderQueryServiceTest | WorkOrderIntegrationTest | work-order-list.spec.ts | NT-22 |
| REQ-008 | Is emri atama (teknisyene) | AssignmentServiceTest | AssignmentIntegrationTest | assignment.spec.ts | NT-03 |
| REQ-009 | Is emri durum guncelleme | StatusTransitionServiceTest | StatusIntegrationTest | work-order-flow.spec.ts | NT-21 |
| REQ-010 | Musteri yonetimi (CRUD) | CustomerServiceTest | CustomerIntegrationTest | customer-flow.spec.ts | NT-04, NT-12 |
| REQ-011 | GPS konum takibi (teknisyen) | LocationServiceTest | LocationIntegrationTest | - | NT-04 |
| REQ-012 | Rota planlamasi / PostGIS sorgulari | RouteServiceTest | RouteIntegrationTest | - | NT-22 |
| REQ-013 | Dosya yukleme (fotograf, imza) | FileUploadServiceTest | FileUploadIntegrationTest | file-upload.spec.ts | NT-07, NT-08, NT-09, NT-10 |
| REQ-014 | S3 presigned URL ile guvenli dosya indirme | PresignedUrlServiceTest | PresignedUrlIntegrationTest | - | NT-19 |
| REQ-015 | Fatura kesme ve listeleme | InvoiceServiceTest | InvoiceIntegrationTest | invoice.spec.ts | NT-03, NT-04 |
| REQ-016 | Offline is emri goruntuleme ve guncelleme | OfflineWorkOrderBlocTest | MobileOfflineIntegrationTest | - | - |
| REQ-017 | Cevrimdisi veri senkronizasyonu | SyncServiceTest | SyncIntegrationTest | - | - |
| REQ-018 | Webhook entegrasyonu | WebhookServiceTest | WebhookIntegrationTest | - | NT-20 |
| REQ-019 | E-posta bildirimi | NotificationServiceTest | NotificationIntegrationTest | - | - |
| REQ-020 | Denetim (audit) loglama | AuditServiceTest | AuditIntegrationTest | - | - |
| REQ-021 | Rate limiting | RateLimitFilterTest | RateLimitIntegrationTest | - | NT-15 |
| REQ-022 | API dokumantasyonu (OpenAPI) | OpenApiSchemaTest | - | - | - |
| REQ-023 | KVKK: Hesap silme talebi | AccountDeletionServiceTest | AccountDeletionIntegrationTest | - | - |
| REQ-024 | KVKK: Veri tasinabilirligi (JSON cikti) | DataPortabilityServiceTest | DataPortabilityIntegrationTest | - | - |
| REQ-025 | KVKK: Riza yonetimi | ConsentServiceTest | ConsentIntegrationTest | - | - |

---

## Karar Bekleyen Konular

1. Firebase Test Lab ve iOS TestFlight entegrasyonu butcesi ve zamani
2. Pact consumer-driven contract test ne zaman devreye alinacak?
3. MobSF (Mobile Security Framework) CI'a entegrasyonu
4. k6 yuk testlerini staging'de mi production'da mi kosacagi (staging onerilir)
5. UAT icin musteri secimi ve surec takvimi
6. iOS testleri icin macOS CI runner (GitHub Actions macOS runner ucretli)
7. E2E test kapsamina mobil e2e testlerinin eklenmesi

## Ilgili Dokumanlar

- `10_THREAT_MODEL.md` — Tehdit Modeli
- `11_PRIVACY_KVKK.md` — KVKK Uyumluluk ve Gizlilik
- `12_SECURE_SDLC_CICD.md` — Guvenli SDLC ve CI/CD
- `14_DEVOPS_OBSERVABILITY_DR.md` — DevOps, Gozlemlenebilirlik ve Felaket Kurtarma
- `15_ADR.md` — Mimari Karar Kayitlari
