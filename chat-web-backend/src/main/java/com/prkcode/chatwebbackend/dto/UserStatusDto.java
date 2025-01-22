package com.prkcode.chatwebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatusDto {

    private Long userId;
    private boolean isOnline;
}