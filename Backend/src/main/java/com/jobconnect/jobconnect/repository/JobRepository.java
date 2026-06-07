package com.jobconnect.jobconnect.repository;

import com.jobconnect.jobconnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobRepository extends JpaRepository<Job, Long> {
    Page<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(String title, String location, Pageable pageable);
}
