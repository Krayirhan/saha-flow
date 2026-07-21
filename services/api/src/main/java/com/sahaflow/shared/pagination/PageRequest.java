package com.sahaflow.shared.pagination;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class PageRequest {

    @Min(0)
    private int page = 0;

    @Min(1)
    @Max(100)
    private int size = 20;

    private String sort = "createdAt";

    private String direction = "DESC";

    public PageRequest() {}

    public PageRequest(int page, int size, String sort, String direction) {
        this.page = page;
        this.size = size;
        this.sort = sort;
        this.direction = direction;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public int getOffset() {
        return page * size;
    }

    public org.springframework.data.domain.PageRequest toSpringPageRequest() {
        var dir = "ASC".equalsIgnoreCase(direction)
            ? org.springframework.data.domain.Sort.Direction.ASC
            : org.springframework.data.domain.Sort.Direction.DESC;
        return org.springframework.data.domain.PageRequest.of(page, size,
            org.springframework.data.domain.Sort.by(dir, sort));
    }
}
