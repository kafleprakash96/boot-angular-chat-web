package com.prkcode.chatwebbackend.listener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prkcode.chatwebbackend.dto.MessageReactionEvent;
import com.prkcode.chatwebbackend.model.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaChatListener {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Value("${SPRING_KAFKA_PRODUCER_CHAT_TOPIC}")
    private String CHAT_TOPIC;

    @Value("${SPRING_KAFKA_PRODUCER_CHAT_REACTIONS_TOPIC}")
    private String CHAT_REACTIONS_TOPIC;

    @Value("${SPRING_KAFKA_CONSUMER_CHAT_GROUP_ID}")
    private String CHAT_GROUP_ID;

    @Value("${SPRING_KAFKA_CONSUMER_CHAT_REACTIONS_GROUP_ID}")
    private String CHAT_REACTIONS_GROUP_ID;

    @KafkaListener(topics = "${SPRING_KAFKA_PRODUCER_CHAT_TOPIC}", groupId = "${SPRING_KAFKA_CONSUMER_CHAT_GROUP_ID}")
    public void listen(ConsumerRecord<String,String> record){
        try{
            String messageJson = record.value();
            ChatMessage message = objectMapper.readValue(messageJson,ChatMessage.class);
            messagingTemplate.convertAndSend("/topic/room/" + message.getChatRoom().getId(),message);

        }catch (JsonProcessingException e){
            log.error("Error while processing message from kafka", e);
        }
    }

    @KafkaListener(topics = "${SPRING_KAFKA_PRODUCER_CHAT_REACTIONS_TOPIC}", groupId = "${SPRING_KAFKA_CONSUMER_CHAT_REACTIONS_GROUP_ID}")
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
