package com.prkcode.chatwebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class MessageUpdateDTO {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private String sender;
    private List<ReactionDTO> reactions;
}
