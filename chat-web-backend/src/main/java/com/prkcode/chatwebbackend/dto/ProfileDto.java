package com.prkcode.chatwebbackend.dto;

import com.prkcode.chatwebbackend.enums.ProfileVisibility;
import com.prkcode.chatwebbackend.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class ProfileDto {

    private Long id;
    private String username;
    private String firstName;
    private String lastName;

    private String bio;
    private String profilePictureUrl;
    private String coverPictureUrl;
    private LocalDateTime lastUpdated;

    private String location;
    private String website;
    private String company;
    private String occupation;

    private String about;

    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;

    private ProfileVisibility visibility;
    private boolean isEmailVerified;
    private boolean isPhoneVerified;
}
