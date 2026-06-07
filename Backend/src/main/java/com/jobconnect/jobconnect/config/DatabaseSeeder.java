package com.jobconnect.jobconnect.config;

import com.jobconnect.jobconnect.entity.Job;
import com.jobconnect.jobconnect.entity.User;
import com.jobconnect.jobconnect.repository.JobRepository;
import com.jobconnect.jobconnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          JobRepository jobRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create a default employer if one doesn't exist
        String employerEmail = "employer@acme.com";
        User employer = userRepository.findByEmail(employerEmail).orElse(null);
        
        if (employer == null) {
            employer = new User();
            employer.setName("Acme Corp");
            employer.setEmail(employerEmail);
            employer.setPassword(passwordEncoder.encode("password123"));
            employer.setRole("EMPLOYER");
            employer = userRepository.save(employer);
            System.out.println("[Seeder] Created default employer: employer@acme.com");
        }

        // Seed 15 applicant users if there are no applicants
        if (userRepository.findAll().stream().noneMatch(u -> "APPLICANT".equals(u.getRole()))) {
            String[] applicantNames = {
                "Rahul Sharma", "Priya Patel", "Amit Kumar", "Ananya Iyer", "Vikram Singh", 
                "Sneha Reddy", "Rohan Gupta", "Meera Nair", "Karan Malhotra", "Aditi Rao", 
                "Sanjay Verma", "Divya Teja", "Abhishek Joshi", "Nisha Choudhary", "Ravi Prasad"
            };

            String[] applicantTitles = {
                "Frontend Engineer", "React Developer", "Java Developer", "Full-Stack Architect", 
                "DevOps Specialist", "Data Scientist", "Python Developer", "UI/UX Designer", 
                "iOS Engineer", "SRE", "Cloud Engineer", "QA Automation Engineer", 
                "Backend Developer", "Machine Learning Specialist", "Security Analyst"
            };

            String[] applicantSkills = {
                "React, JavaScript, TypeScript, Tailwind CSS, HTML5, Jest",
                "React, Redux, Next.js, TypeScript, CSS Modules",
                "Java, Spring Boot, Microservices, MySQL, REST API",
                "Java, React, Node.js, Spring Boot, PostgreSQL, Docker",
                "AWS, Kubernetes, Docker, Jenkins, Terraform, CI/CD",
                "Python, R, SQL, TensorFlow, Pandas, Machine Learning",
                "Python, Django, FastAPI, PostgreSQL, Celery",
                "Figma, Adobe XD, Wireframing, User Research, Prototyping",
                "Swift, SwiftUI, Objective-C, CocoaPods, Xcode",
                "Linux, Kubernetes, Prometheus, Grafana, Shell Scripting, Docker",
                "AWS, Azure, CloudFormation, Terraform, Networking",
                "Selenium, Cucumber, Java, Cypress, API Testing",
                "Node.js, Express, MongoDB, Redis, JWT, REST API",
                "Python, PyTorch, Scikit-Learn, NLP, Deep Learning",
                "Penetration Testing, OWASP, Cryptography, Linux, Wireshark"
            };

            for (int i = 0; i < applicantNames.length; i++) {
                User applicant = new User();
                applicant.setName(applicantNames[i]);
                String emailPrefix = applicantNames[i].toLowerCase().replace(" ", ".");
                applicant.setEmail(emailPrefix + "@gmail.com");
                applicant.setPassword(passwordEncoder.encode("password123"));
                applicant.setRole("APPLICANT");
                applicant.setTitle(applicantTitles[i]);
                applicant.setSkills(applicantSkills[i]);
                userRepository.save(applicant);
            }
            System.out.println("[Seeder] Successfully seeded 15 mock candidate profiles!");
        }

        // Seed 100 jobs if the jobs table is empty
        if (jobRepository.count() == 0) {
            String[] titles = {
                "Software Engineer", "React Developer", "Java Developer", "Frontend Developer", 
                "Backend Developer", "Full-Stack Developer", "Data Scientist", "DevOps Engineer", 
                "Product Manager", "UI/UX Designer", "iOS Developer", "SRE", "Cloud Architect", 
                "QA Automation Engineer", "Machine Learning Specialist", "Security Analyst"
            };

            String[] locations = {
                "Bangalore, Karnataka", "Mumbai, Maharashtra", "Delhi NCR", "Hyderabad, Telangana", 
                "Chennai, Tamil Nadu", "Pune, Maharashtra", "Kolkata, West Bengal", "Gurugram, Haryana", 
                "Noida, Uttar Pradesh", "Remote, India"
            };

            String[] descriptions = {
                "We are seeking a highly motivated professional to design, implement, and maintain scalable software features. Collaborating closely with product and QA team members.",
                "Exciting opportunity to join a high-growth tech organization. You will focus on building modern UI screens, writing clean unit tests, and optimizing app performance.",
                "Join our core engineering department. Responsibilities include designing robust REST APIs, scaling relational database queries, and automating deployment scripts.",
                "Looking for a candidate with strong analytical skills to translate raw dataset queries into business intelligence tools. Working with python and data warehouses."
            };

            double[] salaries = {600000, 800000, 1200000, 1500000, 1800000, 2400000, 3000000, 3600000};

            Random random = new Random();
            List<Job> dummyJobs = new ArrayList<>();

            for (int i = 1; i <= 100; i++) {
                Job job = new Job();
                
                // Construct a slightly unique title (e.g. "Senior React Developer")
                String level = (i % 3 == 0) ? "Senior " : (i % 5 == 0) ? "Lead " : "";
                String baseTitle = titles[random.nextInt(titles.length)];
                job.setTitle(level + baseTitle);

                job.setLocation(locations[random.nextInt(locations.length)]);
                job.setDescription(descriptions[random.nextInt(descriptions.length)] + " [Job ID: #" + i + "]");
                job.setSalary(salaries[random.nextInt(salaries.length)]);
                job.setEmployer(employer);
                
                // Map skills realistic to base title
                String skills;
                switch (baseTitle) {
                    case "Software Engineer":
                        skills = "Java, Python, SQL, Git, Data Structures";
                        break;
                    case "React Developer":
                        skills = "React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS";
                        break;
                    case "Java Developer":
                        skills = "Java, Spring Boot, Spring Data JPA, Microservices, PostgreSQL";
                        break;
                    case "Frontend Developer":
                        skills = "HTML5, CSS3, JavaScript, React, Tailwind CSS, Responsive Design";
                        break;
                    case "Backend Developer":
                        skills = "Java, Node.js, Express, PostgreSQL, Redis, REST APIs";
                        break;
                    case "Full-Stack Developer":
                        skills = "Java, React, Node.js, Spring Boot, PostgreSQL, Docker";
                        break;
                    case "Data Scientist":
                        skills = "Python, R, SQL, TensorFlow, Pandas, NumPy, Machine Learning";
                        break;
                    case "DevOps Engineer":
                        skills = "AWS, Kubernetes, Docker, Jenkins, Terraform, CI/CD";
                        break;
                    case "Product Manager":
                        skills = "Product Strategy, Roadmap, Agile, Jira, Market Research, Communication";
                        break;
                    case "UI/UX Designer":
                        skills = "Figma, Adobe XD, Wireframing, User Research, Prototyping";
                        break;
                    case "iOS Developer":
                        skills = "Swift, SwiftUI, Objective-C, CocoaPods, Xcode";
                        break;
                    case "SRE":
                        skills = "Linux, Kubernetes, Prometheus, Grafana, Shell Scripting, Docker";
                        break;
                    case "Cloud Architect":
                        skills = "AWS, Azure, CloudFormation, Terraform, Solution Architecture";
                        break;
                    case "QA Automation Engineer":
                        skills = "Selenium, Cucumber, Java, Cypress, API Testing, Jenkins";
                        break;
                    case "Machine Learning Specialist":
                        skills = "Python, PyTorch, Scikit-Learn, NLP, Deep Learning, TensorFlow";
                        break;
                    case "Security Analyst":
                        skills = "Penetration Testing, OWASP, Cryptography, Linux, Wireshark, Network Security";
                        break;
                    default:
                        skills = "Java, React, SQL";
                        break;
                }
                job.setSkills(skills);
                
                dummyJobs.add(job);
            }

            jobRepository.saveAll(dummyJobs);
            System.out.println("[Seeder] Successfully seeded 100 mock jobs in the database!");
        }
    }
}
