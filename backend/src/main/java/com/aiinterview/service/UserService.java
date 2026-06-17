package com.aiinterview.service;

import com.aiinterview.dto.AuthResponse;
import com.aiinterview.dto.LoginRequest;
import com.aiinterview.dto.RegisterRequest;
import com.aiinterview.entity.User;
import com.aiinterview.entity.UserRole;
import com.aiinterview.repository.UserRepository;
import com.aiinterview.security.JwtTokenProvider;
import com.aiinterview.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UserService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, 
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email address is already in use!");
        }

        UserRole role = UserRole.CANDIDATE;
        if (request.getRole() != null) {
            try {
                role = UserRole.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default CANDIDATE
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        return userRepository.save(user);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();

        return AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
