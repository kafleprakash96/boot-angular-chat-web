package com.prkcode.chatwebbackend.controller;


import com.prkcode.chatwebbackend.dto.ProfileDto;
import com.prkcode.chatwebbackend.model.Profile;
import com.prkcode.chatwebbackend.service.ProfileService;
import com.prkcode.chatwebbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    @Value("${app.upload.dir}")
    private String uploadDir;

//    @GetMapping("/current")
//    public ResponseEntity<User> getUserProfile(String username) {
//        return ResponseEntity.ok(profileService.getUserProfile(username));
//    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User user) {
        return ResponseEntity.ok(profileService.updateProfile(user));
    }



    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDto> getUserProfile(@PathVariable Long userId){
        return ResponseEntity.ok(profileService.getUserProfile(userId));
    }


    @PostMapping("/create/{username}")
//    @PreAuthorize("#username == authentication.principal.username")
    public ResponseEntity<ProfileDto> createUserProfile(@PathVariable String username,
                                                        @RequestBody ProfileDto profileDto){
        System.out.println();
        return ResponseEntity.ok(profileService.createUserProfile(username, profileDto));
    }

//    @PutMapping("/update/{username}")
////    @PreAuthorize("#username == authentication.principal.username")
//    public ResponseEntity<ProfileDto> updateUserProfile(@PathVariable String username,
//                                                        @RequestBody ProfileDto profileDto) {
//        return ResponseEntity.ok(profileService.updateProfile(username, profileDto));
//    }

//    @PutMapping("/update/cover-picture")
//    public ResponseEntity<Profile> updateCoverPicture(
//            @RequestParam("file") MultipartFile file){
//        try {
//            if (file.isEmpty()) {
//                throw new IllegalArgumentException("File is empty");
//            }
//            Profile updatedProfile = profileService.updateCoverPicture(userDetails.getUsername(), file);
//            return ResponseEntity.ok(updatedProfile);
//        } catch (IllegalArgumentException e) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
//        } catch (Exception e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update cover picture");
//        }
//    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error serving file: " + filename);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/upload/cover-picture")
    public ResponseEntity<User> updateCoverPicture(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(profileService.updateProfilePicture(file));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/upload/profile-picture")
    public ResponseEntity<User> updateProfilePicture(@RequestParam("file") MultipartFile file) throws IOException {
        try {
            return ResponseEntity.ok(profileService.updateCoverPicture(file));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
