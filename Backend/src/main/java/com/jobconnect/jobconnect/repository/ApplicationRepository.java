package com.jobconnect.jobconnect.repository;

import com.jobconnect.jobconnect.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantId(Long userId);
}
