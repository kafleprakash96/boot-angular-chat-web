package com.prkcode.chatwebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReactionDTO {
    private Long id;
    private String user;
    private String type;
    private LocalDateTime timestamp;
}
