package com.nexhire.portal.service;

import com.nexhire.portal.dto.request.LoginRequest;
import com.nexhire.portal.dto.request.RegisterRequest;
import com.nexhire.portal.dto.response.AuthResponse;
import com.nexhire.portal.dto.response.UserResponse;
import com.nexhire.portal.entity.User;
import com.nexhire.portal.entity.enums.Role;
import com.nexhire.portal.exception.BusinessException;
import com.nexhire.portal.repository.UserRepository;
import com.nexhire.portal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already registered");
        }

        Role role = (request.getRole() != null && request.getRole() != Role.ADMIN)
                ? request.getRole() : Role.USER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .profileComplete(false)
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered: {} with role {}", saved.getEmail(), saved.getRole());

        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmailAndIsActiveTrue(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BusinessException("Account not found or deactivated"));

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new BusinessException("Invalid or expired refresh token");
        }
        String email = jwtUtil.extractEmail(refreshToken);
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new BusinessException("User not found"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getExpirationMs())
                .user(mapToUserResponse(user))
                .build();
    }

    public static UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .bio(user.getBio())
                .location(user.getLocation())
                .skills(user.getSkills())
                .resumeUrl(user.getResumeUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .githubUrl(user.getGithubUrl())
                .portfolioUrl(user.getPortfolioUrl())
                .profileComplete(user.getProfileComplete())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
