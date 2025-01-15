package com.prkcode.chatwebbackend.controller;

import com.prkcode.chatwebbackend.model.ChatRoom;
import com.prkcode.chatwebbackend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    // Send a message in a room
    @PostMapping("/room/{roomId}/send")
    public ResponseEntity<?> sendMessage(@PathVariable Long roomId,
                                         @RequestParam String content,
                                         @RequestParam String sender) {
        try {
            chatService.sendMessage(roomId, content, sender);
            return ResponseEntity.ok("Message sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Failed to send message");
        }
    }

    // Mark message as seen
    @PostMapping("/message/{messageId}/seen")
    public ResponseEntity<?> markAsSeen(@PathVariable Long messageId,
                                        @RequestParam String username) {
        try {
            chatService.markAsSeen(messageId, username);
            return ResponseEntity.ok("Message marked as seen");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Failed to mark message as seen");
        }
    }
}
