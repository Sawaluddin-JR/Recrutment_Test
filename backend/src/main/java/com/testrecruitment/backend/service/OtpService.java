package com.testrecruitment.backend.service;

import com.testrecruitment.backend.model.VerificationCode;
import com.testrecruitment.backend.repository.VerificationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private VerificationCodeRepository codeRepo;

    @Autowired
    private JavaMailSender mailSender;

    public String generateCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void sendOtp(String email) {
        String code = generateCode();

        // Simpan ke DB
        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setCode(code);
        vc.setExpiredAt(LocalDateTime.now().plusMinutes(5)); // 5 menit masa aktif
        codeRepo.save(vc);

        // Kirim email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Kode Verifikasi OTP");
        message.setText("Kode OTP Anda adalah: " + code + "\nBerlaku selama 5 menit.");

        try {
            mailSender.send(message);
            System.out.println("OTP terkirim ke " + email + ": " + code);
        } catch (Exception e) {
            System.err.println("Gagal kirim OTP ke email: " + e.getMessage());
        }
    }

    public boolean verifyCode(String email, String inputCode) {
        var optCode = codeRepo.findTopByEmailOrderByExpiredAtDesc(email);

        var vcc = optCode.get();
        System.out.println("OTP from DB: " + vcc.getCode());
        System.out.println("Expired At: " + vcc.getExpiredAt());
        System.out.println("Current Time: " + LocalDateTime.now());
        System.out.println("Input Code: " + inputCode);

        return codeRepo.findTopByEmailOrderByExpiredAtDesc(email)
                .filter(vc -> vc.getCode().equals(inputCode) && vc.getExpiredAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }
}