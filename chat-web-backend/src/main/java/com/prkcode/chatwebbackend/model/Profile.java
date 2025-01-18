package com.prkcode.chatwebbackend.model;

import com.prkcode.chatwebbackend.enums.ProfileVisibility;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profile")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private String bio;
    private String profilePictureUrl;
    private String coverPictureUrl;
    private LocalDateTime lastUpdated;

    private String location;
    private String website;
    private String company;
    private String occupation;

    @Column(length = 1000)
    private String about;

    @Column(name="social_links")
    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;

    @Enumerated(EnumType.STRING)
    private ProfileVisibility visibility;
    private boolean isEmailVerified;
    private boolean isPhoneVerified;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
