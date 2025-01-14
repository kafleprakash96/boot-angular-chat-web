package com.prkcode.chatwebbackend.service;


import com.prkcode.chatwebbackend.dto.AuthenticationRequest;
import com.prkcode.chatwebbackend.dto.AuthenticationResponse;
import com.prkcode.chatwebbackend.dto.RegisterRequest;
import com.prkcode.chatwebbackend.enums.Role;
import com.prkcode.chatwebbackend.model.User;
import com.prkcode.chatwebbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println("Authentication response method");
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            Optional<User> optUser = userRepository.findByUsername(request.getUsername());

            // Check if the user is present
            if (optUser.isEmpty()) {
                throw new BadCredentialsException("Invalid Username and password");
            }

            User user = optUser.get();
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .username(user.getUsername())
                    .build();

        }catch(AuthenticationException e){
            throw new BadCredentialsException("Invalid Username and password");
        }
    }
}
