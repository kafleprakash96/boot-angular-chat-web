package com.prkcode.chatwebbackend.dto;

import com.prkcode.chatwebbackend.enums.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
public class UserDto {

    private Long id;

    private String username;

    private String firstName;
    private String lastName;

    private String password;

    private String email;

    private String profilePicture;

    private Role role;

    private LocalDateTime createdAt;
    private boolean isOnline;
}
