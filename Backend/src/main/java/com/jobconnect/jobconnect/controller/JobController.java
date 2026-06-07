package com.jobconnect.jobconnect.controller;

import com.jobconnect.jobconnect.entity.Job;
import com.jobconnect.jobconnect.service.JobService;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.jobconnect.dto.JobCreateDTO;
import com.jobconnect.jobconnect.entity.User;
import com.jobconnect.jobconnect.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;
    private final UserService userService;

    public JobController(JobService jobService, UserService userService) {
        this.jobService = jobService;
        this.userService = userService;
    }

    @GetMapping
    public Page<Job> getJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            Pageable pageable) {
        return jobService.getJobsPaginated(title, location, pageable);
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @PostMapping
    public Job createJob(@Valid @RequestBody JobCreateDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User employer = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged in employer not found with email: " + email));
        
        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());
        job.setSkills(dto.getSkills());
        job.setEmployer(employer);
        
        return jobService.saveJob(job);
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
    }
}
