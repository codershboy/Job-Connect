package com.jobconnect.jobconnect.security;

import com.jobconnect.jobconnect.entity.User;
import com.jobconnect.jobconnect.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Format user role correctly as SimpleGrantedAuthority (e.g. ROLE_APPLICANT)
        String userRole = user.getRole();
        if (userRole == null) {
            userRole = "APPLICANT";
        }
        if (!userRole.startsWith("ROLE_")) {
            userRole = "ROLE_" + userRole.toUpperCase();
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(userRole))
        );
    }
}
