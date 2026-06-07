package com.jobconnect.jobconnect.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name ="jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    private double salary;
    private String skills;
    @ManyToOne
    @JoinColumn(name = "employer_id")
    private User employer;
}
