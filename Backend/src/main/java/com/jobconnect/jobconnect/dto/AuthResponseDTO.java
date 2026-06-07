package com.jobconnect.jobconnect.dto;

public class AuthResponseDTO {

    private String token;
    private String name;
    private String email;
    private String role;
    private Long id;
    private String title;
    private String skills;

    public AuthResponseDTO(String token, String name, String email, String role) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public AuthResponseDTO(String token, String name, String email, String role, Long id, String title, String skills) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
        this.id = id;
        this.title = title;
        this.skills = skills;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
