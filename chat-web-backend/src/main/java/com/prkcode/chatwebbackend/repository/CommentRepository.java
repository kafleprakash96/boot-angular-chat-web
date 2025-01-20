package com.prkcode.chatwebbackend.repository;

import com.prkcode.chatwebbackend.model.Comment;
import com.prkcode.chatwebbackend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Long> {

    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
}
