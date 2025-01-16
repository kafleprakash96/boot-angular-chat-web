package com.prkcode.chatwebbackend.controller;

import com.prkcode.chatwebbackend.dto.MessageReactionRequest;
import com.prkcode.chatwebbackend.dto.MessageReactionResponseDto;
import com.prkcode.chatwebbackend.model.MessageReaction;
import com.prkcode.chatwebbackend.service.MessageReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageReactionController {

    private final MessageReactionService messageReactionService;

    @PostMapping("/{messageId}/reactions")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<MessageReactionResponseDto> addReaction(
            @PathVariable Long messageId,
            @RequestBody MessageReactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        MessageReaction reaction = new MessageReaction();
        reaction.setUser(userDetails.getUsername());
        reaction.setType(request.getType());

        MessageReaction savedReaction = messageReactionService.addReaction(messageId, reaction);
        MessageReactionResponseDto responseDTO = new MessageReactionResponseDto(
                savedReaction.getId(),
                savedReaction.getUser(),
                savedReaction.getType(),
                savedReaction.getTimestamp(),
                savedReaction.getMessage().getId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @DeleteMapping("/{messageId}/reactions")
    public ResponseEntity<MessageReaction> removeReaction(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        MessageReaction removedReaction = messageReactionService.removeReaction(messageId, userDetails.getUsername());
        return ResponseEntity.ok(removedReaction);
    }
}
