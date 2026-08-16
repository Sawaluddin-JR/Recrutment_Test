package com.testrecruitment.backend.controller;

import com.testrecruitment.backend.dto.UpdatePasswordOtpDto;
import com.testrecruitment.backend.dto.UserRequestDto;
import com.testrecruitment.backend.dto.UserResponseDto;
import com.testrecruitment.backend.mapper.UserMapper;
import com.testrecruitment.backend.model.Users;
import com.testrecruitment.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173/") // Boleh diatur sesuai frontend URL
public class UserController {

    private final UserService userService;
    // private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        // this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/identifier/{identifier}")
    public ResponseEntity<Users> findByIdentifier(@PathVariable String identifier) {
        return userService.findByEmailOrUsername(identifier)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequestDto userDto) {
        try {
            Users created = userService.createUser(UserMapper.toEntity(userDto));
            return ResponseEntity.ok(UserMapper.toResponse(created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserRequestDto userDto) {

        Users updated = userService.updateUser(id, UserMapper.toEntity(userDto));
        return ResponseEntity.ok(UserMapper.toResponse(updated));
    }

    @PutMapping("/{id}/update-password")
    public ResponseEntity<Map<String, String>> updatePasswordWithOtp(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePasswordOtpDto dto) {

        userService.updatePasswordWithOtp(id, dto);
        return ResponseEntity.ok(Map.of("message", "Password berhasil diperbarui."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // UsersController.java
    @PutMapping("/{email}/reset-password")
    public ResponseEntity<String> resetPasswordByAdmin(
            @PathVariable String email,
            @RequestParam(defaultValue = "123123") String newPassword) {

        userService.resetPasswordByAdmin(email, newPassword);
        return ResponseEntity.ok("Password berhasil di-reset menjadi: " + newPassword);
    }

}
