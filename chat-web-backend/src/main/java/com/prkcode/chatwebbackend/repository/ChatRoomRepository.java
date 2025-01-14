package com.prkcode.chatwebbackend.repository;


import com.prkcode.chatwebbackend.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,Long> {
}
