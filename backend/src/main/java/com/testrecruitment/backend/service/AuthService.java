package com.testrecruitment.backend.service;

import com.testrecruitment.backend.helper.CurrentUserHolder;
import com.testrecruitment.backend.model.Users;
import com.testrecruitment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Users getCurrentUser() {
        Users user = CurrentUserHolder.get();
        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }
        return user;
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<Users> findByEmailOrUsername(String identifier) {
        Optional<Users> user = userRepository.findByEmail(identifier);
        if (!user.isPresent()) {
            user = userRepository.findByUsername(identifier);
        }
        return user;
    }

    public Users createUser(Users user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email sudah digunakan.");
        }

        // Optional: cek username juga kalau mau
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username sudah digunakan.");
        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public Users updateUser(Long id, Users userDetails) {
        return userRepository.findById(id).map(user -> {
            // Cek apakah username sudah digunakan oleh user lain
            Optional<Users> existingUserWithSameUsername = userRepository.findByUsername(userDetails.getUsername());
            if (existingUserWithSameUsername.isPresent() && !existingUserWithSameUsername.get().getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username sudah digunakan oleh user lain.");
            }
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            user.setRole(userDetails.getRole());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

}