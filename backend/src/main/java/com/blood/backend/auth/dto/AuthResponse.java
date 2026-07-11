package com.blood.backend.auth.dto;

public record AuthResponse(
        String token,
        UserDto user
) {}

