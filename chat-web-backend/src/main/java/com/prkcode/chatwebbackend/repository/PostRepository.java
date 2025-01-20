package com.prkcode.chatwebbackend.repository;

import com.prkcode.chatwebbackend.model.Post;
import com.prkcode.chatwebbackend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post,Long> {

    Page<Post> findByIsPublic(boolean isPublic, Pageable pageable);

    @Query("select  p from Post p where p.isPublic = true or p.author= :user")
    Page<Post> findByIsPublicTrueOrAuthor(@Param("user")User user, Pageable pageable);
}
