package com.prkcode.chatwebbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageReactionEvent {
    private Long messageId;
    private Long roomId;
    private String username;
    private String reactionType;
    private String eventType; // "REACTION_ADDED" or "REACTION_REMOVED"
}
