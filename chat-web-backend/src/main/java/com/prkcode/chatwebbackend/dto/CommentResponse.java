package com.prkcode.chatwebbackend.dto;

import com.prkcode.chatwebbackend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private String content;
    private UserDto author;
    private List<CommentResponse> replies;
    private int likesCount;
    private LocalDateTime createdAt;
    private boolean hasLiked;
}
