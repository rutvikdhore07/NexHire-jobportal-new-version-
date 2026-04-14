package com.nexhire.portal.dto.response;

import com.nexhire.portal.entity.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserResponse user;
}
