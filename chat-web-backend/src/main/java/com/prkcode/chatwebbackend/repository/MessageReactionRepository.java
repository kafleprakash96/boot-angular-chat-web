package com.prkcode.chatwebbackend.repository;

import com.prkcode.chatwebbackend.model.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageReactionRepository extends JpaRepository<MessageReaction,Long> {
}
