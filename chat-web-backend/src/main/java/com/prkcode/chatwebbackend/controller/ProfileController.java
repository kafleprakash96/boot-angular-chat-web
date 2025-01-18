package com.prkcode.chatwebbackend.controller;


import com.prkcode.chatwebbackend.dto.ProfileDto;
import com.prkcode.chatwebbackend.model.Profile;
import com.prkcode.chatwebbackend.service.ProfileService;
import com.prkcode.chatwebbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.prkcode.chatwebbackend.model.User;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileService profileService;

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User user) {
        return ResponseEntity.ok(profileService.updateProfile(user));
    }

    @PutMapping("/profile-picture")
    public ResponseEntity<User> updateProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(profileService.updateProfilePicture(file));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDto> getUserProfile(@PathVariable String username){
        return ResponseEntity.ok(profileService.getUserProfile(username));
    }


    @PostMapping("/create/{username}")
//    @PreAuthorize("#username == authentication.principal.username")
    public ResponseEntity<ProfileDto> createUserProfile(@PathVariable String username,
                                                        @RequestBody ProfileDto profileDto){
        System.out.println();
        return ResponseEntity.ok(profileService.createUserProfile(username, profileDto));
    }

    @PutMapping("/update/{username}")
//    @PreAuthorize("#username == authentication.principal.username")
    public ResponseEntity<ProfileDto> updateUserProfile(@PathVariable String username,
                                                        @RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.updateProfile(username, profileDto));
    }

    @PostMapping("/update/cover-picture")
    public ResponseEntity<Profile> updateCoverPicture(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }
            Profile updatedProfile = profileService.updateCoverPicture(userDetails.getUsername(), file);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update cover picture");
        }
    }

}
