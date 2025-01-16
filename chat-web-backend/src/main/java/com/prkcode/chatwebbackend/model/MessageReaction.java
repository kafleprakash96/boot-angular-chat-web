package com.prkcode.chatwebbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "message_id")
    private ChatMessage message;

    private String type;  // 'love', 'like', 'angry'
    private String user;
    private LocalDateTime timestamp;
}
