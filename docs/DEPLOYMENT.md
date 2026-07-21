# İşAkış - Deployment Dokumani

## Deployment Mimarisi

```
┌─────────────────────────────────────────────────────┐
│                     CDN / WAF                        │
│               (CloudFront / Cloudflare)               │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│                 Load Balancer                         │
│              (ALB / Nginx / Traefik)                  │
└───────┬───────────────────────────┬─────────────────┘
        │                           │
┌───────▼──────────┐      ┌─────────▼───────────┐
│   Web Instances  │      │   API Instances      │
│   (Next.js)      │      │   (Spring Boot)       │
│   2+ replicas    │      │   2+ replicas          │
└──────────────────┘      └─────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐  ┌──────▼──────┐  ┌────▼────┐
              │ PostgreSQL │  │  Redis      │  │  S3     │
              │  (Managed) │  │  (ElastiCache│  │ (MinIO  │
              │            │  │   / MemoryDB)│  │  / AWS) │
              └────────────┘  └─────────────┘  └─────────┘
```

## Docker Image Build

### Backend

```bash
# Image olusturma
docker build -f infra/Dockerfile.backend -t registry.example.com/sahaflow-backend:latest .
docker build -f infra/Dockerfile.backend -t registry.example.com/sahaflow-backend:$(git rev-parse --short HEAD) .

# Image katmanlarini inceleme
docker history registry.example.com/sahaflow-backend:latest

# Build argumanlari ile
docker build -f infra/Dockerfile.backend \
  --build-arg BUILD_ENV=production \
  -t registry.example.com/sahaflow-backend:latest .
```

### Web

```bash
# Image olusturma (next.config.js'de output: standalone olmali)
docker build -f infra/Dockerfile.web \
  --build-arg NEXT_PUBLIC_API_URL=https://api.sahaflow.example.com/api \
  -t registry.example.com/sahaflow-web:latest .
```

### Optimization Notes

- Multi-stage build sayesinde final image boyutu minimize edilmistir
- Backend: ~250MB (JRE + app JAR)
- Web: ~150MB (Node + standalone)
- Layer caching: Sik degismeyen katmanlar once kopyalanir

## Container Registry

Image'lar bir container registry'ye push edilir:

```bash
# DockerHub
docker tag sahaflow-backend:latest yourusername/sahaflow-backend:latest
docker push yourusername/sahaflow-backend:latest

# AWS ECR
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-central-1.amazonaws.com
docker tag sahaflow-backend:latest <account-id>.dkr.ecr.eu-central-1.amazonaws.com/sahaflow-backend:latest
docker push <account-id>.dkr.ecr.eu-central-1.amazonaws.com/sahaflow-backend:latest

# GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker tag sahaflow-backend:latest ghcr.io/org/sahaflow-backend:latest
docker push ghcr.io/org/sahaflow-backend:latest
```

## Environment Degiskenleri

Production'da tum environment degiskenleri asagidaki yontemlerle saglanir:

### Docker Compose (kucuk deployment)

```bash
# .env dosyasindan (production icin ayri olusturulmus)
docker compose -f infra/docker-compose.yml -f infra/docker-compose.prod.yml --env-file .env.production up -d
```

### Kubernetes ConfigMap + Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: sahaflow-db-secret
type: Opaque
stringData:
  DB_PASSWORD: <actual-password>
  JWT_SECRET: <actual-256-bit-secret>
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: sahaflow-config
data:
  DB_HOST: postgres.production.svc.cluster.local
  DB_PORT: "5432"
  DB_NAME: sahaflow
  LOG_LEVEL: INFO
```

### HashiCorp Vault (oneri)

```bash
# Vault'tan secret okuma
vault kv get -format=json secret/sahaflow/production/database

# Spring Cloud Vault ile otomatik enjeksiyon (bootstrap.yml)
spring:
  cloud:
    vault:
      host: vault.example.com
      authentication: KUBERNETES
      kv:
        backend: secret
```

## Database Migration (Flyway)

Production'da Flyway migration'lari guvenli bir sekilde calistirilir:

### Otomatik (oneri)

Backend baslangicinda otomatik:

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: false  # Production'da false
    out-of-order: false          # Production'da false
    clean-on-validation-error: false  # KESINLIKLE false
```

### Manuel (kontrol gerektiren durumlar)

```bash
# Migration kontrolu
./gradlew flywayInfo -Dflyway.url=jdbc:postgresql://prod-host:5432/sahaflow

# Migration calistirma
./gradlew flywayMigrate -Dflyway.url=jdbc:postgresql://prod-host:5432/sahaflow

# Geri alma (flyway undo - premium)
./gradlew flywayUndo
```

### Migration Guvenlik Kurallari

- Production'da `flyway.clean-on-validation-error=false` ZORUNLU
- Her migration geri alinabilir (UNDO) olmali
- Buyuk tablo degisiklikleri batch'ler halinde yapilmali
- Migration oncesi tam backup alinmali

## Health Check

### Backend

```
GET /actuator/health
```

```json
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"},
    "livenessState": {"status": "UP"},
    "readinessState": {"status": "UP"}
  }
}
```

### Web

```
GET /api/health (Next.js route handler)
```

### Kubernetes Probes

```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 60
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Monitoring ve Alerting

### Metrikler

- **Spring Boot Actuator + Micrometer**: JVM, HTTP, DB metrikleri
- **Prometheus scraping**: `/actuator/prometheus`
- **Grafana dashboards**: Backend JVM, API latency, error rates
- **Custom metrics**: Booking olusturma suresi, aktif kullanici sayisi

### Logging

- JSON format (production)
- ELK Stack / Grafana Loki: Merkezi log aggregation
- Log seviyeleri: INFO (default), ERROR, WARN

```yaml
logging:
  level:
    root: INFO
    com.sahaflow: DEBUG  # Debug sadece sorun cozme sirasinda
  pattern:
    console: '{"timestamp":"%d{ISO8601}","level":"%level","logger":"%logger","message":"%msg"}%n'
```

### Alerting (Prometheus AlertManager)

- HTTP 5xx rate > %1 (5 dakika)
- API latency p95 > 2s (5 dakika)
- DB connection pool exhaustion
- Disk usage > %85
- Health check failure (3 dakika)

## Backup ve Restore

### PostgreSQL Backup

```bash
# Full backup (pg_dump)
pg_dump -h prod-host -U sahaflow -d sahaflow -Fc -f backup_$(date +%Y%m%d_%H%M%S).dump

# Sadece schema
pg_dump -h prod-host -U sahaflow -d sahaflow --schema-only -f schema_only.sql

# WAL archiving (continuous)
# postgresql.conf:
# archive_mode = on
# archive_command = 'test ! -f /archive/%f && cp %p /archive/%f'
```

### Restore

```bash
# Full restore
pg_restore -h prod-host -U sahaflow -d sahaflow -c backup_20260721_120000.dump

# Point-in-time recovery (PITR)
# recovery.conf:
# restore_command = 'cp /archive/%f %p'
# recovery_target_time = '2026-07-21 12:00:00'
```

### Backup Schedule

- Tam backup: Gunluk (gece 02:00)
- WAL archiving: Surekli
- Retention: 30 gun
- Encrypted backup: ZORUNLU

## Rollback Proseduru

1. **Uygulama rollback**:
   ```bash
   # Kubernetes
   kubectl rollout undo deployment/sahaflow-api
   kubectl rollout status deployment/sahaflow-api
   ```

2. **Veritabani rollback**:
   ```bash
   # Flyway undo (varsa)
   ./gradlew flywayUndo -Dflyway.url=jdbc:postgresql://prod-host:5432/sahaflow

   # Veya backup'tan restore (son care)
   pg_restore -h prod-host -U sahaflow -d sahaflow -c latest_backup.dump
   ```

3. **Dogrulama**:
   - Health check endpoint kontrolu
   - Smoke test (kritik akislar: login, booking olusturma)
   - Metrik kontrolu (error rate, latency)

## Scaling

### Horizontal (oneri)

```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sahaflow-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sahaflow-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Vertical

- Her pod: 512Mi request / 1Gi limit memory
- CPU: 0.25 request / 1.0 limit

### Veritabani

- Managed PostgreSQL (RDS, Cloud SQL) ile auto-scaling
- Read replica'lar okuma-heavy islemler icin
- Connection pooling (HikariCP)

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
```
