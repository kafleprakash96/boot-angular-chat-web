package com.prkcode.chatwebbackend.service;

import com.prkcode.chatwebbackend.model.User;
import com.prkcode.chatwebbackend.repository.UserRepository;
import com.prkcode.chatwebbackend.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Transactional
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Autowired
    private ImageUtils imageUtils;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User updateProfile(User updatedUser) {
        User currentUser = getCurrentUser();
        currentUser.setFirstName(updatedUser.getFirstName());
        currentUser.setLastName(updatedUser.getLastName());
        currentUser.setEmail(updatedUser.getEmail());
        return userRepository.save(currentUser);
    }

    public User updateProfilePicture(MultipartFile file) throws IOException {
        if (!imageUtils.isValidImageFormat(file.getContentType())) {
            throw new IllegalArgumentException("Invalid image format. Only JPG, JPEG, and PNG are allowed.");
        }

        // Extract file extension from original filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        String format = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        // Map file extension to format
        switch (fileExtension) {
            case ".jpg":
            case ".jpeg":
                format = "jpg";
                break;
            case ".png":
                format = "png";
                break;
            default:
                throw new IllegalArgumentException("Unsupported file extension: " + fileExtension);
        }

        // Compress image to standard size (e.g., 800px width)
        byte[] compressedImage = imageUtils.compressImage(file.getBytes(), 800, format);

        // Create uploads directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Get current user and generate unique filename
        User currentUser = getCurrentUser();
        String username = currentUser.getUsername();
        String filename = username + "-profile" + fileExtension;
        Path filepath = Paths.get(uploadDir, filename);

        // Save compressed file
        Files.write(filepath, compressedImage);

        // Update user profile picture path
        currentUser.setProfilePicture("/uploads/" + filename);
        return userRepository.save(currentUser);
    }

}
