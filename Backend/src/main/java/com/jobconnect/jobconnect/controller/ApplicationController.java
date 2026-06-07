package com.jobconnect.jobconnect.controller;

import com.jobconnect.jobconnect.dto.ApplicationDTO;
import com.jobconnect.jobconnect.entity.Application;
import com.jobconnect.jobconnect.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.jobconnect.entity.ApplicationStatus;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {
        return applicationService.updateApplicationStatus(id, status);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Application> getApplicationsByUserId(@PathVariable Long userId) {
        return applicationService.getApplicationsByUserId(userId);
    }

    @PostMapping
    public Application createApplication(@RequestBody ApplicationDTO dto) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return applicationService.createApplication(dto, email);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
    }
}
