package com.prkcode.chatwebbackend.config;

import com.prkcode.chatwebbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Autowired
    private UserRepository repository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            try {
                // Attempt to fetch user by username
                return repository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
            } catch (Exception e) {
                // Log the exception (optional, you can use your logger)
                System.err.println("Error fetching user by username: " + username);
                e.printStackTrace();
                // Throw a specific exception or return a default value if needed
                throw new UsernameNotFoundException("User not found with username: " + username);
            }
        };
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
