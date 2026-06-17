package com.aiinterview.controller;

import com.aiinterview.dto.AuthResponse;
import com.aiinterview.dto.LoginRequest;
import com.aiinterview.dto.RegisterRequest;
import com.aiinterview.entity.User;
import com.aiinterview.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully: " + user.getEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = userService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
