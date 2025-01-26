package com.prkcode.chatwebbackend.config;

import com.prkcode.chatwebbackend.dto.ProfileDto;
import com.prkcode.chatwebbackend.model.Profile;
import com.prkcode.chatwebbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

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

    @Bean
    public CorsRegistry registry(){
        return new CorsRegistry();
    }

    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.createTypeMap(Profile.class, ProfileDto.class).addMappings(
                mapper -> {
                    mapper.map(src -> src.getUser().getUsername(),ProfileDto::setUsername);
                    mapper.map(src -> src.getUser().getFirstName(),ProfileDto::setFirstName);
                    mapper.map(src -> src.getUser().getLastName(),ProfileDto::setLastName);
                }
        );

        modelMapper.createTypeMap(ProfileDto.class, Profile.class).addMappings(
                mapper -> {
                    mapper.skip(Profile::setUser);
                }
        );
        return modelMapper;
    }

}
