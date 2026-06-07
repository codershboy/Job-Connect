package com.jobconnect.jobconnect.controller;

import com.jobconnect.jobconnect.entity.User;
import com.jobconnect.jobconnect.service.UserService;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.jobconnect.dto.AuthResponseDTO;
import com.jobconnect.jobconnect.dto.UserLoginDTO;
import com.jobconnect.jobconnect.dto.UserRegisterDTO;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/register")
    public AuthResponseDTO registerUser(@Valid @RequestBody UserRegisterDTO dto) {
        return userService.registerUser(dto);
    }

    @PostMapping("/auth/login")
    public AuthResponseDTO loginUser(@Valid @RequestBody UserLoginDTO dto) {
        return userService.loginUser(dto);
    }

    @GetMapping("/applicants")
    public List<User> getApplicants() {
        return userService.getApplicants();
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(@Valid @RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/profile")
    public User updateProfile(@RequestBody User profileUpdate) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.updateUserProfile(email, profileUpdate.getName(), profileUpdate.getTitle(), profileUpdate.getSkills());
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
