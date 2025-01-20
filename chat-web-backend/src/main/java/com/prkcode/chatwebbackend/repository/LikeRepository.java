package com.prkcode.chatwebbackend.repository;

import com.prkcode.chatwebbackend.model.Comment;
import com.prkcode.chatwebbackend.model.Like;
import com.prkcode.chatwebbackend.model.Post;
import com.prkcode.chatwebbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like,Long> {
    Optional<Like> findByPostAndAuthor(Post post, User author);
    Optional<Like> findByCommentAndAuthor(Comment comment, User author);
}
