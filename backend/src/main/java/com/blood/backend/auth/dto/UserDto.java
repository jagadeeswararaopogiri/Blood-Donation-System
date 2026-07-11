package com.blood.backend.auth.dto;

import com.blood.backend.common.Role;

public record UserDto(
        Long id,
        String name,
        String email,
        Role role
) {}

