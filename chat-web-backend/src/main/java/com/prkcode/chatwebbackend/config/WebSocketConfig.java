package com.prkcode.chatwebbackend.config;

import com.prkcode.chatwebbackend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.*;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> authorization = accessor.getNativeHeader("Authorization");
                    if (authorization != null && !authorization.isEmpty()) {
                        String token = authorization.get(0).replace("Bearer ", "");
                        // Validate token and set authentication
                        // You'll need to implement this part based on your JWT validation logic
                    }
                }
                return message;
            }
        });
    }

    private boolean validateTokenAndSetAuthentication(String token) {
        try {
            String username = jwtService.extractUsername(token);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate the token
            if (jwtService.isTokenValid(token, userDetails)) {
                // Create an authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Set the authentication in the SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                return true;
            }
        } catch (Exception e) {
            System.out.println("Authentication failed for token" + e);
        }
        return false;
    }

}
