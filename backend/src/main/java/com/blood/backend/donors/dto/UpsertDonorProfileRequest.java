package com.blood.backend.donors.dto;

import com.blood.backend.common.BloodGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpsertDonorProfileRequest(
        @NotNull BloodGroup bloodGroup,
        @NotBlank String location,
        @NotBlank String phone,
        Boolean availability
) {}

