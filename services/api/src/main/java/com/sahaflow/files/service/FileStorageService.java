package com.sahaflow.files.service;

import com.sahaflow.shared.tenant.TenantContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);
    private static final long MAX_FILE_SIZE = 10_485_760L; // 10 MB

    private final JdbcClient jdbcClient;
    private final Path uploadDir;

    public FileStorageService(JdbcClient jdbcClient,
                               @Value("${sahaflow.files.upload-dir:./uploads}") String uploadDirPath) {
        this.jdbcClient = jdbcClient;
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDirPath, e);
        }
    }

    @Transactional
    public Map<String, String> store(MultipartFile file, String resourceType, String resourceId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String tenantId = TenantContextHolder.getTenantId();
        String userId = TenantContextHolder.getUserId();
        String objectId = UUID.randomUUID().toString();
        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unnamed";
        String extension = "";
        if (originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf('.'));
        }
        String storedName = objectId + extension;

        Path tenantDir = uploadDir.resolve(tenantId);
        try {
            Files.createDirectories(tenantDir);
            Path targetPath = tenantDir.resolve(storedName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        jdbcClient.sql("""
                INSERT INTO media_object (id, tenant_id, object_type, object_file_name,
                    content_type, file_size, resource_type, resource_id, storage_path,
                    uploaded_by, created_at)
                VALUES (:id, :tenantId, :objectType, :fileName,
                    :contentType, :fileSize, :resourceType, :resourceId, :storagePath,
                    :uploadedBy, :now)
                """)
            .param("id", objectId)
            .param("tenantId", tenantId)
            .param("objectType", "FILE")
            .param("fileName", originalName)
            .param("contentType", file.getContentType())
            .param("fileSize", file.getSize())
            .param("resourceType", resourceType)
            .param("resourceId", resourceId)
            .param("storagePath", tenantDir.resolve(storedName).toString())
            .param("uploadedBy", userId)
            .param("now", Instant.now())
            .update();

        return Map.of(
            "id", objectId,
            "fileName", originalName,
            "contentType", file.getContentType() != null ? file.getContentType() : "application/octet-stream",
            "size", String.valueOf(file.getSize())
        );
    }

    public record FileInfo(String id, String fileName, String contentType, long size,
                            String resourceType, String resourceId, Instant createdAt) {}
}
