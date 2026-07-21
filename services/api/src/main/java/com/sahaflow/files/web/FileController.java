package com.sahaflow.files.web;

import com.sahaflow.files.service.FileStorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "resourceType", defaultValue = "GENERAL") String resourceType,
            @RequestParam(value = "resourceId", defaultValue = "") String resourceId) {
        var result = fileStorageService.store(file, resourceType, resourceId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{tenantId}/{fileName}")
    public ResponseEntity<Resource> download(@PathVariable String tenantId, @PathVariable String fileName) {
        try {
            Path filePath = Paths.get("./uploads", tenantId, fileName).toAbsolutePath().normalize();
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            var resource = new FileSystemResource(filePath);
            var contentType = Files.probeContentType(filePath);
            return ResponseEntity.ok()
                .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
