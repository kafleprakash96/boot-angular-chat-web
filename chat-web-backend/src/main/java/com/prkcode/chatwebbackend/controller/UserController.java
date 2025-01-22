package com.prkcode.chatwebbackend.controller;

import com.prkcode.chatwebbackend.dto.*;
import com.prkcode.chatwebbackend.model.User;
import com.prkcode.chatwebbackend.service.AuthenticationService;
import com.prkcode.chatwebbackend.service.JwtService;
import com.prkcode.chatwebbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/auth")
public class UserController {

    private final AuthenticationService authenticationService;

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    private final Map<Long,Boolean> userStatusMap = new HashMap<>();

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    public UserController(AuthenticationService authenticationService,
                          JwtService jwtService,
                          UserDetailsService userDetailsService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/validate-token")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if(token == null || !token.startsWith("Bearer ")){
                System.out.println("Invalid token format");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
            }
            String actualToken = token.substring(7);
            String username = jwtService.extractUsername(actualToken);
            UserDetails userdetails = userDetailsService.loadUserByUsername(username);
            System.out.println("Received token: " + actualToken);
            return ResponseEntity.ok(jwtService.isTokenValid(actualToken,userdetails));
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/users/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();

        // Fetch user by username (returns Optional<User>)
        Optional<User> optionalUser = userService.findByUsername(username);

        // If the user is present, return 200 OK with user details, else return 404
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        } else {
            // User not found, return 404 Not Found response
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Optional: Get all users except current user
    @GetMapping("/users/others")
    public ResponseEntity<List<User>> getAllOtherUsers(@RequestParam Long currentUserId) {
        List<User> users = userService.getAllOtherUsers(currentUserId);
        return ResponseEntity.ok(users);
    }

    //Websocket controller for user status
    @MessageMapping("/user.status")
    @SendTo("/topic/user-status")
    public UserStatusDto handleUserStatus(Principal principal, StatusUpdateRequest request){
        if(principal == null){
            throw new IllegalStateException("User is not authenticated");
        }
        Long userId = getUserIdFromPrincipal(principal);
        if(request.isOnline()){
            userStatusMap.put(userId,true);
        }else {
            userStatusMap.remove(userId);
        }
        System.out.println("Current online users after update: " + userStatusMap);
        return new UserStatusDto(userId,request.isOnline());
    }


    private Long getUserIdFromPrincipal(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
            User user = (User) auth.getPrincipal();
            System.out.println("User Details: " + user);
            return user.getId();
        }
        throw new IllegalStateException("Invalid authentication type");
    }

    //Synchronize all users status across multiple browser
    @MessageMapping("/user.status.initial")
    @SendTo("/topic/user-status-initial")
    public void handleInitialStatusRequest(Principal principal, StatusUpdateRequest request){
        System.out.println("Sending initial status map : " + userStatusMap);
        Long requestingUserId = getUserIdFromPrincipal(principal);
        System.out.println("Initial status requested by user: " + requestingUserId);
        System.out.println("Current status map: " + userStatusMap);

        // Send the current status map to the requesting client
        messagingTemplate.convertAndSend("/topic/user-status-initial", userStatusMap);
        System.out.println("Sent initial status map to client");
    }

}
