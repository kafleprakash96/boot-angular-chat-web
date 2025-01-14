package com.prkcode.chatwebbackend.controller;

import com.prkcode.chatwebbackend.model.ChatRoom;

import com.prkcode.chatwebbackend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
//import  com.users.usersservice.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Value("${users.service.url}")
    private String userServiceUrl;


//    private final RestTemplate restTemplate;
    private final ChatService chatService;

    public RoomController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Get all rooms for the authenticated user
//    @GetMapping
//    public ResponseEntity<List<ChatRoom>> getAllRooms(Authentication authentication) {
//        if (authentication == null) {
//            return ResponseEntity.status(401).body(null);  // Unauthorized if no authentication
//        }
//        try {
////            userService.getCurrentUser(authentication.getName()); // Ensure user is authenticated
//            List<ChatRoom> rooms = chatService.getAllRooms();
//            return ResponseEntity.ok(rooms);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(null);  // Internal Server Error if something goes wrong
//        }
//    }

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
}
