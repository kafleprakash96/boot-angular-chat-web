package com.prkcode.chatwebbackend.controller;

import com.prkcode.chatwebbackend.model.ChatMessage;
import com.prkcode.chatwebbackend.model.ChatRoom;

import com.prkcode.chatwebbackend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
//import  com.users.usersservice.service.UserService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final ChatService chatService;

    public RoomController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Get all rooms for the authenticated user
    @GetMapping
    public ResponseEntity<List<ChatRoom>> getAllRooms(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);
        }

        System.out.println("User: " + authentication.getName());

        try {
            List<ChatRoom> rooms = chatService.getAllRooms();
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);  // Internal Server Error if something goes wrong
        }
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ChatRoom> getRoomById(@PathVariable Long roomId) {
        try {
            ChatRoom room = chatService.getRoomById(roomId);
            return ResponseEntity.ok(room);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(null); // Room not found
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Internal Server Error
        }
    }

    // Create a new room
    @PostMapping("/create")
    public ResponseEntity<ChatRoom> createRoom(@RequestParam String name) {
        try {
            ChatRoom createdRoom = chatService.createRoom(name);
            return ResponseEntity.ok(createdRoom);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);  // Bad request if room creation fails
        }
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesForRoom(@PathVariable Long roomId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);  // Unauthorized if not authenticated
        }

        try {
            List<ChatMessage> messages = chatService.getMessagesForRoom(roomId);
            if (messages == null) {
                return ResponseEntity.status(404).body(null); // Room not found or no messages available
            }
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);  // Internal Server Error if something goes wrong
        }
    }
}
