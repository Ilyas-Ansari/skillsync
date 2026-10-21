# SkillSync: Full-Stack Project Team & Mentorship Matching Engine

A complete **Full-Stack Java Programming Micro Project** implementing an intelligent student capstone team formation and faculty mentorship matching platform.

Built with **Spring Boot 3.3 (Java)** on the backend, **React (Vite)** on the frontend, and a **plain Java multi-factor weighted scoring engine** (no external Python/scikit-learn machine learning dependencies required, making it 100% compliant and easy to explain in vivas and academic evaluations).

---

## Architecture Overview

```
                      +---------------------------------------+
                      |       React Frontend (Vite)          |
                      |  - Student Recommendations Dashboard  |
                      |  - Skill Matrix 1-5 Star Sliders      |
                      |  - Team & Mentorship Matrix Heatmap   |
                      |  - Admin Project & Roster Manager     |
                      +-------------------+-------------------+
                                          |
                                          | REST API (JSON / HTTP)
                                          v
                      +---------------------------------------+
                      |       Spring Boot 3.3.4 (Java)        |
                      |  - REST Controllers                   |
                      |  - MatchingService (Scoring Engine)   |
                      |  - MentorshipService (Matrix Engine)  |
                      |  - Spring Data JPA + H2 In-Memory     |
                      +-------------------+-------------------+
                                          |
                                          | SQL Persistence
                                          v
                      +---------------------------------------+
                      |         H2 Database / MySQL           |
                      |  - users, skills, user_skills         |
                      |  - projects, project_skills           |
                      |  - teams, team_members, assignments   |
                      +---------------------------------------+
```

---

## Core Features Implemented

### 1. Student Features
- **Role-Based Authentication**: Register and login as Student, Mentor, or Admin.
- **Skill Proficiency Matrix**: Interactive 1–5 level ratings across diverse domains (Backend, Frontend, Cloud & DevOps, Database, Data & AI).
- **Availability & Interest Preferences**: Set weekly commitment hours and choose domain interest tags.
- **"Recommended Projects" with Exact Match Breakdown**:
  - Live ranking of all capstone projects based on student fit.
  - Transparent 3-way factor breakdown bar (Skill Fit 60%, Domain Interest 20%, Availability Fit 20%).
  - Skill-by-skill comparison showing your current level vs project required level.
- **My Team & Mentor View**:
  - Displays your assigned project and teammates with their skill sets.
  - Dedicated Faculty Mentor card with contact, bio, and verified technical competencies.
  - Team skill coverage analysis (skills mastered by students vs skill gaps covered by the mentor).

### 2. Signature Feature: The Mentorship Matrix Heatmap
- A dynamic **Mentors (Rows) × Teams (Columns)** 2D matrix.
- Color-coded heatmap based on the calculated gap-coverage score:
  - **85% - 100%**: Emerald Green (`#10b981`)
  - **65% - 84%**: Mint / Teal (`#14b8a6`)
  - **45% - 64%**: Amber Yellow (`#f59e0b`)
  - **< 45%**: Orange / Rose (`#f97316`)
- Highlights the winning optimal match for each team with an **Assigned Match** crown badge.
- Interactive click inspection popover revealing the exact mathematical formula, skill gap coverage %, domain alignment %, and specific skills addressed.

### 3. Faculty Mentor Features
- **Mentor Dashboard**: Displays current assigned team load against individual capacity constraints (e.g. 2 / 2 teams).
- **Team Gap Coverage**: Detailed view of assigned teams and identified skill gaps to focus on during mentoring sessions.
- **Mentorship Matrix**: Direct access to evaluate cross-team compatibility.

### 4. Admin / Academic Coordinator Features
- **Platform Analytics**: Total Students, Total Mentors, Active Projects, Formed Teams, and Student Placement Rate.
- **One-Click Greedy Matching Engine**: Instantly runs the Java matching algorithm to create teams and assign mentors.
- **Publish New Projects**: Dynamic modal allowing administrators to specify team size, required weekly hours, difficulty, and required skills with minimum levels.
- **Student Roster Inspector**: Searchable table of all enrolled students, their skills, hours, and team placements.

---

## The Plain Java Scoring Engine (No ML Dependency)

Designed to be mathematically sound, deterministic, and straightforward to explain during viva presentations:

### 1. Student-to-Project Fit Score (0% – 100%)
$$\text{SkillFit} = \frac{1}{|S_{\text{req}}|} \sum_{s \in S_{\text{req}}} \frac{\min(\text{studentLevel}_s, \text{requiredLevel}_s)}{\text{requiredLevel}_s}$$

$$\text{InterestMatch} = \begin{cases} 1.0 & \text{if domain is in student interests} \\ 0.8 & \text{if partial keyword match} \\ 0.2 & \text{baseline} \end{cases}$$

$$\text{Availability} = \min\left(1.0, \frac{\text{studentHours}}{\text{projectHours}}\right)$$

$$\mathbf{\text{Final Match Score}} = (0.60 \times \text{SkillFit}) + (0.20 \times \text{InterestMatch}) + (0.20 \times \text{Availability})$$

### 2. Mentor-to-Team Matching Score
$$\text{GapCoverage} = \frac{\text{Missing team skills mentor covers at } \ge \text{required level}}{\text{Total skill gaps in team}}$$

$$\text{DomainMatch} = \begin{cases} 1.0 & \text{if mentor interests/bio match project domain} \\ 0.75 & \text{partial keyword match} \\ 0.30 & \text{baseline} \end{cases}$$

$$\mathbf{\text{Mentor Score}} = (0.70 \times \text{GapCoverage}) + (0.30 \times \text{DomainMatch})$$

---

## 1-Click Demo Accounts (Pre-Seeded)

| Role | Name | Email | Password | Details |
|------|------|-------|----------|---------|
| **Student** | Rahul Verma | `rahul@student.edu` | `student123` | Java, Spring Boot, Postgres |
| **Student** | Ananya Patel | `ananya@student.edu` | `student123` | React, TypeScript, UI/UX |
| **Mentor** | Dr. Sarah Chen | `sarah.chen@skillsync.edu` | `mentor123` | Cloud Architecture, Docker, AWS |
| **Mentor** | Alex Rivera | `alex.rivera@skillsync.edu` | `mentor123` | Full Stack Web, React, Node.js |
| **Admin** | Academic Coordinator | `admin@skillsync.edu` | `admin123` | Project & Team Management |

*(A convenient **"Demo Switcher"** button in the top navigation bar lets you switch between personas with 1 click during live evaluations!)*

---

## Database Tables

- `users`: ID, name, email, password, role (`STUDENT`, `MENTOR`, `ADMIN`), interests, hours_per_week, capacity, bio
- `skills`: ID, name, category (Backend, Frontend, Cloud, Data & AI, Database)
- `user_skills`: user_id, skill_id, level (1–5)
- `projects`: ID, title, description, domain, team_size, hours_needed, difficulty, status
- `project_skills`: project_id, skill_id, required_level (1–5)
- `teams`: ID, name, project_id, mentor_id, status, created_at
- `team_members`: team_id, student_id
- `mentor_assignments`: team_id, mentor_id, score, gap_coverage, domain_match, is_assigned

---

## How to Run

### Option A: 1-Click Launch (Windows)
Double click `start-all.bat` in the root folder. It starts both servers automatically!

### Option B: Manual Terminal Execution

#### 1. Backend (Spring Boot):
```bash
cd backend
mvnw.cmd spring-boot:run
```
- Server runs on: `http://localhost:8080`
- Embedded H2 Database Web Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:skillsyncdb`
  - User: `sa` / Password: *(leave blank)*

#### 2. Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```
- Open in your browser: `http://localhost:5173`

---

## Main REST API Endpoints

- `POST /api/auth/login` & `POST /api/auth/register`
- `GET /api/skills`
- `GET /api/students/{id}/profile` & `PUT /api/students/{id}/profile`
- `GET /api/students/{id}/skills` & `PUT /api/students/{id}/skills`
- `GET /api/projects` & `POST /api/projects`
- `GET /api/projects/recommended/{studentId}`
- `GET /api/teams` & `POST /api/teams/generate`
- `GET /api/teams/my-team/{studentId}`
- `GET /api/mentors` & `GET /api/mentorship/matrix`
- `GET /api/admin/stats`
