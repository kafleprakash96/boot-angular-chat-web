package com.prkcode.chatwebbackend.service;

import com.prkcode.chatwebbackend.dto.UserStatusDto;
import com.prkcode.chatwebbackend.model.User;
import com.prkcode.chatwebbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserService {

    
    private UserRepository userRepository;

    
    private SimpMessagingTemplate messagingTemplate;

    private final Map<Long,Boolean> userStatusMap = new ConcurrentHashMap<>();


    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : null;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public List<User> getAllUsers(){
        return userRepository.findAllUsers();
    }

    public List<User> getAllOtherUsers(Long currentUserId){
        return userRepository.findAllOtherUsers(currentUserId);
    }

    // User online status implementation
//    public void setUserOnline(Long userId){
//        userStatusMap.put(userId,true);
//        broadcastUserStatus(userId,true);
//    }
//
//    public void setUserOffline(Long userId){
//        userStatusMap.put(userId,false);
//    }
//
//    private void broadcastUserStatus(Long userId, boolean isOnline){
//        UserStatusDto status = new UserStatusDto(userId,isOnline);
//        messagingTemplate.convertAndSend("/topic/user-status",status);
//    }
//    public boolean isUserOnline(Long userId){
//        return userStatusMap.getOrDefault(userId,false);
//    }
}
