package com.prkcode.chatwebbackend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prkcode.chatwebbackend.dto.MessageReactionEvent;
import com.prkcode.chatwebbackend.dto.MessageUpdateDTO;
import com.prkcode.chatwebbackend.dto.ReactionDTO;
import com.prkcode.chatwebbackend.model.ChatMessage;
import com.prkcode.chatwebbackend.model.MessageReaction;
import com.prkcode.chatwebbackend.repository.ChatMessageRepository;
import com.prkcode.chatwebbackend.repository.MessageReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class MessageReactionService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private MessageReactionRepository messageReactionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private  KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Value("${SPRING_KAFKA_PRODUCER_CHAT_REACTIONS_TOPIC}")
    private String CHAT_REACTIONS_TOPIC;

    public MessageReaction addReaction(Long messageId, MessageReaction reaction) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Remove existing reaction from the same user if it exists
        message.getReactions().removeIf(r -> r.getUser().equals(reaction.getUser()));

        // Set message and timestamp
        reaction.setMessage(message);
        reaction.setTimestamp(LocalDateTime.now());

        // Save reaction
        MessageReaction savedReaction = messageReactionRepository.save(reaction);

        // Update message with new reaction
        message.getReactions().add(savedReaction);
        ChatMessage updatedMessage = chatMessageRepository.save(message);

        try {
            // Create a reaction event object
            MessageReactionEvent event = new MessageReactionEvent(
                    messageId,
                    updatedMessage.getChatRoom().getId(),
                    reaction.getUser(),
                    reaction.getType(),
                    "REACTION_ADDED"
            );

            // Serialize and send to Kafka
            Object serializedEvent = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(CHAT_REACTIONS_TOPIC, serializedEvent);
            broadcastMessageUpdate(updatedMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize reaction event", e);
        }

        return savedReaction;
    }

    public MessageReaction removeReaction(Long messageId, String username) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        MessageReaction removedReaction = message.getReactions().stream()
                .filter(r -> r.getUser().equals(username))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Reaction not found"));

        message.getReactions().remove(removedReaction);
        messageReactionRepository.delete(removedReaction);
        ChatMessage updatedMessage = chatMessageRepository.save(message);

        try {
            MessageReactionEvent event = new MessageReactionEvent(
                    messageId,
                    updatedMessage.getChatRoom().getId(),
                    username,
                    removedReaction.getType(),
                    "REACTION_REMOVED"
            );

            String serializedEvent = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(CHAT_REACTIONS_TOPIC, serializedEvent);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize reaction event", e);
        }

        return removedReaction;
    }

    private void broadcastMessageUpdate(ChatMessage message) {
        // Create a DTO to avoid circular references
        MessageUpdateDTO updateDTO = new MessageUpdateDTO(
                message.getId(),
                message.getContent(),
                message.getTimestamp(),
                message.getSender(),
                message.getReactions().stream()
                        .map(reaction -> new ReactionDTO(
                                reaction.getId(),
                                reaction.getUser(),
                                reaction.getType(),
                                reaction.getTimestamp()
                        ))
                        .collect(Collectors.toList())
        );

        // Broadcast to room-specific topic
        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getChatRoom().getId() + "/messages",
                updateDTO
        );
    }
}
