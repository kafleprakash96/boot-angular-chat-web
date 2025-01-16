package com.prkcode.chatwebbackend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prkcode.chatwebbackend.dto.MessageReactionEvent;
import com.prkcode.chatwebbackend.model.ChatMessage;
import com.prkcode.chatwebbackend.model.ChatRoom;
import com.prkcode.chatwebbackend.model.MessageReaction;
import com.prkcode.chatwebbackend.repository.ChatMessageRepository;
import com.prkcode.chatwebbackend.repository.ChatRoomRepository;
import com.prkcode.chatwebbackend.repository.MessageReactionRepository;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class ChatService {

    private final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;


    public ChatService(ChatRoomRepository chatRoomRepository,
                       ChatMessageRepository chatMessageRepository,
                       KafkaTemplate<String, String> kafkaTemplate) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public ChatRoom createRoom(String name){
        ChatRoom room = new ChatRoom();
        String createdBy = userService.getCurrentUsername();
        room.setName(name);
        room.setCreatedBy(createdBy);
        return chatRoomRepository.save(room);
    }

    public List<ChatRoom> getAllRooms(){
        return chatRoomRepository.findAll();
    }

    public ChatRoom getRoomById(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
    }

    public List<ChatMessage> findChatRoomId(Long roomId) {
        // First verify the room exists
        if (!chatRoomRepository.existsById(roomId)) {
            throw new RuntimeException("Room not found with id: " + roomId);
        }

        return chatMessageRepository.findByChatRoomIdOrderByTimestampDesc(roomId);
    }

    public void sendMessage(Long roomId, ChatMessage message,String sender){
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        message.setChatRoom(room);
        message.setTimestamp(LocalDateTime.now());
        message.setConsumed(false);
        message.setSender(sender);

        ChatMessage savedMessage = chatMessageRepository.save(message);

        try {
            // Serialize the message to JSON
            String serializedMessage = objectMapper.writeValueAsString(savedMessage);

            // Send the JSON string to Kafka
            kafkaTemplate.send("chat-topic", serializedMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize ChatMessage", e);
        }
    }

    public void markAsSeen(Long messageId, String username){
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(()-> new RuntimeException("Message not found"));

        message.getSeenby().add(username);
        chatMessageRepository.save(message);

        //Todo
        //Assuming 2 users seen the message
        if(message.getSeenby().size() >=2){
            message.setConsumed(true);
            chatMessageRepository.save(message);
        }
    }

    public List<ChatMessage> getMessagesForRoom(Long roomId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room == null) {
            return null;
        }
        return room.getMessages();  // Return the list of messages from the room
    }

    @KafkaListener(topics = "chat-topic",groupId = "chat-group")
    public void listen(ConsumerRecord<String,String> record){
        try{
            String messageJson = record.value();
            ChatMessage message = objectMapper.readValue(messageJson,ChatMessage.class);
            messagingTemplate.convertAndSend("/topic/room/" + message.getChatRoom().getId(),message);

        }catch (JsonProcessingException e){
            log.error("Error while processing message from kafka", e);
        }
    }

    @KafkaListener(topics = "chat-reactions", groupId = "chat-group")
    public void listenToReactions(ConsumerRecord<String, String> record) {
        try {
            String eventJson = record.value();
            MessageReactionEvent event = objectMapper.readValue(eventJson, MessageReactionEvent.class);

            // Broadcast to room-specific WebSocket topic
            messagingTemplate.convertAndSend(
                    "/topic/room/" + event.getRoomId() + "/reactions",
                    event
            );
        } catch (JsonProcessingException e) {
            log.error("Error while processing reaction event from kafka", e);
        }
    }


}
