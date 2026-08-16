package com.testrecruitment.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Login dan register bebas
                        .requestMatchers(HttpMethod.POST, "/api/questions/**", "/api/questionscode/**",
                                "/api/schedules/**", "/api/users/**", "/api/candidateanswer/**", "/api/testresult/**",
                                "/api/company/**", "/api/candidates/**", "/api/notifications/**")
                        .authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/questions/**", "/api/questionscode/**",
                                "/api/schedules/**", "/api/users/**", "/api/candidateanswer/**", "/api/testresult/**",
                                "/api/company/**", "/api/candidates/**", "/api/notifications/**")
                        .authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/questions/**", "/api/questionscode/**",
                                "/api/schedules/**", "/api/users/**", "/api/candidateanswer/**", "/api/testresult/**",
                                "/api/company/**", "/api/candidates/**", "/api/notifications/**")
                        .authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/questions/**", "/api/questionscode/**",
                                "/api/schedules/**", "/api/users/**", "/api/candidateanswer/**", "/api/testresult/**",
                                "/api/company/**", "/api/candidates/**", "/api/notifications/**")
                        .authenticated() // ✅ini
                        // penting!candidateanswertestresult
                        .anyRequest().authenticated() // sisanya harus pakai token
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // pakai
                // JWT, no
                // session
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // URL frontend kamu
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // kalau pakai cookie atau token

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
