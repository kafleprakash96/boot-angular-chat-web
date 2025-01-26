package com.prkcode.chatwebbackend.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaChatConfig {

    @Value("${SPRING_KAFKA_BOOTSTRAP_SERVERS}")
    private String bootstrapServers;

    @Value("${SPRING_KAFKA_PRODUCER_CHAT_TOPIC}")
    private String chatTopic;

    @Value("${SPRING_KAFKA_PRODUCER_CHAT_REACTIONS_TOPIC}")
    private String chatReactionsTopic;

    @Value("${SPRING_KAFKA_CONSUMER_CHAT_GROUP_ID}")
    private String chatGroupId;

    @Value("${KAFKA_AUTO_OFFSET_RESET}")
    private String autoOffsetReset;


    @Bean
    public NewTopic createChatTopic(){
       return TopicBuilder.name(chatTopic).build();
    }

    @Bean
    public NewTopic createChatReactionsTopic(){
        return TopicBuilder.name(chatReactionsTopic).build();
    }

    @Bean
    public Map<String, Object> producerConfigs() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configs.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configs.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return configs;
    }

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Bean
    public Map<String,Object> consumerConfigs(){
        Map<String,Object> configs = new HashMap<>();
        configs.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,bootstrapServers);
        configs.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,StringDeserializer.class);
        configs.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,autoOffsetReset);
        return configs;
    }

    // KafkaTemplate for sending messages
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
