CREATE DATABASE IF NOT EXISTS ai_interview_db;
USE ai_interview_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CANDIDATE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    skills TEXT NULL,
    missing_skills TEXT NULL,
    recommendations TEXT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'STARTED',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Answers Table
CREATE TABLE IF NOT EXISTS answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL UNIQUE,
    answer_text TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Results Table
CREATE TABLE IF NOT EXISTS results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL UNIQUE,
    technical_score INT NOT NULL,
    communication_score INT NOT NULL,
    overall_score INT NOT NULL,
    feedback TEXT NOT NULL,
    strengths TEXT NOT NULL,
    weaknesses TEXT NOT NULL,
    improvement_suggestions TEXT NOT NULL,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default admin user for initial testing
-- Password is 'Admin@123' BCrypt hashed
INSERT INTO users (name, email, password, role) 
VALUES ('System Admin', 'admin@interview.com', '$2a$10$4y9pA/eI0/2G06wz99v3y.dO5oT08fX20y.f1N.j1/QpUpLg.C3zC', 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;
