package com.prkcode.chatwebbackend.repository;

import com.prkcode.chatwebbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("select u from User u")
    List<User> findAllUsers();

    //Exclude current user
    @Query("select u from User u where u.id != :currentUserId")
    List<User> findAllOtherUsers(@Param("currentUserId") Long currenUserId);
}
