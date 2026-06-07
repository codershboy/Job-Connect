package com.jobconnect.jobconnect.service;

import com.jobconnect.jobconnect.entity.Job;
import com.jobconnect.jobconnect.repository.JobRepository;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Page<Job> getJobsPaginated(String title, String location, Pageable pageable) {
        String searchTitle = title == null ? "" : title;
        String searchLocation = location == null ? "" : location;
        return jobRepository.findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(searchTitle, searchLocation, pageable);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
