package com.testrecruitment.backend.service;

import com.testrecruitment.backend.dto.UpdatePasswordOtpDto;
import com.testrecruitment.backend.model.Users;
import com.testrecruitment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<Users> findByEmailOrUsername(String identifier) {
        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier));
    }

    public Users getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new RuntimeException("User not authenticated");
        }

        String identifier = auth.getName(); // Bisa username atau email
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("User not found"));
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
            // Update username hanya kalau tidak null dan tidak kosong
            if (userDetails.getUsername() != null && !userDetails.getUsername().isBlank()) {
                Optional<Users> existingUserWithSameUsername = userRepository.findByUsername(userDetails.getUsername());
                if (existingUserWithSameUsername.isPresent() &&
                        !existingUserWithSameUsername.get().getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Username sudah digunakan oleh user lain.");
                }
                user.setUsername(userDetails.getUsername());
            }

            // Update email hanya kalau tidak null dan tidak kosong
            if (userDetails.getEmail() != null && !userDetails.getEmail().isBlank()) {
                user.setEmail(userDetails.getEmail());
            }

            // Update password hanya kalau tidak null dan tidak kosong
            if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }

            // Update role hanya kalau tidak null
            if (userDetails.getRole() != null) {
                user.setRole(userDetails.getRole());
            }

            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updatePasswordWithOtp(Long id, UpdatePasswordOtpDto dto) {
        System.out.println("Masuk updatePasswordWithOtp");
        System.out.println("ID user: " + id);
        System.out.println("Email dari DTO: " + dto.getEmail());
        System.out.println("OTP dari DTO: " + dto.getOtp());
        System.out.println("New Password dari DTO: " + dto.getNewPassword());

        boolean isValidOtp = otpService.verifyCode(dto.getEmail(), dto.getOtp());
        System.out.println("Hasil verifikasi OTP: " + isValidOtp);
        if (!isValidOtp) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kode OTP salah");
        }

        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("User ditemukan: " + user.getUsername());

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        System.out.println("Password berhasil diupdate");
    }

    // UsersService.java
    public void resetPasswordByAdmin(String email, String newPassword) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

}