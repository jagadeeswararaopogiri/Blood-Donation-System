package com.blood.backend.donors.dto;

import com.blood.backend.common.BloodGroup;

import java.time.LocalDate;

public record DonorProfileDto(
        Long donorProfileId,
        Long userId,
        String name,
        BloodGroup bloodGroup,
        String location,
        String phone,
        boolean availability,
        LocalDate lastDonationDate
) {}

