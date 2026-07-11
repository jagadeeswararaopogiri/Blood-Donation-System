package com.blood.backend.auth.dto;

import com.blood.backend.common.Role;
import jakarta.validation.constraints.NotNull;

public record SelectRoleRequest(
        @NotNull Role role
) {}

