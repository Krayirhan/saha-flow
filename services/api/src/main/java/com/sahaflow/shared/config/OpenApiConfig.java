package com.sahaflow.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sahaFlowOpenApi() {
        var securitySchemeName = "bearerAuth";
        return new OpenAPI()
            .info(new Info()
                .title("İşAkış API")
                .version("1.0.0")
                .description("Saha servis yonetimi SaaS platformu REST API")
                .contact(new Contact()
                    .name("İşAkış Team")
                    .email("dev@sahaflow.local"))
                .license(new License()
                    .name("Proprietary")
                    .url("https://sahaflow.local/license")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Local development"),
                new Server().url("https://api.sahaflow.local").description("Production")
            ))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
