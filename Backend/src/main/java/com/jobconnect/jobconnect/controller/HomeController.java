package com.jobconnect.jobconnect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Welcome to the JobConnect REST API server.");
        response.put("frontendUrl", "http://localhost:3000");
        response.put("description", "Please use the React frontend application to interact with this service.");
        return response;
    }
}
