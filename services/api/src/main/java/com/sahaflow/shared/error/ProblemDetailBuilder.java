package com.sahaflow.shared.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import java.net.URI;

public final class ProblemDetailBuilder {

    private ProblemDetailBuilder() {}

    public static ProblemDetail build(HttpStatus status, ErrorCode errorCode,
                                       String detail, String instance) {
        var problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setType(URI.create("https://api.sahaflow.local/errors/" + errorCode.getCode().toLowerCase()));
        problem.setTitle(errorCode.getDefaultMessage());
        problem.setProperty("errorCode", errorCode.getCode());
        if (instance != null) {
            problem.setInstance(URI.create(instance));
        }
        return problem;
    }

    public static ProblemDetail build(HttpStatus status, ErrorCode errorCode, String detail) {
        return build(status, errorCode, detail, null);
    }
}
