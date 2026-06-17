package com.aiinterview.repository;

import com.aiinterview.entity.User;
import com.aiinterview.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(UserRole role);
}
