package com.prkcode.chatwebbackend.repository;

import com.prkcode.chatwebbackend.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile,Long> {
    Optional<Profile> findByUserUsername(String username);
}
