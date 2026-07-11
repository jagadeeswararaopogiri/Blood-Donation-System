package com.blood.backend.auth;

import com.blood.backend.auth.dto.AuthResponse;
import com.blood.backend.auth.dto.LoginRequest;
import com.blood.backend.auth.dto.RegisterRequest;
import com.blood.backend.auth.dto.SelectRoleRequest;
import com.blood.backend.auth.dto.UserDto;
import com.blood.backend.security.AuthUserDetails;
import com.blood.backend.security.JwtService;
import com.blood.backend.security.SecurityUtils;
import com.blood.backend.users.User;
import com.blood.backend.users.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(null);
        userRepository.save(user);

        AuthUserDetails principal = new AuthUserDetails(user);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, toDto(user));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        AuthUserDetails principal = (AuthUserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, toDto(principal.getUser()));
    }

    @GetMapping("/me")
    public UserDto me() {
        User user = SecurityUtils.requireUser().getUser();
        return toDto(user);
    }

    @PatchMapping("/role")
    public UserDto selectRole(@Valid @RequestBody SelectRoleRequest req) {
        User user = SecurityUtils.requireUser().getUser();
        user.setRole(req.role());
        userRepository.save(user);
        return toDto(user);
    }

    private static UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole());
    }
}

