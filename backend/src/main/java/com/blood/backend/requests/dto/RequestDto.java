package com.blood.backend.requests.dto;

import com.blood.backend.common.RequestStatus;

import java.time.Instant;

public record RequestDto(
        Long id,
        Long receiverUserId,
        String receiverName,
        Long donorUserId,
        String donorName,
        RequestStatus status,
        Instant requestedAt,
        Instant respondedAt,
        Instant completedAt,
        String note
) {}

