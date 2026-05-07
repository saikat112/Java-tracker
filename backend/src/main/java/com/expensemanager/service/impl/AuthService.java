package com.expensemanager.service.impl;

import com.expensemanager.dto.request.LoginRequest;
import com.expensemanager.dto.request.RegisterRequest;
import com.expensemanager.dto.response.AuthResponse;
import com.expensemanager.dto.response.UserResponse;
import com.expensemanager.entity.User;
import com.expensemanager.exception.BadRequestException;
import com.expensemanager.mapper.EntityMapper;
import com.expensemanager.repository.UserRepository;
import com.expensemanager.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EntityMapper mapper;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();
        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email()).orElseThrow();
        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));
        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new BadRequestException("Refresh token expired");
        }
        return buildAuthResponse(user);
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setResetToken(UUID.randomUUID().toString());
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);
            // Email sending would be triggered here via MailService
        });
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token expired");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        return AuthResponse.of(accessToken, refreshToken, mapper.toUserResponse(user));
    }
}
