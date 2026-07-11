package com.blood.backend.requests.dto;

import jakarta.validation.constraints.NotNull;

public record CreateRequest(
        @NotNull Long donorUserId,
        String note
) {}

