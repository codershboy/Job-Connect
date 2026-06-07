package com.jobconnect.jobconnect.service;

import com.jobconnect.jobconnect.entity.User;
import com.jobconnect.jobconnect.repository.UserRepository;
import org.springframework.stereotype.Service;

import com.jobconnect.jobconnect.dto.AuthResponseDTO;
import com.jobconnect.jobconnect.dto.UserLoginDTO;
import com.jobconnect.jobconnect.dto.UserRegisterDTO;
import com.jobconnect.jobconnect.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponseDTO registerUser(UserRegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole().toUpperCase());

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        return new AuthResponseDTO(token, user.getName(), user.getEmail(), user.getRole(), user.getId(), user.getTitle(), user.getSkills());
    }

    public AuthResponseDTO loginUser(UserLoginDTO dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        return new AuthResponseDTO(token, user.getName(), user.getEmail(), user.getRole(), user.getId(), user.getTitle(), user.getSkills());
    }

    public User updateUserProfile(String email, String name, String title, String skills) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setName(name);
        user.setTitle(title);
        user.setSkills(skills);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(User user) {
        // Fallback for simple entity persistence (hashing password)
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getApplicants() {
        return userRepository.findByRole("APPLICANT");
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
