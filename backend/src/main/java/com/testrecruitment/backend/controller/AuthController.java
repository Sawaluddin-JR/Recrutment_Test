package com.testrecruitment.backend.controller;

import com.testrecruitment.backend.dto.LoginRequestDTO;
import com.testrecruitment.backend.dto.LoginResponseDTO;
import com.testrecruitment.backend.dto.RegisterRequestDTO;
import com.testrecruitment.backend.dto.RegisterResponseDTO;
import com.testrecruitment.backend.helper.CurrentUserHolder;
import com.testrecruitment.backend.mapper.AuthMapper;
import com.testrecruitment.backend.model.Candidate;
import com.testrecruitment.backend.model.LoginHistory;
import com.testrecruitment.backend.model.Users;
import com.testrecruitment.backend.repository.CandidateRepository;
import com.testrecruitment.backend.repository.LoginHistoryRepository;
import com.testrecruitment.backend.repository.UserRepository;
import com.testrecruitment.backend.service.OtpService;
import com.testrecruitment.backend.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final OtpService otpService;
    private final LoginHistoryRepository loginHistoryRepository;
    private final CandidateRepository candidateRepository;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils,
            OtpService otpService, LoginHistoryRepository loginHistoryRepository,
            CandidateRepository candidateRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.otpService = otpService;
        this.loginHistoryRepository = loginHistoryRepository;
        this.candidateRepository = candidateRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request, HttpServletRequest httpRequest) {
        String identifier = request.getIdentifier();
        String password = request.getPassword();

        // Validasi input kosong
        if (identifier == null || password == null || identifier.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email/Username dan password wajib diisi"));
        }

        Users user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email/Username tidak ditemukan"));
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Password salah"));
        }

        // Simpan login history
        loginHistoryRepository.save(LoginHistory.builder()
                .email(user.getEmail())
                .ipAddress(httpRequest.getRemoteAddr())
                .userAgent(httpRequest.getHeader("User-Agent"))
                .loginTime(LocalDateTime.now())
                .user(user)
                .build());

        String token = jwtUtils.generateToken(user.getEmail());
        // setelah user validasi berhasil
        CurrentUserHolder.set(user);

        LoginResponseDTO responseDto = AuthMapper.toDto(token, user);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        String email = request.getEmail();
        String username = request.getUsername();
        String otp = request.getOtp();
        String password = request.getPassword();

        System.out.println("email: " + email);
        System.out.println("username: " + username);
        System.out.println("password: " + password);
        System.out.println("role: " + request.getRole());
        System.out.println("otp: " + otp);

        if (email == null || username == null || password == null || otp == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email, username, password, dan code wajib diisi"));
        }

        if (!otpService.verifyCode(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Kode OTP tidak valid atau sudah kadaluarsa"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email sudah digunakan"));
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username sudah digunakan"));
        }

        Users newUser = AuthMapper.fromRegisterDTO(request, passwordEncoder);
        userRepository.save(newUser);
        // ⬇ Tambahkan candidate default
        Candidate candidate = Candidate.builder()
                .fullName(null) // atau null
                .user(newUser) // ⬅ langsung set objek Users
                .phone(null)
                .address(null)
                .education(null)
                .experience(null)
                .position(null)
                .status("aktif") // default aktif
                .build();

        candidateRepository.save(candidate);

        RegisterResponseDTO response = new RegisterResponseDTO(
                "Register berhasil",
                newUser.getEmail(),
                newUser.getUsername(),
                newUser.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/resend")
    public ResponseEntity<?> resendOtp(@RequestParam String email) {
        otpService.sendOtp(email);
        return ResponseEntity.ok(Map.of("message", "Kode OTP telah dikirim ke email"));
    }
}
