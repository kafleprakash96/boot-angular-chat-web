package com.prkcode.chatwebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatusUpdateRequest {
    private boolean online;
}
