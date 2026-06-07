package com.jobconnect.jobconnect.service;

import com.jobconnect.jobconnect.dto.ApplicationDTO;
import com.jobconnect.jobconnect.entity.Application;
import com.jobconnect.jobconnect.entity.Job;
import com.jobconnect.jobconnect.entity.User;
import com.jobconnect.jobconnect.repository.ApplicationRepository;
import com.jobconnect.jobconnect.repository.JobRepository;
import com.jobconnect.jobconnect.repository.UserRepository;
import com.jobconnect.jobconnect.entity.ApplicationStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }
    public List<Application> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByApplicantId(userId);
    }


    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application createApplication(ApplicationDTO dto, String email) {

        Application application = new Application();

        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + dto.getJobId()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        application.setJob(job);
        application.setApplicant(user);
        application.setResumeUrl(dto.getResumeUrl());
        application.setMessage(dto.getMessage());
        application.setStatus(ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    public Application updateApplicationStatus(Long id, ApplicationStatus status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}
