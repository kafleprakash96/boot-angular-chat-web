package com.prkcode.chatwebbackend.dto;

import com.prkcode.chatwebbackend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String content;
    private UserDto author;
    private boolean isPublic;
    private int likesCount;
    private int dislikesCount;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean hasLiked;
    private boolean hasDisliked;
}
